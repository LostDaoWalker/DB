import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { THEME } from '../../../constants/theme.js';
import { getPlayer, evolvePlayerAnimal } from '../../../db/index.js';
import { epCostForEvolution } from '../../game/leveling.js';
import { listAnimals, getAnimal } from '../../game/species/index.js';

export const evolutionCommand = {
  data: new SlashCommandBuilder()
    .setName('evolution')
    .setDescription('Evolve your animal using Evolution Points.'),

  async execute(interaction) {
    const player = await getPlayer(interaction.user.id);
    if (!player) {
      await interaction.reply('No animal chosen. Use `/start` first.');
      return;
    }

    if (!player.animal_key) {
      await interaction.reply('No animal chosen. Use `/start` to select your animal first.');
      return;
    }

    // Get available evolutions
    const availableEvolutions = getAvailableEvolutions(player);

    if (availableEvolutions.length === 0) {
      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(THEME.color)
          .setTitle('🐾 Evolution System')
          .setDescription('No evolutions available yet!\n\n**Evolution Tiers:**\n🐺 **Legendary** (200-320 EP) - Enhanced real animals\n🦕 **Ancient** (380-600 EP) - Prehistoric creatures\n🐉 **Mythical** (1100-1500 EP) - Supernatural beings\n\nEvolution Points (EP) are earned by leveling up through battles.')
          .addFields({
            name: 'Your EP',
            value: `${player.evolution_points} EP`,
            inline: true
          })
        ]
      });
      return;
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId('evolution_select:v1')
      .setPlaceholder('Choose an evolution')
      .addOptions(
        availableEvolutions.map(evo => ({
          label: `${evo.name} (${evo.epCost} EP)`,
          value: evo.key,
          description: `${evo.description} • ${evo.bonus}`,
          emoji: getAnimalEmoji(evo.key),
        }))
      );

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor(THEME.color)
        .setTitle('🐾 Evolution Chamber')
        .setDescription('Choose an evolution to transform your animal!\n\nEvolution Points are earned by leveling up through battles.')
        .addFields({
          name: 'Your EP',
          value: `${player.evolution_points} EP`,
          inline: true
        })
      ],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  },
};

function getAvailableEvolutions(player) {
  const currentAnimal = getAnimal(player.animal_key);
  const evolutions = [];

    // Define evolution tiers with PROPER HIERARCHY - Legendary → Mythical progression
  const evolutionTiers = {
    // Legendary evolutions (enhanced versions of real animals)
    legendary: [
      { key: 'wolf', name: 'Dire Wolf', epCost: 200, description: 'Ferocious pack hunter', bonus: '+25% ATK, +10% SPD' },
      { key: 'bear', name: 'Grizzly Bear', epCost: 320, description: 'Massive forest guardian', bonus: '+40% HP, +20% DEF' },
      { key: 'eagle', name: 'Golden Eagle', epCost: 280, description: 'Master of the skies', bonus: '+30% SPD, +15% ATK' },
      { key: 'shark', name: 'Great White Shark', epCost: 240, description: 'Ocean predator', bonus: '+35% ATK, +10% DEF' },
      { key: 'lion', name: 'Mountain Lion', epCost: 200, description: 'Stealthy ambush hunter', bonus: '+20% ATK, +25% SPD' },
    ],

    // Ancient evolutions (prehistoric animals - available after some legendary progress)
    ancient: [
      { key: 't_rex', name: 'Tyrannosaurus Rex', epCost: 600, description: 'King of the dinosaurs', bonus: '+80% ATK, +30% HP' },
      { key: 'mammoth', name: 'Woolly Mammoth', epCost: 500, description: 'Ice age behemoth', bonus: '+100% HP, +25% DEF' },
      { key: 'saber_tooth', name: 'Saber-Toothed Tiger', epCost: 450, description: 'Ancient feline predator', bonus: '+70% ATK, +20% SPD' },
      { key: 'triceratops', name: 'Triceratops', epCost: 400, description: 'Armored herbivore', bonus: '+60% DEF, +40% HP' },
      { key: 'stegosaurus', name: 'Stegosaurus', epCost: 380, description: 'Plated dinosaur', bonus: '+50% DEF, +30% HP' },
    ],

    // Mythical evolutions (supernatural creatures - only after legendary + ancient progress)
    mythical: [
      { key: 'dragon', name: 'Ancient Dragon', epCost: 1500, description: 'Mythical fire-breathing beast', bonus: '+150% ATK, +50% HP, +50% DEF' },
      { key: 'phoenix', name: 'Phoenix', epCost: 1400, description: 'Immortal bird of flame', bonus: '+120% ATK, +80% SPD, +40% HP' },
      { key: 'unicorn', name: 'Crystal Unicorn', epCost: 1300, description: 'Magical horned equine', bonus: '+100% SPD, +60% ATK, +30% DEF' },
      { key: 'griffin', name: 'Griffin', epCost: 1200, description: 'Lion-eagle hybrid', bonus: '+90% ATK, +70% SPD, +40% DEF' },
      { key: 'leviathan', name: 'Leviathan', epCost: 1100, description: 'Sea monster of legend', bonus: '+110% HP, +60% ATK, +50% DEF' },
    ],
  };

  // Add legendary evolutions (always available if player has enough EP)
  evolutionTiers.legendary.forEach(evo => {
    if (player.evolution_points >= evo.epCost) {
      evolutions.push(evo);
    }
  });

  // Add ancient evolutions (require higher level)
  if (player.xp >= 5000) { // Require level ~15+
    evolutionTiers.ancient.forEach(evo => {
      if (player.evolution_points >= evo.epCost) {
        evolutions.push(evo);
      }
    });
  }

  // Add mythical evolutions (require very high level and lots of EP)
  if (player.xp >= 15000) { // Require level ~25+
    evolutionTiers.mythical.forEach(evo => {
      if (player.evolution_points >= evo.epCost) {
        evolutions.push(evo);
      }
    });
  }

  return evolutions;
}

// Helper function to get animal emoji
function getAnimalEmoji(animalKey) {
  const emojis = {
    // Base animals
    fox: '🦊', bear: '🐻', rabbit: '🐰', owl: '🦉',
    // Legendary
    wolf: '🐺', eagle: '🦅', shark: '🦈', lion: '🦁',
    // Ancient
    t_rex: '🦖', mammoth: '🐘', saber_tooth: '🐅', triceratops: '🦕', stegosaurus: '🦕',
    // Mythical
    dragon: '🐉', phoenix: '🔥', unicorn: '🦄', griffin: '🦅', leviathan: '🐋'
  };
  return emojis[animalKey] || '🐾';
}
