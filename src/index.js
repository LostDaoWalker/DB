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

// Universal softlock prevention system
class SoftlockPreventionSystem {
  constructor() {
    this.pendingInteractions = new Map();
    this.failedInteractions = new Map();
    this.recoveryTimeouts = new Map();
    this.interactionStates = new Map();
  }

  // Track interaction state for recovery
  trackInteraction(interaction) {
    const key = `${interaction.user.id}:${interaction.commandName || interaction.customId}`;
    const state = {
      id: interaction.id,
      userId: interaction.user.id,
      type: interaction.type,
      commandName: interaction.commandName,
      customId: interaction.customId,
      timestamp: Date.now(),
      attempts: 0,
      lastError: null
    };
    this.interactionStates.set(key, state);
    return state;
  }

  // Mark interaction as completed successfully
  completeInteraction(interaction) {
    const key = `${interaction.user.id}:${interaction.commandName || interaction.customId}`;
    this.pendingInteractions.delete(key);
    this.failedInteractions.delete(key);
    this.interactionStates.delete(key);
  }

  // Handle failed interaction with recovery
  failInteraction(interaction, error) {
    const key = `${interaction.user.id}:${interaction.commandName || interaction.customId}`;
    const state = this.interactionStates.get(key);

    if (state) {
      state.attempts++;
      state.lastError = error.message;
      state.lastFailure = Date.now();

      // If too many failures, provide recovery guidance
      if (state.attempts >= 3) {
        this.scheduleRecovery(interaction.user.id, state);
      }
    }

    this.pendingInteractions.delete(key);
  }

  // Schedule recovery message for repeatedly failing user
  scheduleRecovery(userId, state) {
    const recoveryKey = `recovery_${userId}_${state.commandName || state.customId}`;

    if (!this.recoveryTimeouts.has(recoveryKey)) {
      const timeout = setTimeout(() => {
        this.sendRecoveryMessage(userId, state);
        this.recoveryTimeouts.delete(recoveryKey);
      }, 30000); // Send recovery message after 30 seconds

      this.recoveryTimeouts.set(recoveryKey, timeout);
    }
  }

  // Send recovery guidance message
  async sendRecoveryMessage(userId, state) {
    try {
      // This would send a DM to the user with recovery guidance
      // For now, we'll log it - in production this would use client.users.fetch()
      logger.info({ userId, state }, 'Sending recovery guidance for repeatedly failing interaction');

      // Clear the failed state
      const key = `${userId}:${state.commandName || state.customId}`;
      this.interactionStates.delete(key);
      this.failedInteractions.delete(key);
    } catch (err) {
      logger.error({ err, userId }, 'Failed to send recovery message');
    }
  }

  // Check if interaction should be deduplicated
  shouldDeduplicate(interaction) {
    const key = `${interaction.user.id}:${interaction.commandName || interaction.customId}`;
    const existing = this.pendingInteractions.get(key);

    if (existing) {
      const age = Date.now() - existing.timestamp;
      if (age < 500) { // Within 500ms, deduplicate
        return true;
      }
    }

    // Track new interaction
    this.pendingInteractions.set(key, {
      timestamp: Date.now(),
      interactionId: interaction.id
    });

    return false;
  }

  // Clean up old states periodically
  cleanup() {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    // Clean up old pending interactions
    for (const [key, data] of this.pendingInteractions) {
      if (now - data.timestamp > maxAge) {
        this.pendingInteractions.delete(key);
      }
    }

    // Clean up old interaction states
    for (const [key, state] of this.interactionStates) {
      if (now - state.timestamp > maxAge) {
        this.interactionStates.delete(key);
      }
    }

    // Clean up old failed interactions
    for (const [key, data] of this.failedInteractions) {
      if (now - data.timestamp > maxAge) {
        this.failedInteractions.delete(key);
      }
    }
  }
}

// Global softlock prevention system
const softlockSystem = new SoftlockPreventionSystem();

// Periodic cleanup
setInterval(() => {
  softlockSystem.cleanup();
}, 5 * 60 * 1000); // Clean up every 5 minutes

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

// Helper function to provide recovery guidance for common softlock scenarios
function getRecoveryGuidance(err, interaction) {
  const errorMessage = err.message?.toLowerCase() || '';
  const commandName = interaction.commandName || interaction.customId?.split(':')[0] || 'command';

  // Database connection issues
  if (errorMessage.includes('database') || errorMessage.includes('sqlite') || errorMessage.includes('connection')) {
    return '\n\n**🔧 Recovery:** The bot\'s database is temporarily unavailable. Please try again in a few moments. Your data is safe.';
  }

  // Permission issues
  if (errorMessage.includes('permission') || errorMessage.includes('forbidden') || errorMessage.includes('missing access')) {
    return '\n\n**🔒 Recovery:** Check that the bot has proper permissions in this server. Contact a server admin if issues persist.';
  }

  // Rate limiting
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests') || errorMessage.includes('cooldown')) {
    return '\n\n**⏱️ Recovery:** You\'re doing that too quickly! Please wait a moment before trying again.';
  }

  // Timeout/interaction expired
  if (errorMessage.includes('interaction') && (errorMessage.includes('expired') || errorMessage.includes('timeout'))) {
    return '\n\n**⏰ Recovery:** This interaction timed out. Please use the command again to restart.';
  }

  // Network/API issues
  if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('fetch')) {
    return '\n\n**🌐 Recovery:** Network issue detected. Please try again in a few seconds.';
  }

  // Data corruption or invalid state
  if (errorMessage.includes('corrupt') || errorMessage.includes('invalid') || errorMessage.includes('not found')) {
    return '\n\n**🔄 Recovery:** Your game data may need refreshing. Try using `/start` to reinitialize.';
  }

  // Generic recovery guidance
  return '\n\n**💡 Recovery:** If this error persists, try using `/start` to refresh your session, or contact support.';
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

  // Fallback with full error details and recovery guidance
  const recoveryGuidance = getRecoveryGuidance(err, interaction);
  return `🐺 **Unexpected Error**\nAn unexpected error occurred.\n\n${details}${recoveryGuidance}`;
}

