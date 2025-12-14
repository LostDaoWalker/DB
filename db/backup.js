import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../logger.js';

export function backupDatabase(dbPath) {
  try {
    const backupDir = path.join(path.dirname(dbPath), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `game-${timestamp}.sqlite3`);

    fs.copyFileSync(dbPath, backupPath);
    logger.debug({ backup: backupPath }, 'Database backup created');

    // Keep only last 10 backups
    const files = fs.readdirSync(backupDir).sort().reverse();
    if (files.length > 10) {
      files.slice(10).forEach((file) => {
        fs.unlinkSync(path.join(backupDir, file));
      });
    }
  } catch (err) {
    logger.error({ err }, 'Failed to create database backup');
  }
}

export function setupAutomaticBackups(dbPath, intervalMs = 3600000) {
  // Backup every hour by default
  setInterval(() => {
    backupDatabase(dbPath);
  }, intervalMs);

  // Initial backup on startup
  backupDatabase(dbPath);
}
