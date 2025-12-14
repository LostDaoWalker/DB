import { EmbedBuilder } from 'discord.js';
import { THEME } from '../../../constants/theme.js';
import { getPlayer, evolvePlayerAnimal } from '../../../db/index.js';
import { epCostForEvolution } from '../../game/leveling.js';
import { getAnimal } from '../../game/species/index.js';

export const evolutionSelectHandler = {
  customId: 'evolution_select:v1',

  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const selectedEvolution = interaction.values[0];
    const userId = interaction.user.id;

    try {
      const player = await getPlayer(userId);
      if (!player) {
        await interaction.update({
          embeds: [new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Error')
            .setDescription('Player data not found.')
          ],
          components: []
        });
        return;
      }

      // Get evolution details
      const evolution = getEvolutionDetails(selectedEvolution);
      if (!evolution) {
        await interaction.update({
          embeds: [new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Invalid Evolution')
            .setDescription('The selected evolution is not available.')
          ],
          components: []
        });
        return;
      }

      // Check if player has enough EP
      if (player.evolution_points < evolution.epCost) {
        await interaction.update({
          embeds: [new EmbedBuilder()
            .setColor('Orange')
            .setTitle('❌ Insufficient Evolution Points')
            .setDescription(`You need ${evolution.epCost} EP to evolve into ${evolution.name}.\n\nYou currently have ${player.evolution_points} EP.`)
            .addFields({
              name: 'How to Get More EP',
              value: '• Battle other players to level up\n• Higher levels grant more EP\n• Keep playing to earn evolution points!'
            })
          ],
          components: []
        });
        return;
      }

      // Check level requirements for advanced evolutions
      if (evolution.minLevel && player.xp < evolution.minLevelXp) {
        await interaction.update({
          embeds: [new EmbedBuilder()
            .setColor('Orange')
            .setTitle('❌ Level Requirement Not Met')
            .setDescription(`${evolution.name} requires level ${evolution.minLevel}+.\n\nKeep battling to reach the required level!`)
          ],
          components: []
        });
        return;
      }

      // Perform the evolution
      const updatedPlayer = await evolvePlayerAnimal(userId, selectedEvolution, evolution.epCost);

      await interaction.update({
        embeds: [new EmbedBuilder()
          .setColor(THEME.color)
          .setTitle(`✨ Evolution Complete!`)
          .setDescription(`Your animal has evolved into **${evolution.name}**!`)
          .addFields(
            {
              name: 'Evolution Details',
              value: `${evolution.description}\n\n${evolution.bonus}`,
              inline: false
            },
            {
              name: 'EP Spent',
              value: `${evolution.epCost} EP`,
              inline: true
            },
            {
              name: 'Remaining EP',
              value: `${updatedPlayer.evolution_points} EP`,
              inline: true
            }
          )
          .setImage(getEvolutionImage(selectedEvolution))
        ],
        components: []
      });

    } catch (err) {
      await interaction.update({
        embeds: [new EmbedBuilder()
          .setColor('Red')
          .setTitle('❌ Evolution Failed')
          .setDescription('Failed to complete the evolution. Please try again.')
        ],
        components: []
      });
      throw err;
    }
  },
};

function getEvolutionDetails(evolutionKey) {
  const evolutions = {
    // Legendary
    wolf: { key: 'wolf', name: 'Dire Wolf', epCost: 50, description: 'Ferocious pack hunter', bonus: '+25% ATK, +10% SPD', minLevel: 1 },
    bear: { key: 'bear', name: 'Grizzly Bear', epCost: 80, description: 'Massive forest guardian', bonus: '+40% HP, +20% DEF', minLevel: 1 },
    eagle: { key: 'eagle', name: 'Golden Eagle', epCost: 70, description: 'Master of the skies', bonus: '+30% SPD, +15% ATK', minLevel: 1 },
    shark: { key: 'shark', name: 'Great White Shark', epCost: 60, description: 'Ocean predator', bonus: '+35% ATK, +10% DEF', minLevel: 1 },
    lion: { key: 'lion', name: 'Mountain Lion', epCost: 50, description: 'Stealthy ambush hunter', bonus: '+20% ATK, +25% SPD', minLevel: 1 },

    // Ancient
    t_rex: { key: 't_rex', name: 'Tyrannosaurus Rex', epCost: 250, description: 'King of the dinosaurs', bonus: '+80% ATK, +30% HP', minLevel: 15, minLevelXp: 5000 },
    mammoth: { key: 'mammoth', name: 'Woolly Mammoth', epCost: 200, description: 'Ice age behemoth', bonus: '+100% HP, +25% DEF', minLevel: 15, minLevelXp: 5000 },
    saber_tooth: { key: 'saber_tooth', name: 'Saber-Toothed Tiger', epCost: 180, description: 'Ancient feline predator', bonus: '+70% ATK, +20% SPD', minLevel: 15, minLevelXp: 5000 },
    triceratops: { key: 'triceratops', name: 'Triceratops', epCost: 160, description: 'Armored herbivore', bonus: '+60% DEF, +40% HP', minLevel: 15, minLevelXp: 5000 },
    stegosaurus: { key: 'stegosaurus', name: 'Stegosaurus', epCost: 150, description: 'Plated dinosaur', bonus: '+50% DEF, +30% HP', minLevel: 15, minLevelXp: 5000 },

    // Mythical
    dragon: { key: 'dragon', name: 'Ancient Dragon', epCost: 500, description: 'Mythical fire-breathing beast', bonus: '+150% ATK, +50% HP, +50% DEF', minLevel: 25, minLevelXp: 15000 },
    phoenix: { key: 'phoenix', name: 'Phoenix', epCost: 450, description: 'Immortal bird of flame', bonus: '+120% ATK, +80% SPD, +40% HP', minLevel: 25, minLevelXp: 15000 },
    unicorn: { key: 'unicorn', name: 'Crystal Unicorn', epCost: 400, description: 'Magical horned equine', bonus: '+100% SPD, +60% ATK, +30% DEF', minLevel: 25, minLevelXp: 15000 },
    griffin: { key: 'griffin', name: 'Griffin', epCost: 350, description: 'Lion-eagle hybrid', bonus: '+90% ATK, +70% SPD, +40% DEF', minLevel: 25, minLevelXp: 15000 },
    leviathan: { key: 'leviathan', name: 'Leviathan', epCost: 300, description: 'Sea monster of legend', bonus: '+110% HP, +60% ATK, +50% DEF', minLevel: 25, minLevelXp: 15000 },
  };

  return evolutions[evolutionKey];
}

function getEvolutionImage(evolutionKey) {
  // For now, return null - in a real implementation, you'd have evolution images
  return null;
}
