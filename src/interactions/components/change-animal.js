import { EmbedBuilder } from 'discord.js';
import { THEME } from '../../../constants/theme.js';
import { getPlayer } from '../../../db/index.js';
import { getAnimal } from '../../../game/species/index.js';

export const changeAnimalHandler = {
  name: 'change_animal',

  async execute(interaction) {
    try {
      const newAnimalKey = interaction.values[0];
      const userId = interaction.user.id;

      const player = getPlayer(userId);
      if (!player) {
        await interaction.update({
          embeds: [new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Error')
            .setDescription('Player data not found. Please use `/start` first.')
          ],
          components: []
        });
        return;
      }

      // Check if they changed animals recently (once per day limit)
      const now = Date.now();
      const lastChanged = player.last_animal_change || 0;
      const timeSinceLastChange = now - lastChanged;
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (timeSinceLastChange < oneDayMs) {
        const hoursLeft = Math.ceil((oneDayMs - timeSinceLastChange) / (60 * 60 * 1000));
        await interaction.update({
          embeds: [new EmbedBuilder()
            .setColor('Orange')
            .setTitle('⏰ Animal Change Cooldown')
            .setDescription(`You can change animals once per day. **${hoursLeft} hours** remaining.\n\nYour current animal: **${getAnimal(player.animal_key)?.name || 'Unknown'}**`)
          ],
          components: []
        });
        return;
      }

      // Validate the new animal exists
      const newAnimal = getAnimal(newAnimalKey);
      if (!newAnimal) {
        await interaction.update({
          embeds: [new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Invalid Animal')
            .setDescription('The selected animal is not available.')
          ],
          components: []
        });
        return;
      }

      // Update the player's animal
      const { updatePlayerAnimal } = await import('../../../db/index.js');
      await updatePlayerAnimal(userId, newAnimalKey, now);

      await interaction.update({
        embeds: [new EmbedBuilder()
          .setColor(THEME.color)
          .setTitle('✅ Animal Changed Successfully!')
          .setDescription(`You have changed to: **${newAnimal.name}** ${getAnimalEmoji(newAnimalKey)}\n\n*Your XP, level, and battle statistics have been preserved.*`)
          .addFields({
            name: 'New Animal Stats',
            value: `${newAnimal.passive}\n\nUse \`/profile\` to see your updated stats!`
          })
        ],
        components: []
      });

    } catch (err) {
      await interaction.update({
        embeds: [new EmbedBuilder()
          .setColor('Red')
          .setTitle('❌ Error Changing Animal')
          .setDescription('Failed to change your animal. Please try again.')
        ],
        components: []
      });
      throw err;
    }
  },
};

// Helper function to get animal emoji
function getAnimalEmoji(animalKey) {
  const emojis = {
    fox: '🦊',
    bear: '🐻',
    rabbit: '🐰',
    owl: '🦉',
    wolf: '🐺',
    beetle: '🐞',
    snake: '🐍'
  };
  return emojis[animalKey] || '🐾';
}
