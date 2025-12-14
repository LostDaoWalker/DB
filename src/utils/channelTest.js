import { logger } from '../logger.js';

let client;
let logChannelId = '1449629563192610940';

export async function testChannelAccess(discordClient) {
  client = discordClient;

  if (!client?.isReady()) {
    logger.warn('Client not ready for channel test');
    return;
  }

  let channelAccessible = false;
  let webhookAvailable = !!process.env.DISCORD_WEBHOOK_URL;

  try {
    logger.info({ channelId: logChannelId }, 'Testing bot channel access...');

    const channel = await client.channels.fetch(logChannelId);

    if (!channel) {
      logger.warn({ channelId: logChannelId }, 'Bot cannot access channel');
    } else if (!channel.isTextBased()) {
      logger.warn({ channelId: logChannelId, channelType: channel.type }, 'Channel not text-based');
    } else {
      // Channel exists and is accessible - permissions not required
      channelAccessible = true;
      logger.info({ channelId: logChannelId, channelName: channel.name }, 'Channel accessible - permissions not required');
    }

  } catch (err) {
    logger.warn({ err: err.message, channelId: logChannelId }, 'Bot channel access failed');
  }

  // Check webhook availability
  if (webhookAvailable) {
    logger.info('Webhook available as fallback logging method');
  } else {
    logger.info('No webhook configured - webhook fallback unavailable');
  }

  // Bot can function without permissions - logging works via webhook fallback
  const loggingEnabled = channelAccessible || webhookAvailable;
  if (loggingEnabled) {
    const methods = [];
    if (channelAccessible) methods.push('channel accessible');
    if (webhookAvailable) methods.push('webhook');
    logger.info({ methods: methods.join(' + ') }, 'Activity logging system active - permissions not required');
  } else {
    logger.warn('No logging methods available - activity logging disabled');
  }

  return loggingEnabled;
}
