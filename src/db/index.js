import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';
import { getEnv } from '../config/env.js';
import { logger } from '../logger.js';
import { setupAutomaticBackups } from './backup.js';

let db;

export function initDb() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const env = getEnv();
    const dbPath = env.DATABASE_PATH;
    const dbDir = path.dirname(dbPath);

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error({ err, path: dbPath }, 'Failed to open database');
        return reject(err);
      }

      logger.info({ path: dbPath }, 'Database initialized');

      // Configure SQLite pragmas
      db.run('PRAGMA journal_mode = WAL');
      db.run('PRAGMA synchronous = NORMAL');
      db.run('PRAGMA temp_store = MEMORY');
      db.run('PRAGMA cache_size = 5000');
      db.run('PRAGMA foreign_keys = ON');

      // Create tables with data safety features
      db.run(`
        CREATE TABLE IF NOT EXISTS players (
          user_id TEXT PRIMARY KEY,
          animal_key TEXT NOT NULL,
          xp INTEGER NOT NULL DEFAULT 0 CHECK(xp >= 0),
          last_battle_at INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          registered_at INTEGER NOT NULL DEFAULT 0,
          last_command_used TEXT DEFAULT '',
          last_command_at INTEGER DEFAULT 0,
          commands_used INTEGER DEFAULT 0,
          total_battles INTEGER DEFAULT 0,
          total_wins INTEGER DEFAULT 0,
          total_losses INTEGER DEFAULT 0,
          current_streak INTEGER DEFAULT 0,
          best_streak INTEGER DEFAULT 0,
          last_played_at INTEGER DEFAULT 0
        )
      `, (err) => {
        if (err) {
          logger.error({ err }, 'Failed to create players table');
          return reject(err);
        }

        // Create indexes
        db.run('CREATE INDEX IF NOT EXISTS idx_players_animal ON players(animal_key)', (err) => {
          if (err) {
            logger.error({ err }, 'Failed to create animal index');
            return reject(err);
          }

          db.run('CREATE INDEX IF NOT EXISTS idx_players_registered ON players(registered_at)', (err) => {
            if (err) {
              logger.error({ err }, 'Failed to create registration index');
              return reject(err);
            }

            // Setup automatic hourly backups
            setupAutomaticBackups(dbPath);
            resolve(db);
          });
        });
      });
    });
  });
}

export function getDb() {
  if (!db) return initDb();
  return db;
}

export function getPlayer(userId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT user_id, animal_key, xp, last_battle_at, created_at FROM players WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        logger.error({ err, userId }, 'Database error in getPlayer');
        return reject(err);
      }
      resolve(row || null);
    });
  });
}

export function createPlayer({ userId, animalKey, now }) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO players (user_id, animal_key, xp, last_battle_at, created_at, registered_at) VALUES (?, ?, 0, 0, ?, ?)', [userId, animalKey, now, now], function(err) {
      if (err) {
        logger.error({ err, userId, animalKey }, 'Database error in createPlayer');
        return reject(err);
      }
      getPlayer(userId).then(resolve).catch(reject);
    });
  });
}

export function updatePlayerXpAndBattleTime({ userId, xp, lastBattleAt }) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE players SET xp = ?, last_battle_at = ? WHERE user_id = ?', [xp, lastBattleAt, userId], function(err) {
      if (err) {
        logger.error({ err, userId, xp, lastBattleAt }, 'Database error in updatePlayerXpAndBattleTime');
        return reject(err);
      }
      resolve();
    });
  });
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

export function logBotEvent(eventType, details = {}) {
  const eventData = {
    event_type: eventType,
    timestamp: Date.now(),
    details: JSON.stringify(details)
  };

  return new Promise((resolve, reject) => {
    // Create bot_events table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS bot_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        details TEXT
      )
    `, (err) => {
      if (err) {
        logger.error({ err }, 'Failed to create bot_events table');
        return reject(err);
      }

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
  });
}
