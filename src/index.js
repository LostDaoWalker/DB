import process from 'node:process';
import { Client, GatewayIntentBits, Partials, Options } from 'discord.js';
import { getEnv } from './config/env.js';
import { logger } from './logger.js';
import { initDb } from './db/index.js';
import { registry } from './interactions/registry.js';
import { setupCodebaseMonitor } from './utils/codebaseMonitor.js';
import { setupPlayerActivityLogger } from './utils/playerActivityLogger.js';
import { setupAutoGit } from './utils/autoGit.js';
import { setupCommandRegistrar } from './utils/commandRegistrar.js';
import { testChannelAccess } from './utils/channelTest.js';
import { updatePlayerCommandUsage, logBotEvent } from './db/index.js';

// Ensure all errors are handled - no unhandled rejections or exceptions
process.on('unhandledRejection', async (err) => {
  logger.error({ err }, 'Unhandled promise rejection - shutting down');
  try {
    await logBotEvent('bot_crash', { error: err.message, type: 'unhandledRejection' });
  } catch (logErr) {
    logger.warn({ logErr }, 'Failed to log crash event');
  }
  process.exit(1);
});

process.on('uncaughtException', async (err) => {
  logger.error({ err }, 'Uncaught exception - shutting down');
  try {
    await logBotEvent('bot_crash', { error: err.message, type: 'uncaughtException' });
  } catch (logErr) {
    logger.warn({ logErr }, 'Failed to log crash event');
  }
  process.exit(1);
});

// Handle process termination signals gracefully
process.on('SIGINT', async () => {
  logger.info('Received SIGINT - shutting down gracefully');
  try {
    await logBotEvent('bot_shutdown', { reason: 'SIGINT', uptime: process.uptime() });
  } catch (logErr) {
    logger.warn({ logErr }, 'Failed to log shutdown event');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM - shutting down gracefully');
  try {
    await logBotEvent('bot_shutdown', { reason: 'SIGTERM', uptime: process.uptime() });
  } catch (logErr) {
    logger.warn({ logErr }, 'Failed to log shutdown event');
  }
  process.exit(0);
});

let env;
try {
  env = getEnv();
} catch (err) {
  console.error('Failed to load environment configuration:', err.message);
  process.exit(1);
}

try {
  await initDb();
} catch (err) {
  logger.error({ err }, 'Failed to initialize database - shutting down');
  process.exit(1);
}

// Deduplication map for rapid successive interactions
const pendingInteractions = new Map();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    MessageManager: 0,
    GuildMemberManager: 0,
    PresenceManager: 0,
    ReactionManager: 0,
    VoiceStateManager: 0,
    ThreadManager: 0,
  }),
  sweepers: {
    ...Options.DefaultSweeperSettings,
    guildMembers: {
      interval: 600, // 10 minutes
      filter: () => mem => mem.id === client.user.id,
    },
  },
});

client.once('clientReady', async () => {
  logger.info({ user: client.user?.tag }, 'Bot is ready');

  // Log bot startup
  try {
    await logBotEvent('bot_online', {
      user: client.user?.tag,
      guilds: client.guilds.cache.size,
      uptime: process.uptime()
    });
  } catch (err) {
    logger.warn({ err }, 'Failed to log bot startup event');
  }

  // Test channel access first
  const channelOk = await testChannelAccess(client);
  if (channelOk) {
    logger.info('Channel access confirmed - logging systems active');
  } else {
    logger.warn('Channel access failed - logging systems may not work');
  }

  setupCodebaseMonitor(client);
  setupPlayerActivityLogger(client);
  setupCommandRegistrar(client);
  setupAutoGit();
});

client.on('error', (err) => {
  logger.error({ err }, 'Discord client error');
});

client.on('interactionCreate', async (interaction) => {
  try {
    // Deduplicate rapid successive interactions from same user
    const dedupeKey = `${interaction.user.id}:${interaction.commandName || interaction.customId}`;
    if (pendingInteractions.has(dedupeKey)) {
      return;
    }
    pendingInteractions.set(dedupeKey, true);
    setTimeout(() => pendingInteractions.delete(dedupeKey), 500);

    if (interaction.isChatInputCommand()) {
      const cmd = registry.commands.get(interaction.commandName);
      if (!cmd) {
        logger.warn({ commandName: interaction.commandName }, 'Unknown command');
        return;
      }

      // Track command usage
      try {
        await updatePlayerCommandUsage({
          userId: interaction.user.id,
          commandName: interaction.commandName,
          now: Date.now()
        });
      } catch (err) {
        logger.warn({ err, userId: interaction.user.id, commandName: interaction.commandName }, 'Failed to track command usage');
      }

      await cmd.execute(interaction);
      return;
    }

    if (interaction.isStringSelectMenu() || interaction.isButton()) {
      const handler = registry.components.get(interaction.customId);
      if (!handler) {
        logger.warn({ customId: interaction.customId }, 'Unknown component');
        return;
      }
      await handler.execute(interaction);
    }
  } catch (err) {
    logger.error({ err, type: interaction.type, userId: interaction.user?.id }, 'Interaction error');

    const content = 'Something went wrong in the woods. Try again in a moment.';
    try {
      if (interaction.isRepliable()) {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({ content, ephemeral: true });
        } else {
          await interaction.reply({ content, ephemeral: true });
        }
      }
    } catch (replyErr) {
      logger.error({ err: replyErr, originalErr: err }, 'Failed to send error response to user');
    }
  }
});

// Attempt to login with error handling
try {
  await client.login(env.DISCORD_TOKEN);
  logger.info('Successfully logged in to Discord');
} catch (err) {
  logger.error({ err }, 'Failed to login to Discord - shutting down');
  process.exit(1);
}
