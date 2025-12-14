import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { THEME, primalLine } from '../../constants/theme.js';
import { getLeaderboard } from '../../../db/index.js';
import { getAnimal } from '../../game/species/index.js';

export const foodchainCommand = {
  data: new SlashCommandBuilder()
    .setName('foodchain')
    .setDescription('View player leaderboard.')
    .addIntegerOption(option =>
      option.setName('page')
        .setDescription('Page number')
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction) {
    const page = interaction.options.getInteger('page') || 1;
    const perPage = 10;
    const offset = (page - 1) * perPage;

    const leaderboard = await getLeaderboard(perPage);

    if (leaderboard.length === 0) {
      await interaction.reply('No players yet.');
      return;
    }

    // Create leaderboard text
    const leaderboardText = leaderboard.slice(offset, offset + perPage).map((player, index) => {
      const rank = offset + index + 1;
      const animal = getAnimal(player.animal_key);
      const emoji = getAnimalEmoji(player.animal_key);
      const winRate = player.total_battles > 0 ?
        Math.round((player.total_wins / player.total_battles) * 100) : 0;

      return `${rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅'} **${rank}.** <@${player.user_id}>\n` +
             `${emoji} ${animal.name} • Level ${Math.floor(player.xp / 100) + 1}\n` +
             `XP: ${player.xp} • ${player.total_wins}W/${player.total_losses}L (${winRate}%)\n` +
             `Streak: ${player.current_streak} • Best: ${player.best_streak}`;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(THEME.color)
      .setTitle('🏆 Player Leaderboard')
      .setDescription(leaderboardText)
      .setFooter({ text: `Page ${page} • ${primalLine()}` });

    // Add navigation buttons if needed
    const components = [];
    if (page > 1 || leaderboard.length > perPage) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`leaderboard_prev_${page}`)
          .setLabel('Previous')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId(`leaderboard_next_${page}`)
          .setLabel('Next')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(leaderboard.length <= perPage)
      );
      components.push(row);
    }

    await interaction.reply({ embeds: [embed], components });
  },
};

// Helper function to get animal emoji
function getAnimalEmoji(animalKey) {
  const emojis = { fox: '🦊', bear: '🐻', rabbit: '🐰', owl: '🦉', wolf: '🐺', beetle: '🐞', snake: '🐍' };
  return emojis[animalKey] || '🐾';
}
