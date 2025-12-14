import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';
import { getEnv } from '../config/env.js';
import { logger } from '../logger.js';
import { setupAutomaticBackups } from './backup.js';
import { SchemaExecutor } from './schema-executor.js';

let db;
let schemaExecutor;

export function initDb() {
  return new Promise(async (resolve, reject) => {
    if (db) return resolve(db);

    try {
      const env = getEnv();
      const dbPath = env.DATABASE_PATH;
      const dbDir = path.dirname(dbPath);

      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      db = new sqlite3.Database(dbPath, async (err) => {
        if (err) {
          logger.error({ err, path: dbPath }, 'Failed to open database');
          return reject(err);
        }

        logger.info({ path: dbPath }, 'Database connection established');

        try {
          // Initialize schema executor and apply schema
          schemaExecutor = new SchemaExecutor(db);
          await schemaExecutor.initialize();

          // Setup automatic hourly backups
          setupAutomaticBackups(dbPath);

          logger.info({ path: dbPath }, 'Database fully initialized with dynamic schema');
          resolve(db);

        } catch (schemaErr) {
          logger.error({ err: schemaErr }, 'Failed to initialize database schema');
          reject(schemaErr);
        }
      });
    } catch (err) {
      logger.error({ err }, 'Failed to initialize database');
      reject(err);
    }
  });
}

export function getDb() {
  if (!db) return initDb();
  return db;
}

export function getPlayer(userId) {
  return safeDbOperation(() => {
    return new Promise((resolve, reject) => {
      db.get('SELECT user_id, animal_key, xp, last_battle_at, created_at, last_animal_change, evolution_points, evolved_animal_key FROM players WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
          logger.error({ err, userId }, 'Database error in getPlayer');
          return reject(err);
        }
        resolve(row || null);
      });
    });
  }, 'Player data retrieval');
}

export function createPlayer({ userId, animalKey, now }) {
  return safeDbOperation(async () => {
    // Use INSERT OR REPLACE to make it idempotent
    await new Promise((resolve, reject) => {
      db.run('INSERT OR REPLACE INTO players (user_id, animal_key, xp, last_battle_at, created_at, registered_at) VALUES (?, ?, 0, 0, ?, ?)',
        [userId, animalKey, now, now], function(err) {
        if (err) {
          logger.error({ err, userId, animalKey }, 'Database error in createPlayer');
          return reject(err);
        }
        resolve();
      });
    });
    return await getPlayer(userId);
  }, 'Player creation');
}

export function updatePlayerXpAndBattleTime({ userId, xp, lastBattleAt }) {
  return safeDbOperation(() => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE players SET xp = ?, last_battle_at = ? WHERE user_id = ?', [xp, lastBattleAt, userId], function(err) {
        if (err) {
          logger.error({ err, userId, xp, lastBattleAt }, 'Database error in updatePlayerXpAndBattleTime');
          return reject(err);
        }
        resolve();
      });
    });
  }, 'XP and battle time update');
}

export function updatePlayerCommandUsage({ userId, commandName, now }) {
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE players
      SET last_command_used = ?, last_command_at = ?, commands_used = commands_used + 1, last_played_at = ?
      WHERE user_id = ?
    `, [commandName, now, now, userId], function(err) {
      if (err) {
        logger.error({ err, userId, commandName }, 'Database error in updatePlayerCommandUsage');
        return reject(err);
      }
      resolve();
    });
  });
}

export function updatePlayerBattleStats({ userId, won, now }) {
  return new Promise((resolve, reject) => {
    const winField = won ? 'total_wins' : 'total_losses';
    const streakUpdate = won ?
      'current_streak = current_streak + 1, best_streak = MAX(best_streak, current_streak + 1)' :
      'current_streak = 0';

    db.run(`
      UPDATE players
      SET total_battles = total_battles + 1,
          ${winField} = ${winField} + 1,
          ${streakUpdate},
          last_played_at = ?
      WHERE user_id = ?
    `, [now, userId], function(err) {
      if (err) {
        logger.error({ err, userId, won }, 'Database error in updatePlayerBattleStats');
        return reject(err);
      }
      resolve();
    });
  });
}

export function getLeaderboard(limit = 10) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT user_id, animal_key, xp, total_battles, total_wins, total_losses,
             current_streak, best_streak, registered_at, last_played_at
      FROM players
      ORDER BY xp DESC, total_wins DESC
      LIMIT ?
    `, [limit], (err, rows) => {
      if (err) {
        logger.error({ err }, 'Database error in getLeaderboard');
        return reject(err);
      }
      resolve(rows || []);
    });
  });
}

