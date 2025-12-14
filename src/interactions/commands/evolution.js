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
          .setDescription('No evolutions available yet!\n\n**Evolution Structure:**\n• Each stage has **5 growth phases** to master\n• **Branching choices** at key stages\n• **Species-specific abilities** and bonuses\n\n**Evolution Tiers:**\n🐺 **Legendary** (200-320 EP) - Enhanced real animals\n🦕 **Ancient** (380-600 EP) - Prehistoric creatures\n🐉 **Mythical** (6000-10000 EP) - Legendary supernatural beings\n\nEvolution Points (EP) are earned by leveling up through battles.')
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
  const evolutions = [];

  // Get all species and their evolutions dynamically
  const allSpecies = getAllSpeciesModules();

  for (const [speciesKey, speciesData] of Object.entries(allSpecies)) {
    // Skip the current player's species to avoid self-evolution
    if (speciesKey === player.animal_key) continue;

    // Add legendary evolutions (enhanced versions of other animals)
    if (speciesData.legendaryForm) {
      const legendaryForm = speciesData.legendaryForm;
      if (player.evolution_points >= legendaryForm.epCost) {
        evolutions.push({
          key: speciesKey,
          name: legendaryForm.name,
          epCost: legendaryForm.epCost,
          description: legendaryForm.description,
          bonus: formatBonusString(legendaryForm.bonuses),
          tier: 'legendary'
        });
      }
    }

    // Add ancient evolutions (prehistoric versions)
    if (speciesData.ancientForm && player.xp >= 5000) {
      const ancientForm = speciesData.ancientForm;
      if (player.evolution_points >= ancientForm.epCost) {
        evolutions.push({
          key: speciesKey,
          name: ancientForm.name,
          epCost: ancientForm.epCost,
          description: ancientForm.description,
          bonus: formatBonusString(ancientForm.bonuses),
          tier: 'ancient'
        });
      }
    }

    // Add mythical evolutions (supernatural versions)
    if (speciesData.mythicalForm && player.xp >= 15000) {
      const mythicalForm = speciesData.mythicalForm;
      if (player.evolution_points >= mythicalForm.epCost) {
        evolutions.push({
          key: speciesKey,
          name: mythicalForm.name,
          epCost: mythicalForm.epCost,
          description: mythicalForm.description,
          bonus: formatBonusString(mythicalForm.bonuses),
          tier: 'mythical'
        });
      }
    }
  }

  // Sort by tier (legendary first, then ancient, then mythical) and then by EP cost
  const tierOrder = { legendary: 1, ancient: 2, mythical: 3 };
  evolutions.sort((a, b) => {
    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
      return tierOrder[a.tier] - tierOrder[b.tier];
    }
    return a.epCost - b.epCost;
  });

  return evolutions;
}

function formatBonusString(bonuses) {
  if (!bonuses) return '';

  const parts = [];
  if (bonuses.hp) parts.push(`+${Math.round(bonuses.hp * 100)}% HP`);
  if (bonuses.atk) parts.push(`+${Math.round(bonuses.atk * 100)}% ATK`);
  if (bonuses.def) parts.push(`+${Math.round(bonuses.def * 100)}% DEF`);
  if (bonuses.spd) parts.push(`+${Math.round(bonuses.spd * 100)}% SPD`);
  if (bonuses.critChance) parts.push(`+${Math.round(bonuses.critChance * 100)}% Crit`);
  if (bonuses.multiStrike) parts.push(`Multi-strike`);
  if (bonuses.fateWeaver) parts.push(`Fate Weaver`);
  if (bonuses.creationForce) parts.push(`Creation Force`);

  return parts.join(', ');
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
