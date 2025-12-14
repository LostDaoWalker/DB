import { logger } from '../logger.js';

let client;
let logChannelId = '1449629563192610940';

export async function testChannelAccess(discordClient) {
  client = discordClient;

  if (!client?.isReady()) {
    logger.warn('Client not ready for channel test');
    return;
  }

  let botAccess = false;
  let webhookAvailable = !!process.env.DISCORD_WEBHOOK_URL;

  try {
    logger.info({ channelId: logChannelId }, 'Testing bot channel access...');

    const channel = await client.channels.fetch(logChannelId);

    if (!channel) {
      logger.warn({ channelId: logChannelId }, 'Bot cannot access channel');
    } else if (!channel.isTextBased()) {
      logger.warn({ channelId: logChannelId, channelType: channel.type }, 'Channel not text-based');
    } else {
      // Check permissions
      const permissions = channel.permissionsFor(client.user);
      if (!permissions?.has('SendMessages')) {
        logger.warn({ channelId: logChannelId }, 'Bot lacks SendMessages permission');
      } else if (!permissions?.has('EmbedLinks')) {
        logger.warn({ channelId: logChannelId }, 'Bot lacks EmbedLinks permission');
      } else {
        botAccess = true;
        logger.info({ channelId: logChannelId, channelName: channel.name }, 'Bot channel access confirmed');
      }
    }

  } catch (err) {
    logger.warn({ err: err.message, channelId: logChannelId }, 'Bot channel access failed');
  }

  // Check webhook availability
  if (webhookAvailable) {
    logger.info('Webhook available as fallback logging method');
  } else {
    logger.info('No webhook configured - only bot permissions will work');
  }

  const loggingEnabled = botAccess || webhookAvailable;
  if (loggingEnabled) {
    const methods = [];
    if (botAccess) methods.push('bot permissions');
    if (webhookAvailable) methods.push('webhook');
    logger.info({ methods: methods.join(' + ') }, 'Activity logging system active');
  } else {
    logger.warn('No logging methods available - activity logging disabled');
  }

  return loggingEnabled;
}