client.on('interactionCreate', async (interaction) => {
  // Track interaction for softlock prevention
  const interactionState = softlockSystem.trackInteraction(interaction);

  try {
    // Universal softlock prevention - check for deduplication
    if (softlockSystem.shouldDeduplicate(interaction)) {
      return;
    }

    // Handle different interaction types with comprehensive error recovery
    if (interaction.isChatInputCommand()) {
      await handleCommandInteraction(interaction);
    } else if (interaction.isStringSelectMenu() || interaction.isButton()) {
      await handleComponentInteraction(interaction);
    }

    // Mark as successfully completed
    softlockSystem.completeInteraction(interaction);

  } catch (err) {
    // Comprehensive error handling with recovery guidance
    logger.error({ err, type: interaction.type, userId: interaction.user?.id, interactionState }, 'Interaction error');

    // Mark as failed for recovery tracking
    softlockSystem.failInteraction(interaction, err);

    // Provide specific, helpful error messages with recovery guidance
    const errorMessage = getUserFriendlyErrorMessage(err, interaction);

    try {
      if (interaction.isRepliable()) {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({ content: errorMessage, ephemeral: false });
        } else {
          await interaction.reply({ content: errorMessage, ephemeral: false });
        }
      }
    } catch (replyErr) {
      logger.error({ err: replyErr, originalErr: err }, 'Failed to send error response to user');
    }
  }
});

// Handle command interactions with comprehensive error recovery
async function handleCommandInteraction(interaction) {
  const cmd = registry.commands.get(interaction.commandName);
  if (!cmd) {
    logger.warn({ commandName: interaction.commandName }, 'Unknown command');
    await interaction.reply({
      content: `❌ **Unknown Command**\nThe command \`${interaction.commandName}\` is not available.\n\n**💡 Try:** Use \`/start\` to access the game, or \`/help\` for available commands.`,
      ephemeral: false
    });
    return;
  }

  // Execute with timeout protection
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Command execution timed out')), 30000); // 30 second timeout
  });

  try {
    await Promise.race([
      executeCommandSafely(interaction, cmd),
      timeoutPromise
    ]);
  } catch (err) {
    if (err.message === 'Command execution timed out') {
      await interaction.followUp({
        content: `⏰ **Command Timeout**\nThe command took too long to execute.\n\n**💡 Recovery:** Try the command again. If this persists, the bot may be experiencing high load.`,
        ephemeral: false
      });
    }
    throw err;
  }
}

// Safe command execution with retry logic
async function executeCommandSafely(interaction, cmd, retryCount = 0) {
  const maxRetries = 2;

  try {
    // Track command usage (non-blocking)
    updatePlayerCommandUsage({
      userId: interaction.user.id,
      commandName: interaction.commandName,
      now: Date.now()
    }).catch(err => {
      logger.warn({ err, userId: interaction.user.id, commandName: interaction.commandName }, 'Failed to track command usage');
    });

    await cmd.execute(interaction);
  } catch (err) {
    // Retry logic for transient failures
    if (retryCount < maxRetries && isRetryableError(err)) {
      logger.warn({ err, retryCount, commandName: interaction.commandName }, 'Retrying command execution');
      await sleep(1000 * (retryCount + 1)); // Exponential backoff
      return executeCommandSafely(interaction, cmd, retryCount + 1);
    }

    throw err;
  }
}

// Handle component interactions with timeout protection
async function handleComponentInteraction(interaction) {
  const handler = registry.components.get(interaction.customId);
  if (!handler) {
    logger.warn({ customId: interaction.customId }, 'Unknown component');
    await safeInteractionUpdate(interaction, {
      content: `❌ **Unknown Interaction**\nThis interaction is no longer available.\n\n**💡 Recovery:** Use \`/start\` to restart your session.`,
      components: []
    });
    return;
  }

  // Execute with timeout protection
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Component execution timed out')), 15000); // 15 second timeout
  });

  try {
    await Promise.race([
      handler.execute(interaction),
      timeoutPromise
    ]);
  } catch (err) {
    if (err.message === 'Component execution timed out') {
      await safeInteractionUpdate(interaction, {
        content: `⏰ **Interaction Timeout**\nThis interaction took too long to process.\n\n**💡 Recovery:** Use the command again to restart.`,
        components: []
      });
    } else if (err.message?.includes('interaction') && err.message?.includes('expired')) {
      // Interaction expired - this is expected, don't throw
      return;
    }
    throw err;
  }
}

// Safe interaction update that handles expired interactions
async function safeInteractionUpdate(interaction, data) {
  try {
    if (interaction.isRepliable()) {
      await interaction.update(data);
    }
  } catch (err) {
    if (err.message?.includes('interaction') && err.message?.includes('expired')) {
      // Expected - interaction timed out
      return;
    }
    throw err;
  }
}

// Check if an error is retryable
function isRetryableError(err) {
  const message = err.message?.toLowerCase() || '';
  return message.includes('database') ||
         message.includes('network') ||
         message.includes('timeout') ||
         message.includes('connection') ||
         message.includes('temporary');
}

// Utility sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Attempt to login with error handling
try {
  await client.login(env.DISCORD_TOKEN);
  logger.info('Successfully logged in to Discord');
} catch (err) {
  logger.error({ err }, 'Failed to login to Discord - shutting down');
  process.exit(1);
}
