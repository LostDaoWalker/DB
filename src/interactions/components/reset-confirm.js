import { EmbedBuilder } from 'discord.js';
import { THEME } from '../../../constants/theme.js';

export const resetConfirmHandler = {
  name: 'reset_confirm',

  async execute(interaction) {
    try {
      // Import here to avoid circular dependencies
      const { deletePlayer } = await import('../../../db/index.js');

      // Delete the player's data
      await deletePlayer(interaction.user.id);

      await interaction.update({
        embeds: [new EmbedBuilder()
          .setColor(THEME.color)
          .setTitle('✅ Game Reset Complete')
          .setDescription('Your game progress has been completely reset.\n\nUse `/start` to choose a new animal and begin playing again!')
        ],
        components: [] // Remove buttons
      });
    } catch (err) {
      throw new Error('Failed to reset game data');
    }
  },
};
