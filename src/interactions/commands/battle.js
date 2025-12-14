import { randomInt } from 'node:crypto';
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { THEME, cozyLine } from '../../constants/theme.js';
import { getPlayer, updatePlayerXpAndBattleTime } from '../../db/index.js';
import { levelFromXp, applyXp, xpForNext } from '../../game/leveling.js';
import { listAnimals } from '../../game/animals.js';
import { simulateBattle } from '../../game/battle/engine.js';
import { renderBattleCard } from '../../ui/renderBattleCard.js';

function pickEnemyAnimal(playerAnimalKey) {
  const animals = listAnimals().filter((a) => a.key !== playerAnimalKey);
  return animals[randomInt(0, animals.length)].key;
}

function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
}

export const battleCommand = {
  data: new SlashCommandBuilder().setName('battle').setDescription('Roam the woods and autobattle a critter.'),

  async execute(interaction) {
    const p = getPlayer(interaction.user.id);
    if (!p) {
      await interaction.reply({ content: 'Use `/start` to choose your animal first.', ephemeral: true });
      return;
    }

    const now = Date.now();
    const cooldownMs = 8000;
    if (now - p.last_battle_at < cooldownMs) {
      const wait = Math.ceil((cooldownMs - (now - p.last_battle_at)) / 1000);
      await interaction.reply({ content: `Slow and cozy—try again in ${wait}s.`, ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const { level: pLevel } = levelFromXp(p.xp);
    const enemyLevel = clamp(pLevel + randomInt(0, 2), 1, pLevel + 2);
    const enemyAnimalKey = pickEnemyAnimal(p.animal_key);

    const result = simulateBattle({
      player: { animalKey: p.animal_key, level: pLevel },
      enemy: { animalKey: enemyAnimalKey, level: enemyLevel },
    });

    const win = result.winner === 'player';
    const xpGain = win ? 18 + enemyLevel * 6 : 8 + enemyLevel * 3;
    const next = applyXp(p.xp, xpGain);
    updatePlayerXpAndBattleTime({ userId: p.user_id, xp: next.totalXp, lastBattleAt: now });

    const title = win ? 'A cozy victory!' : 'A gentle defeat';
    const image = renderBattleCard({ title, player: result.player, enemy: result.enemy, winner: result.winner });
    const file = new AttachmentBuilder(image, { name: 'battle.png' });

    const nextReq = xpForNext(next.level);
    const embed = new EmbedBuilder()
      .setColor(win ? THEME.ok : THEME.danger)
      .setTitle(title)
      .setDescription(
        `${win ? 'You outlasted your opponent.' : 'You stumble back onto the moss, breathing steady.'}\n` +
          `Gained **${xpGain} XP**. Level **${next.level}** • XP **${next.xpIntoLevel}/${nextReq}**`
      )
      .addFields(
        { name: 'You', value: `${result.player.name} Lv.${result.player.level}`, inline: true },
        { name: 'Opponent', value: `${result.enemy.name} Lv.${result.enemy.level}`, inline: true }
      )
      .setImage('attachment://battle.png')
      .setFooter({ text: cozyLine() });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('battle_again:v1').setLabel('Battle again').setStyle(ButtonStyle.Primary)
    );

    await interaction.editReply({ embeds: [embed], files: [file], components: [row] });
  },
};
