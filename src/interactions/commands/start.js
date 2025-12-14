import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { THEME, primalLine } from '../../../constants/theme.js';
import { getPlayer } from '../../../db/index.js';
import { listAnimals } from '../../game/species/index.js';

export const startCommand = {
  data: new SlashCommandBuilder().setName('start').setDescription('Choose your animal.'),

  async execute(interaction) {
    try {
      const existing = getPlayer(interaction.user.id);

      // If player is fully set up, direct them to gameplay
      if (existing && existing.animal_key) {
        await interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor(THEME.color)
            .setTitle('🐾 Welcome Back!')
            .setDescription('You\'re already playing! Choose what you\'d like to do:')
          ],
          components: [new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('gameplay_menu')
              .setPlaceholder('What would you like to do?')
              .addOptions([
                {
                  label: 'View Profile',
                  value: 'profile',
                  description: 'Check your stats and progress',
                  emoji: '📊'
                },
                {
                  label: 'Battle',
                  value: 'battle',
                  description: 'Fight other players',
                  emoji: '⚔️'
                },
                {
                  label: 'Change Animal',
                  value: 'change_animal',
                  description: 'Switch to a different animal (keeps progress)',
                  emoji: '🔄'
                },
                {
                  label: 'Evolution',
                  value: 'evolution',
                  description: 'Evolve your animal using Evolution Points',
                  emoji: '✨'
                }
              ])
          )]
        });
        return;
      }

      // If player exists but has incomplete setup, allow them to complete it
      if (existing && !existing.animal_key) {
        await interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor(THEME.color)
            .setTitle('🐾 Complete Your Setup')
            .setDescription('It looks like you started setting up but didn\'t finish choosing an animal. Let\'s complete that now!')
          ]
        });

        // Continue with animal selection below
      }

      // Fresh start or completing incomplete setup
      const animals = listAnimals();
      if (!animals || animals.length === 0) {
        throw new Error('No animals available for selection');
      }

      const menu = new StringSelectMenuBuilder()
        .setCustomId('choose_animal:v1')
        .setPlaceholder('Choose your animal')
        .addOptions(
          animals.map((a) => ({
            label: `${a.name} • ${a.pros}`,
            value: a.key,
            description: `${a.cons} • ${a.passive}`.slice(0, 100),
            emoji: getAnimalEmoji(a.key),
          }))
        );

      await interaction.followUp({
        embeds: [new EmbedBuilder()
          .setColor(THEME.color)
          .setTitle(existing ? 'Choose Your Animal' : 'Welcome to Animal RPG! 🐾')
          .setDescription(existing ?
            'Complete your setup by choosing an animal:' :
            'Choose your starting animal to begin your adventure:')
        ],
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
