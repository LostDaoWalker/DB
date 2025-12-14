import { EmbedBuilder } from 'discord.js';
import { THEME, cozyLine } from '../../constants/theme.js';
import { createPlayer, getPlayer } from '../../db/index.js';
import { getAnimal } from '../../game/animals.js';

export const chooseAnimalComponent = {
  customId: 'choose_animal:v1',

  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const existing = getPlayer(interaction.user.id);
    if (existing) {
      await interaction.update({ content: 'You already chose your animal. Use `/profile`.', components: [], embeds: [] });
      return;
    }

    const animalKey = interaction.values[0];
    const animal = getAnimal(animalKey);

    const now = Date.now();
    createPlayer({ userId: interaction.user.id, animalKey, now });

    const embed = new EmbedBuilder()
      .setColor(THEME.ok)
      .setTitle(`A new journey begins: ${animal.name}`)
      .setDescription(
        `You feel **${animal.vibe}**.\n` +
          `Passive: **${animal.passive}**\n\n` +
          'Next: try `/battle` or peek at `/profile`.'
      )
      .setFooter({ text: cozyLine() });

    await interaction.update({ embeds: [embed], components: [] });
  },
};
