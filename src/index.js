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

// Helper function to sanitize and format error details for user display
function sanitizeErrorDetails(err) {
  let errorName = err.name || 'Error';
  let errorMessage = err.message || 'Unknown error';
  let stackLines = [];

  // Extract relevant stack trace lines (first few, sanitized)
  if (err.stack) {
    const stackArray = err.stack.split('\n').slice(0, 5); // First 5 lines
    stackLines = stackArray.map(line => {
      // Remove full file paths and sensitive information
      return line
        .replace(/file:\/\/\/[a-zA-Z]:\/[^)]*\//g, '') // Remove Windows file paths
        .replace(/\/[a-zA-Z0-9_./-]+\/[^)]*\//g, '') // Remove Unix file paths
        .replace(/:[0-9]+:[0-9]+/g, '') // Remove line/column numbers
        .trim();
    }).filter(line => line && !line.includes('node:internal'));
  }

  return {
    name: errorName,
    message: errorMessage,
    stack: stackLines.slice(0, 3) // Limit to 3 stack lines
  };
}

// Helper function to provide detailed, user-friendly error messages
function getUserFriendlyErrorMessage(err, interaction) {
  const sanitized = sanitizeErrorDetails(err);
  const errorMessage = err.message?.toLowerCase() || '';
  const commandName = interaction.commandName || interaction.customId?.split(':')[0] || 'command';

  // Build detailed error info
  let details = `\`\`\`\n${sanitized.name}: ${sanitized.message}`;
  if (sanitized.stack.length > 0) {
    details += '\n' + sanitized.stack.join('\n');
  }
  details += '\n\`\`\`';

  // Database-related errors
  if (errorMessage.includes('database') || errorMessage.includes('sqlite') || errorMessage.includes('sql')) {
    return `🐾 **Database Error**\nYour game data is safe, but there was a database issue.\n\n${details}\n\nTry again in a moment.`;
  }

  // Network/API errors
  if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('fetch')) {
    return `🌐 **Connection Error**\nThe bot is having trouble connecting to services.\n\n${details}\n\nPlease try again in a few seconds.`;
  }

  // Discord API errors
  if (errorMessage.includes('discord') || errorMessage.includes('api') || errorMessage.includes('interaction')) {
    if (errorMessage.includes('already replied')) {
      return `⚡ **Interaction Conflict**\nResponse already sent - this happens with rapid clicks.\n\n${details}\n\nTry again.`;
    }
    if (errorMessage.includes('unknown interaction')) {
      return `⏰ **Interaction Expired**\nThis interaction timed out.\n\n${details}\n\nPlease try the command again.`;
    }
    return `🤖 **Discord API Error**\nCommunication issue with Discord.\n\n${details}\n\nTry again. If this persists, the bot might be updating.`;
  }

  // File/rendering errors
  if (errorMessage.includes('canvas') || errorMessage.includes('render') || errorMessage.includes('image')) {
    return `🎨 **Rendering Error**\nIssue creating battle visuals, but battle completed.\n\n${details}\n\nThe battle counts - try again for the visual.`;
  }

  // Permission errors
  if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
    return `🔒 **Permission Error**\nBot permissions issue in this server.\n\n${details}\n\nContact a server admin.`;
  }

  // Memory/resource errors
  if (errorMessage.includes('memory') || errorMessage.includes('heap') || errorMessage.includes('out of memory')) {
    return `💾 **Resource Error**\nBot is experiencing memory pressure.\n\n${details}\n\nWait a moment and try again.`;
  }

  // Command-specific errors with details
  if (commandName === 'battle') {
    return `⚔️ **Battle Error**\nSomething went wrong during battle.\n\n${details}\n\nYour stats are safe - try battling again.`;
  }

  if (commandName === 'start') {
    if (errorMessage.includes('animal selection system')) {
      return `🐾 **Animal System Error**\nAnimal selection system unavailable.\n\n${details}\n\nTry again in a few minutes.`;
    }
    return `🐾 **Start Error**\nFailed to initialize animal selection.\n\n${details}\n\nPlease try choosing your animal again.`;
  }

  if (commandName === 'profile') {
    return `📊 **Profile Error**\nFailed to load profile data.\n\n${details}\n\nTry viewing your profile again.`;
  }

  // Fallback with full error details
  return `🐺 **Unexpected Error**\nAn unexpected error occurred.\n\n${details}\n\nThe developers have been notified. Please try again.`;
}

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

    // Provide specific, helpful error messages to users
    const errorMessage = getUserFriendlyErrorMessage(err, interaction);

    try {
      if (interaction.isRepliable()) {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({ content: errorMessage });
        } else {
          await interaction.reply({ content: errorMessage });
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
