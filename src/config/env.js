import process from 'node:process';
import 'dotenv/config';

export function getEnv() {
  const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
  const CLIENT_ID = process.env.CLIENT_ID;

  if (!DISCORD_TOKEN) throw new Error('Missing DISCORD_TOKEN in environment.');
  if (!CLIENT_ID) throw new Error('Missing CLIENT_ID in environment.');

  const GUILD_ID = process.env.GUILD_ID || '';
  const SUPPORT_SERVER_ID = process.env.SUPPORT_SERVER_ID || '';
  const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  const DATABASE_PATH = process.env.DATABASE_PATH || './data/game.sqlite3';

  return {
    DISCORD_TOKEN,
    CLIENT_ID,
    GUILD_ID: GUILD_ID || undefined,
    SUPPORT_SERVER_ID: SUPPORT_SERVER_ID || undefined,
    LOG_LEVEL,
    DATABASE_PATH,
  };
}
