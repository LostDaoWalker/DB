import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { THEME, primalLine } from '../constants/theme.js';
import { getLeaderboard } from '../../db/index.js';
import os from 'node:os';

export const statsCommand = {
  data: new SlashCommandBuilder().setName('stats').setDescription('View bot statistics and system info.'),

  async execute(interaction) {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();

    // Get system info
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercent = Math.round((usedMem / totalMem) * 100);

    // Get player stats
    const leaderboard = await getLeaderboard(1);
    const totalPlayers = leaderboard.length > 0 ? '10+' : '0'; // Rough estimate

    const embed = new EmbedBuilder()
      .setColor(THEME.color)
      .setTitle('🤖 Bot Statistics')
      .addFields(
        {
          name: '💾 Memory Usage',
          value: `**RSS:** ${Math.round(memUsage.rss / 1024 / 1024)} MB\n` +
                 `**Heap Used:** ${Math.round(memUsage.heapUsed / 1024 / 1024)} MB\n` +
                 `**Heap Total:** ${Math.round(memUsage.heapTotal / 1024 / 1024)} MB\n` +
                 `**External:** ${Math.round(memUsage.external / 1024 / 1024)} MB`,
          inline: true
        },
        {
          name: '🖥️ System Memory',
          value: `**Used:** ${Math.round(usedMem / 1024 / 1024 / 1024)} GB\n` +
                 `**Total:** ${Math.round(totalMem / 1024 / 1024 / 1024)} GB\n` +
                 `**Usage:** ${memPercent}%`,
          inline: true
        },
        {
          name: '⚙️ Bot Info',
          value: `**Uptime:** ${formatUptime(uptime)}\n` +
                 `**Players:** ${totalPlayers}\n` +
                 `**Node:** ${process.version}\n` +
                 `**Platform:** ${os.platform()}`,
          inline: true
        }
      )
      .setFooter({ text: primalLine() });

    await interaction.reply({ embeds: [embed] });
  },
};

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
