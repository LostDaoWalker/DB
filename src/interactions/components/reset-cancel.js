import { EmbedBuilder } from 'discord.js';
import { THEME } from '../../../constants/theme.js';

export const resetCancelHandler = {
  name: 'reset_cancel',

  async execute(interaction) {
    await interaction.update({
      embeds: [new EmbedBuilder()
        .setColor(THEME.color)
        .setTitle('Reset Cancelled')
        .setDescription('Your game data is safe. No changes were made.')
      ],
      components: [] // Remove buttons
    });
  },
};
