import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { THEME, primalLine } from '../constants/theme.js';
import { getPlayer } from '../../db/index.js';

export const cooldownCommand = {
  data: new SlashCommandBuilder().setName('cooldown').setDescription('Check your battle cooldown.'),

  async execute(interaction) {
    const p = await getPlayer(interaction.user.id);
    if (!p) {
      await interaction.reply('No animal. Use `/start`.');
      return;
    }

    const now = Date.now();
    const cooldownMs = 3000;
    const remainingMs = Math.max(0, cooldownMs - (now - p.last_battle_at));

    const embed = new EmbedBuilder()
      .setColor(remainingMs > 0 ? THEME.accent : THEME.ok)
      .setTitle('Battle Cooldown')
      .setDescription(remainingMs > 0
        ? `⏰ **${Math.ceil(remainingMs / 1000)}s** remaining`
        : '✅ Ready to battle!'
      )
      .addFields({
        name: 'Cooldown',
        value: `${cooldownMs / 1000} seconds between battles`,
        inline: true
      })
      .setFooter({ text: primalLine() });

    await interaction.reply({ embeds: [embed] });
  },
};
