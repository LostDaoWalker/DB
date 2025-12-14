import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { getEnv } from '../config/env.js';
import { logger } from '../logger.js';
import { setupAutomaticBackups } from './backup.js';

let db;
let stmtCache = {};

export function initDb() {
  if (db) return db;

  const env = getEnv();
  const dbPath = env.DATABASE_PATH;
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(dbPath);
  logger.info({ path: dbPath }, 'Database initialized');

  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('temp_store = MEMORY');
  db.pragma('cache_size = 5000');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      user_id TEXT PRIMARY KEY,
      animal_key TEXT NOT NULL,
      xp INTEGER NOT NULL DEFAULT 0,
      last_battle_at INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_players_animal ON players(animal_key);
  `);

  // Pre-compile all statements for performance
  stmtCache.getPlayer = db.prepare('SELECT user_id, animal_key, xp, last_battle_at, created_at FROM players WHERE user_id = ?');
  stmtCache.createPlayer = db.prepare('INSERT INTO players (user_id, animal_key, xp, last_battle_at, created_at) VALUES (?, ?, 0, 0, ?)');
  stmtCache.updatePlayerXpAndBattleTime = db.prepare('UPDATE players SET xp = ?, last_battle_at = ? WHERE user_id = ?');

  // Setup automatic hourly backups
  setupAutomaticBackups(dbPath);

  return db;
}

export function getDb() {
  if (!db) return initDb();
  return db;
}

export function getPlayer(userId) {
  return stmtCache.getPlayer.get(userId);
}

export function createPlayer({ userId, animalKey, now }) {
  stmtCache.createPlayer.run(userId, animalKey, now);
  return getPlayer(userId);
}

export function updatePlayerXpAndBattleTime({ userId, xp, lastBattleAt }) {
  stmtCache.updatePlayerXpAndBattleTime.run(xp, lastBattleAt, userId);
}
