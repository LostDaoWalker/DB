import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { THEME, cozyLine } from '../../constants/theme.js';
import { getPlayer } from '../../db/index.js';
import { listAnimals } from '../../game/animals.js';

export const startCommand = {
  data: new SlashCommandBuilder().setName('start').setDescription('Begin your cozy critter adventure.'),

  async execute(interaction) {
    const existing = getPlayer(interaction.user.id);
    if (existing) {
      const embed = new EmbedBuilder()
        .setColor(THEME.color)
        .setTitle('You’re already on the path')
        .setDescription('Your critter journal is open. Use `/profile` to peek in, or `/battle` to roam.')
        .setFooter({ text: cozyLine() });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const animals = listAnimals();
    const menu = new StringSelectMenuBuilder()
      .setCustomId('choose_animal:v1')
      .setPlaceholder('Choose your animal (your class)')
      .addOptions(
        animals.map((a) => ({
          label: a.name,
          value: a.key,
          description: `${a.vibe} • passive: ${a.passive}`.slice(0, 100),
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
      .setColor(THEME.color)
      .setTitle('Welcome to Cozy Critters')
      .setDescription('Pick an animal to begin. Your animal is your class — it shapes your stats and passive.')
      .addFields({ name: 'Tip', value: 'Battles are quick autobattles. You’ll level up as you explore.' })
      .setFooter({ text: cozyLine() });

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
