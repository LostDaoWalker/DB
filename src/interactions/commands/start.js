import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { THEME, primalLine } from '../../constants/theme.js';
import { getPlayer } from '../../db/index.js';
import { listAnimals } from '../../game/species/index.js';

export const startCommand = {
  data: new SlashCommandBuilder().setName('start').setDescription('Choose your animal.'),

  async execute(interaction) {
    try {
      const existing = getPlayer(interaction.user.id);
      if (existing) {
        await interaction.reply('Already playing. Use `/battle` or `/profile`.');
        return;
      }

      const animals = listAnimals();
      if (!animals || animals.length === 0) {
        throw new Error('No animals available for selection');
      }

      const menu = new StringSelectMenuBuilder()
        .setCustomId('choose_animal:v1')
        .setPlaceholder('Choose animal')
        .addOptions(
          animals.map((a) => ({
            label: `${a.name} • ${a.pros}`,
            value: a.key,
            description: `${a.cons} • ${a.passive}`.slice(0, 100),
            emoji: getAnimalEmoji(a.key),
          }))
        );

      await interaction.reply({
        embeds: [new EmbedBuilder().setColor(THEME.color).setTitle('Choose animal')],
        components: [new ActionRowBuilder().addComponents(menu)]
      });
    } catch (err) {
      // Re-throw with more context for better error messages
      if (err.message.includes('animals')) {
        throw new Error('Animal selection system unavailable');
      }
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
    owl: '🦉'
  };
  return emojis[animalKey] || '🐾';
}
