import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { THEME, primalLine } from '../../constants/theme.js';
import { getPlayer } from '../../db/index.js';
import { getAnimal, getStats } from '../../game/species/index.js';
import { levelFromXp, xpForNext } from '../../game/leveling.js';

export const profileCommand = {
  data: new SlashCommandBuilder().setName('profile').setDescription('View animal stats.'),

  async execute(interaction) {
    const p = getPlayer(interaction.user.id);
    if (!p) {
      await interaction.reply('No animal chosen. Use `/start`.');
      return;
    }

    // Validate animal key exists and is valid
    if (!p.animal_key) {
      await interaction.reply('No animal chosen. Use `/start` to select your animal first.');
      return;
    }

    let animal, stats;
    try {
      const { level, xpIntoLevel } = levelFromXp(p.xp);
      const next = xpForNext(level);
      animal = getAnimal(p.animal_key);
      stats = getStats(p.animal_key, level);

      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(THEME.color)
          .setTitle(`${getAnimalEmoji(p.animal_key)} ${animal.name}`)
          .setDescription(`Level ${level}\n${xpIntoLevel}/${next} XP\n\n${animal.passive}`)
          .addFields({
            name: 'Stats',
            value: `${stats.hp} HP • ${stats.atk} ATK • ${stats.def} DEF • ${stats.spd} SPD`
          })
        ]
      });
    } catch (err) {
      if (err.message.includes('Unknown animal key')) {
        throw new Error(`Invalid animal data for player - animal key "${p.animal_key}" not found. Please contact support.`);
      }
      throw err;
    }
  },
};

// Helper function to get animal emoji
function getAnimalEmoji(animalKey) {
  const emojis = { fox: '🦊', bear: '🐻', rabbit: '🐰', owl: '🦉' };
  return emojis[animalKey] || '🐾';
}
