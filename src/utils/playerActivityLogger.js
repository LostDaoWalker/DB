import { EmbedBuilder, WebhookClient } from 'discord.js';
import { logger } from '../logger.js';

let client;
let webhookClient;
let logChannelId = '1449629563192610940';
let webhookUrl = process.env.DISCORD_WEBHOOK_URL;

export function setupPlayerActivityLogger(discordClient) {
  client = discordClient;

  // Initialize webhook if URL is provided
  if (webhookUrl) {
    try {
      webhookClient = new WebhookClient({ url: webhookUrl });
      logger.info('Discord webhook initialized for activity logging');
    } catch (err) {
      logger.warn({ err }, 'Failed to initialize Discord webhook');
    }
  }
}

export async function logPlayerRegistration(userId, username, animalKey) {
  await logActivity({
    title: 'Player Joined',
    description: `<@${userId}> chose ${animalKey}`,
    color: 0x228b22,
    fields: [
      { name: 'Player', value: username, inline: true },
      { name: 'Animal', value: animalKey, inline: true }
    ]
  });
}

export async function logBattleResult(playerUserId, playerUsername, playerAnimal, enemyAnimal, result, xpGained, levelUp) {
  const win = result === 'player';
  const title = win ? 'Victory' : 'Defeated';
  const color = win ? 0x228b22 : 0xdc143c;

  await logActivity({
    title,
    description: `<@${playerUserId}> ${win ? 'beat' : 'lost to'} ${enemyAnimal}`,
    color,
    fields: [
      { name: 'Player', value: `${playerAnimal} (${playerUsername})`, inline: true },
      { name: 'Opponent', value: enemyAnimal, inline: true },
      { name: 'Result', value: `+${xpGained} XP${levelUp ? ' (LEVEL UP!)' : ''}`, inline: true }
    ]
  });
}

export async function logLevelUp(userId, username, animalKey, newLevel) {
  await logActivity({
    title: 'Level Up',
    description: `<@${userId}>'s ${animalKey} reached level ${newLevel}`,
    color: 0xffd700,
    fields: [
      { name: 'Player', value: username, inline: true },
      { name: 'Animal', value: animalKey, inline: true },
      { name: 'New Level', value: newLevel.toString(), inline: true }
    ]
  });
}

async function logActivity({ title, description, color, fields = [] }) {
  if (!client?.isReady()) {
    logger.debug('Client not ready, skipping activity log');
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  // Try webhook logging (permissions not required)
  if (webhookClient) {
    try {
      await webhookClient.send({ embeds: [embed] });
      logger.info({ title, description }, 'Player activity logged via webhook');
      return;
    } catch (webhookErr) {
      logger.warn({ err: webhookErr }, 'Webhook logging failed');
    }
  }

  logger.warn({ title }, 'No webhook available - activity not logged');
}
