import fs from 'node:fs';
import path from 'node:path';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { logger } from '../logger.js';

let client;
let webhookClient;
let logChannelId = '1449629563192610940';
let webhookUrl = process.env.DISCORD_WEBHOOK_URL;
let lastSize = 0;
let lastHash = '';
let lastLineCount = 0;

export function setupCodebaseMonitor(discordClient) {
  client = discordClient;

  // Initialize webhook if URL is provided
  if (webhookUrl) {
    try {
      webhookClient = new WebhookClient({ url: webhookUrl });
      logger.info('Codebase monitor webhook initialized');
    } catch (err) {
      logger.warn({ err }, 'Failed to initialize codebase monitor webhook');
    }
  }

  // Initial scan
  updateCodebaseStats();

  // Watch for changes
  const srcDir = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcDir)) {
    watchDirectory(srcDir);
  }

  // Watch package.json for dependency changes
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    fs.watchFile(packagePath, { interval: 1000 }, () => {
      setTimeout(() => logCodebaseUpdate('package.json modified'), 500);
    });
  }
}

async function watchDirectory(dirPath) {
  fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
    if (!filename || filename.startsWith('.') || filename.includes('node_modules')) return;

    // Debounce updates
    setTimeout(async () => {
      if (await hasCodebaseChanged()) {
        logCodebaseUpdate(`${filename} ${eventType === 'rename' ? 'renamed' : 'modified'}`);
      }
    }, 1000);
  });
}

async function hasCodebaseChanged() {
  const currentSize = getCodebaseSize();
  const currentHash = await getCodebaseHash();
  const currentLineCount = getLineCount();

  const changed = currentSize !== lastSize || currentHash !== lastHash;
  if (changed) {
    lastSize = currentSize;
    lastHash = currentHash;
    lastLineCount = currentLineCount;
  }

  return changed;
}

function getCodebaseSize() {
  const srcDir = path.join(process.cwd(), 'src');
  let totalSize = 0;

  function calculateSize(dirPath) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory() && shouldIncludeDirectory(item)) {
        calculateSize(itemPath);
      } else if (stats.isFile() && shouldIncludeFile(item)) {
        totalSize += stats.size;
      }
    }
  }

  if (fs.existsSync(srcDir)) {
    calculateSize(srcDir);
  }

  return totalSize;
}

function getLineCount() {
  const srcDir = path.join(process.cwd(), 'src');
  let totalLines = 0;

  function countLines(dirPath) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory() && shouldIncludeDirectory(item)) {
        countLines(itemPath);
      } else if (stats.isFile() && shouldIncludeFile(item)) {
        const content = fs.readFileSync(itemPath, 'utf8');
        const lines = content.split('\n').length;
        totalLines += lines;
      }
    }
  }

  if (fs.existsSync(srcDir)) {
    countLines(srcDir);
  }

  return totalLines;
}

function shouldIncludeDirectory(dirName) {
  const excludeDirs = ['node_modules', '.git', 'data'];
  return !dirName.startsWith('.') && !excludeDirs.includes(dirName);
}

function shouldIncludeFile(fileName) {
  const includeExtensions = ['.js', '.json'];
  return includeExtensions.some(ext => fileName.endsWith(ext));
}

async function getCodebaseHash() {
  const crypto = await import('node:crypto');
  const srcDir = path.join(process.cwd(), 'src');
  let content = '';

  function collectContent(dirPath) {
    const items = fs.readdirSync(dirPath).sort();
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        collectContent(itemPath);
      } else if (stats.isFile() && (item.endsWith('.js') || item.endsWith('.json'))) {
        content += fs.readFileSync(itemPath, 'utf8');
      }
    }
  }

  if (fs.existsSync(srcDir)) {
    collectContent(srcDir);
  }

  return crypto.default.createHash('md5').update(content).digest('hex').slice(0, 8);
}

async function logCodebaseUpdate(reason) {
  if (!client?.isReady()) {
    logger.debug('Client not ready, skipping codebase log');
    return;
  }

  const sizeKB = (lastSize / 1024).toFixed(1);
  const embed = new EmbedBuilder()
    .setColor(0x8b5a2b)
    .setTitle('Codebase Modified')
    .setDescription(`\`${reason}\`\n\n**Size:** ${sizeKB} KB\n**Lines:** ${lastLineCount}\n**Hash:** \`${lastHash}\`\n\n🔄 *Bot restarting...*`)
    .setTimestamp();

  // Try bot permissions first, fallback to webhook
  try {
    logger.debug({ channelId: logChannelId }, 'Attempting bot-based codebase logging');

    const channel = await client.channels.fetch(logChannelId);
    if (!channel) {
      throw new Error('Channel not found');
    }

    if (!channel.isTextBased()) {
      throw new Error('Channel not text-based');
    }

    // Check permissions
    const permissions = channel.permissionsFor(client.user);
    if (!permissions?.has('SendMessages') || !permissions?.has('EmbedLinks')) {
      throw new Error('Insufficient permissions');
    }

    const message = await channel.send({ embeds: [embed] });
    logger.info({ reason, size: sizeKB, lines: lastLineCount, hash: lastHash, messageId: message.id }, 'Codebase update logged via bot');

  } catch (err) {
    logger.debug({ err: err.message }, 'Bot logging failed, trying webhook fallback');

    // Fallback to webhook if available
    if (webhookClient) {
      try {
        await webhookClient.send({ embeds: [embed] });
        logger.info({ reason, size: sizeKB, lines: lastLineCount, hash: lastHash }, 'Codebase update logged via webhook');
      } catch (webhookErr) {
        logger.warn({ err: webhookErr }, 'Webhook logging also failed');
        return;
      }
    } else {
      logger.warn({ reason }, 'No logging methods available for codebase update');
      return;
    }
  }

  // Auto-restart bot after logging (only if logging succeeded)
  setTimeout(() => {
    logger.info('Auto-restarting bot due to code changes...');
    process.exit(0); // PM2 or similar will restart the process
  }, 2000);
}

function updateCodebaseStats() {
  lastSize = getCodebaseSize();
  lastLineCount = getLineCount();
  getCodebaseHash().then(hash => {
    lastHash = hash;
    logger.info({ size: (lastSize / 1024).toFixed(1), lines: lastLineCount, hash }, 'Initial codebase stats recorded');
  });
}
