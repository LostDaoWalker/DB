import process from 'node:process';
import { Client, GatewayIntentBits, Partials, Options } from 'discord.js';
import { getEnv } from './config/env.js';
import { logger } from './logger.js';
import { initDb } from './db/index.js';
import { registry } from './interactions/registry.js';

const env = getEnv();

process.on('unhandledRejection', (err) => logger.error({ err }, 'unhandledRejection'));
process.on('uncaughtException', (err) => logger.error({ err }, 'uncaughtException'));

initDb();

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

client.once('ready', () => {
  logger.info({ user: client.user?.tag }, 'Bot is ready');
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
      if (!cmd) return;
      await cmd.execute(interaction);
      return;
    }

    if (interaction.isStringSelectMenu() || interaction.isButton()) {
      const handler = registry.components.get(interaction.customId);
      if (!handler) return;
      await handler.execute(interaction);
    }
  } catch (err) {
    logger.error({ err, type: interaction.type }, 'Interaction error');

    const content = 'Something went wrong in the woods. Try again in a moment.';
    if (interaction.isRepliable()) {
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content, ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content, ephemeral: true }).catch(() => {});
      }
    }
  }
});

await client.login(env.DISCORD_TOKEN);
