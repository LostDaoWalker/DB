import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { getEnv } from '../config/env.js';
import { allCommandsJson } from '../interactions/registry.js';
import { logger } from '../logger.js';

let client;
let rest;
let registeredCommands = new Set();
let lastRegistrationTime = 0;
const REGISTRATION_COOLDOWN = 60000; // 1 minute minimum between registrations

export function setupCommandRegistrar(discordClient) {
  client = discordClient;
  const env = getEnv();

  rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

  // Initial command registration
  registerCommands();

  // Auto-update commands every 10 minutes
  setInterval(() => {
    registerCommands();
  }, 10 * 60 * 1000);

  // Auto-update on codebase changes (commands might have changed)
  setTimeout(() => {
    registerCommands();
  }, 30000); // 30 seconds after startup
}

async function registerCommands() {
  try {
    // Prevent rapid successive registrations
    const now = Date.now();
    if (now - lastRegistrationTime < REGISTRATION_COOLDOWN) {
      logger.debug('Command registration on cooldown, skipping');
      return;
    }

    const commands = allCommandsJson();
    const commandData = commands.map(cmd => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options || []
    }));

    const currentCommandNames = new Set(commandData.map(cmd => cmd.name));

    // Always register commands - Discord handles deduplication
    // This ensures commands are always up to date
    logger.info({ commandCount: commandData.length }, 'Registering Discord commands...');

    // Register commands for specific guild (updates instantly)
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, '1318008908756811917'),
      { body: commandData }
    );

    // Update registration tracking
    lastRegistrationTime = now;
    registeredCommands = new Set(currentCommandNames);

    logger.info({ commands: Array.from(currentCommandNames) }, 'Discord commands registered successfully');

  } catch (err) {
    logger.error({ err }, 'Failed to register Discord commands');
  }
}

export async function forceRegisterCommands() {
  registeredCommands.clear();
  await registerCommands();
}
