import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

let db;

export function initDb() {
  if (db) return db;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, 'game.sqlite3');
  db = new Database(dbPath);

  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('temp_store = MEMORY');

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

  return db;
}

export function getDb() {
  if (!db) return initDb();
  return db;
}

export function getPlayer(userId) {
  return getDb().prepare('SELECT user_id, animal_key, xp, last_battle_at, created_at FROM players WHERE user_id = ?').get(userId);
}

export function createPlayer({ userId, animalKey, now }) {
  getDb()
    .prepare(
      'INSERT INTO players (user_id, animal_key, xp, last_battle_at, created_at) VALUES (?, ?, 0, 0, ?)'
    )
    .run(userId, animalKey, now);
  return getPlayer(userId);
}

export function updatePlayerXpAndBattleTime({ userId, xp, lastBattleAt }) {
  getDb().prepare('UPDATE players SET xp = ?, last_battle_at = ? WHERE user_id = ?').run(xp, lastBattleAt, userId);
}