export function getPlayerStats(userId) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT user_id, animal_key, xp, last_battle_at, created_at, registered_at,
             last_command_used, last_command_at, commands_used, total_battles,
             total_wins, total_losses, current_streak, best_streak, last_played_at
      FROM players WHERE user_id = ?
    `, [userId], (err, row) => {
      if (err) {
        logger.error({ err, userId }, 'Database error in getPlayerStats');
        return reject(err);
      }
      resolve(row || null);
    });
  });
}

export function updatePlayerAnimal(userId, animalKey, now) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE players SET animal_key = ?, last_animal_change = ? WHERE user_id = ?', [animalKey, now, userId], function(err) {
      if (err) {
        logger.error({ err, userId, animalKey }, 'Database error in updatePlayerAnimal');
        return reject(err);
      }
      resolve();
    });
  });
}

export function deletePlayer(userId) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM players WHERE user_id = ?', [userId], function(err) {
      if (err) {
        logger.error({ err, userId }, 'Database error in deletePlayer');
        return reject(err);
      }
      logger.info({ userId, changes: this.changes }, 'Player data deleted');
      resolve(this.changes > 0);
    });
  });
}

// Health monitoring system for softlock prevention
let dbHealthStatus = 'healthy';
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

export async function checkDatabaseHealth() {
  const now = Date.now();
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return dbHealthStatus;
  }

  lastHealthCheck = now;

  try {
    // Simple health check - try to read from a table
    await new Promise((resolve, reject) => {
      db.get('SELECT 1 as health_check', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    dbHealthStatus = 'healthy';
    return 'healthy';
  } catch (err) {
    logger.error({ err }, 'Database health check failed');
    dbHealthStatus = 'unhealthy';
    return 'unhealthy';
  }
}

export function getDatabaseHealthStatus() {
  return dbHealthStatus;
}

// Safe database operations with health checks
export async function safeDbOperation(operation, operationName) {
  const health = await checkDatabaseHealth();

  if (health === 'unhealthy') {
    throw new Error(`Database is currently unavailable. ${operationName} cannot be completed at this time.`);
  }

  try {
    return await operation();
  } catch (err) {
    // Mark database as potentially unhealthy
    dbHealthStatus = 'degraded';

    // Re-throw with context
    const enhancedError = new Error(`${operationName} failed: ${err.message}`);
    enhancedError.originalError = err;
    throw enhancedError;
  }
}

export function logBotEvent(eventType, details = {}) {
  const eventData = {
    event_type: eventType,
    timestamp: Date.now(),
    details: JSON.stringify(details)
  };

  return safeDbOperation(() => {
    return new Promise((resolve, reject) => {
      // bot_events table is now managed by the schema system
      db.run(
        'INSERT INTO bot_events (event_type, timestamp, details) VALUES (?, ?, ?)',
        [eventData.event_type, eventData.timestamp, eventData.details],
        function(err) {
          if (err) {
            logger.error({ err, eventType }, 'Failed to log bot event');
            return reject(err);
          }
          logger.info({ eventType, eventId: this.lastID }, 'Bot event logged');
          resolve(this.lastID);
        }
      );
    });
  }, 'Bot event logging');
}

// Idempotent operations - safe to run multiple times
export async function ensurePlayerExists(userId) {
  return safeDbOperation(async () => {
    const existing = await getPlayer(userId);

    if (!existing) {
      // Create minimal player record
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT OR IGNORE INTO players (user_id, xp, created_at, registered_at) VALUES (?, 0, ?, ?)',
          [userId, Date.now(), Date.now()],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    return await getPlayer(userId);
  }, 'Player existence check');
}

export function grantEvolutionPoints(userId, points) {
  return safeDbOperation(() => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE players SET evolution_points = evolution_points + ? WHERE user_id = ?', [points, userId], function(err) {
        if (err) {
          logger.error({ err, userId, points }, 'Database error in grantEvolutionPoints');
          return reject(err);
        }
        resolve();
      });
    });
  }, 'Evolution points grant');
}

export function spendEvolutionPoints(userId, points) {
  return safeDbOperation(() => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE players SET evolution_points = evolution_points - ? WHERE user_id = ? AND evolution_points >= ?', [points, userId, points], function(err) {
        if (err) {
          logger.error({ err, userId, points }, 'Database error in spendEvolutionPoints');
          return reject(err);
        }
        if (this.changes === 0) {
          return reject(new Error('Insufficient evolution points'));
        }
        resolve();
      });
    });
  }, 'Evolution points spend');
}

export function evolvePlayerAnimal(userId, evolvedAnimalKey, epCost) {
  return safeDbOperation(async () => {
    // First spend the EP
    await spendEvolutionPoints(userId, epCost);

    // Then update the animal
    await new Promise((resolve, reject) => {
      db.run('UPDATE players SET evolved_animal_key = ? WHERE user_id = ?', [evolvedAnimalKey, userId], function(err) {
        if (err) {
          logger.error({ err, userId, evolvedAnimalKey }, 'Database error in evolvePlayerAnimal');
          return reject(err);
        }
        resolve();
      });
    });

    return await getPlayer(userId);
  }, 'Player animal evolution');
}
