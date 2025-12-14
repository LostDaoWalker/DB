import pino from 'pino';
import { getEnv } from './config/env.js';

const env = getEnv();

export const logger = pino({
  level: env.LOG_LEVEL,
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});
