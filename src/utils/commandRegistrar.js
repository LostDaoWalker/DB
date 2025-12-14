import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { getEnv } from '../config/env.js';
import { allCommandsJson } from '../interactions/registry.js';
import { logger } from '../logger.js';

let client;
let rest;
let registeredCommandData = null; // Store full command data for comparison
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
    const commands = allCommandsJson();
    const commandData = commands.map(cmd => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options || []
    }));

    // Check if commands have actually changed
    const commandsChanged = !registeredCommandData ||
      JSON.stringify(commandData) !== JSON.stringify(registeredCommandData);

    if (!commandsChanged) {
      logger.debug('Commands unchanged, skipping registration');
      return;
    }

    // Prevent rapid successive registrations even if commands changed
    const now = Date.now();
    if (now - lastRegistrationTime < REGISTRATION_COOLDOWN) {
      logger.debug('Command registration on cooldown, skipping');
      return;
    }

    const currentCommandNames = new Set(commandData.map(cmd => cmd.name));

    logger.info({ commandCount: commandData.length }, 'Registering Discord commands...');

    // Register commands for specific guild (updates instantly)
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, '1318008908756811917'),
      { body: commandData }
    );

    // Update registration tracking
    lastRegistrationTime = now;
    registeredCommandData = commandData;

    logger.info({ commands: Array.from(currentCommandNames) }, 'Discord commands registered successfully');

  } catch (err) {
    logger.error({ err }, 'Failed to register Discord commands');
  }
}

export async function forceRegisterCommands() {
  registeredCommandData = null; // Force re-registration by clearing stored data
  await registerCommands();
}
