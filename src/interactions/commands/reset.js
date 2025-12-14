import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { THEME } from '../../constants/theme.js';
import { getPlayer } from '../../db/index.js';

export const resetCommand = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset your game progress and start over.'),

  async execute(interaction) {
    try {
      const existing = getPlayer(interaction.user.id);
      if (!existing) {
        await interaction.reply('No game data found to reset. Use `/start` to begin playing.');
        return;
      }

      // Create confirmation buttons
      const confirmButton = new ButtonBuilder()
        .setCustomId('reset_confirm')
        .setLabel('Yes, Reset Everything')
        .setStyle(ButtonStyle.Danger);

      const cancelButton = new ButtonBuilder()
        .setCustomId('reset_cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder()
        .addComponents(confirmButton, cancelButton);

      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(THEME.color)
          .setTitle('⚠️ Reset Game Progress')
          .setDescription('This will permanently delete all your game data including:\n\n• XP and level\n• Battle statistics\n• Animal selection\n• Win/loss records\n\n**This cannot be undone!**\n\nAre you sure you want to reset?')
        ],
        components: [row]
      });
    } catch (err) {
      throw new Error('Failed to prepare reset confirmation');
    }
  },
};
