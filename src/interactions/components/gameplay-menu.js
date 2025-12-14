import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { THEME } from '../../constants/theme.js';
import { getPlayer } from '../../../db/index.js';
import { listAnimals } from '../../../game/species/index.js';

export const gameplayMenuHandler = {
  name: 'gameplay_menu',

  async execute(interaction) {
    const choice = interaction.values[0];

    switch (choice) {
      case 'profile':
        // Trigger profile command
        const profileCommand = (await import('../../../interactions/commands/profile.js')).profileCommand;
        await profileCommand.execute(interaction);
        break;

      case 'battle':
        // Trigger battle command
        const battleCommand = (await import('../../../interactions/commands/battle.js')).battleCommand;
        await battleCommand.execute(interaction);
        break;

      case 'change_animal':
        await handleAnimalChange(interaction);
        break;

      case 'evolution':
        // Trigger evolution command
        const evolutionCommand = (await import('../../../interactions/commands/evolution.js')).evolutionCommand;
        await evolutionCommand.execute(interaction);
        break;
    }
  },
};

async function handleAnimalChange(interaction) {
  const animals = listAnimals();
  if (!animals || animals.length === 0) {
    await interaction.update({
      embeds: [new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Error')
        .setDescription('Animal selection system is currently unavailable.')
      ],
      components: []
    });
    return;
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId('change_animal:v1')
    .setPlaceholder('Choose your new animal')
    .addOptions(
      animals.map((a) => ({
        label: `${a.name} • ${a.pros}`,
        value: a.key,
        description: `${a.cons} • ${a.passive}`.slice(0, 100),
        emoji: getAnimalEmoji(a.key),
      }))
    );

  await interaction.update({
    embeds: [new EmbedBuilder()
      .setColor(THEME.color)
      .setTitle('🔄 Change Your Animal')
      .setDescription('Choose a new animal. **Your XP and battle stats will be preserved!**\n\n*Note: You can only change animals once per day to prevent abuse.*')
    ],
    components: [new ActionRowBuilder().addComponents(menu)]
  });
}

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
