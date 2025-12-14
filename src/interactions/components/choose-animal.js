import { EmbedBuilder } from 'discord.js';
import { THEME } from '../../../constants/theme.js';
import { createPlayer, getPlayer } from '../../../db/index.js';
import { getAnimal } from '../../game/species/index.js';
import { logPlayerRegistration } from '../../utils/playerActivityLogger.js';

export const chooseAnimalComponent = {
  customId: 'choose_animal:v1',

  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const existing = getPlayer(interaction.user.id);
    if (existing) {
      await interaction.update('Already hunting.');
      return;
    }

    const animalKey = interaction.values[0];
    const animal = getAnimal(animalKey);
    createPlayer({ userId: interaction.user.id, animalKey, now: Date.now() });

    // Log player registration
    await logPlayerRegistration(interaction.user.id, interaction.user.username, animal.name);

    await interaction.update({
      embeds: [new EmbedBuilder()
        .setColor(THEME.ok)
        .setTitle(`${getAnimalEmoji(animalKey)} ${animal.name}`)
        .setDescription(`${animal.passive}`)
      ],
      components: []
    });
  },
};

function getAnimalEmoji(animalKey) {
  return { fox: '🦊', bear: '🐻', rabbit: '🐰', owl: '🦉' }[animalKey] || '🐾';
}
