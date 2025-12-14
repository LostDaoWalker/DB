import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { THEME, cozyLine } from '../../constants/theme.js';
import { getPlayer } from '../../db/index.js';
import { getAnimal, getStats } from '../../game/animals.js';
import { levelFromXp, xpForNext } from '../../game/leveling.js';

export const profileCommand = {
  data: new SlashCommandBuilder().setName('profile').setDescription('View your critter profile.'),

  async execute(interaction) {
    const p = getPlayer(interaction.user.id);
    if (!p) {
      await interaction.reply({ content: 'You have no critter yet. Use `/start` first.', ephemeral: true });
      return;
    }

    const { level, xpIntoLevel } = levelFromXp(p.xp);
    const next = xpForNext(level);
    const animal = getAnimal(p.animal_key);
    const stats = getStats(p.animal_key, level);

    const embed = new EmbedBuilder()
      .setColor(THEME.color)
      .setTitle(`${interaction.user.username} — ${animal.name}`)
      .setDescription(`Level **${level}** • XP **${xpIntoLevel}/${next}**\nPassive: **${animal.passive}**`)
      .addFields(
        { name: 'Stats', value: `HP **${stats.hp}**\nATK **${stats.atk}**\nDEF **${stats.def}**\nSPD **${stats.spd}**`, inline: true },
        { name: 'Vibe', value: animal.vibe, inline: true }
      )
      .setFooter({ text: cozyLine() });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
