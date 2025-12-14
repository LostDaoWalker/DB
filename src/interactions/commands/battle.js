import { randomInt } from 'node:crypto';
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { THEME, primalLine } from '../constants/theme.js';
import { getPlayer, updatePlayerXpAndBattleTime } from '../../db/index.js';
import { levelFromXp, applyXp, xpForNext } from '../../game/leveling.js';
import { listAnimals } from '../../game/species/index.js';
import { simulateBattle } from '../../game/battle/engine.js';
import { renderBattleCard } from '../../ui/renderBattleCard.js';
import { logBattleResult, logLevelUp } from '../../utils/playerActivityLogger.js';
import { updatePlayerBattleStats } from '../../db/index.js';
import { logger } from '../../logger.js';

function pickEnemyAnimal(playerAnimalKey) {
  const animals = listAnimals().filter((a) => a.key !== playerAnimalKey);
  return animals[randomInt(0, animals.length)].key;
}

function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
}

export const battleCommand = {
  data: new SlashCommandBuilder().setName('battle').setDescription('Battle other animals.'),

  async execute(interaction) {
    const p = getPlayer(interaction.user.id);
    if (!p) {
      await interaction.reply('No animal. Use `/start`.');
      return;
    }

    const now = Date.now();
    if (now - p.last_battle_at < 3000) {
      await interaction.reply({ content: 'Recovering...', ephemeral: true });
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
    const { level: oldLevel } = levelFromXp(p.xp);
    updatePlayerXpAndBattleTime({ userId: p.user_id, xp: next.totalXp, lastBattleAt: now });

    // Update battle statistics
    await updatePlayerBattleStats({ userId: interaction.user.id, won: win, now });

    // Log battle result
    await logBattleResult(
      interaction.user.id,
      interaction.user.username,
      result.player.name,
      result.enemy.name,
      result.winner,
      xpGain,
      next.level > oldLevel
    );

    // Log level up if applicable
    if (next.level > oldLevel) {
      await logLevelUp(interaction.user.id, interaction.user.username, result.player.name, next.level);
    }

    const title = win ? 'Victory' : 'Defeated';
    let file;
    try {
      const image = renderBattleCard({ title, player: result.player, enemy: result.enemy, winner: result.winner });
      file = new AttachmentBuilder(image, { name: 'battle.png' });
    } catch (renderErr) {
      // If rendering fails, continue without the image but log the error
      logger.warn({ err: renderErr }, 'Battle card rendering failed, continuing without image');
      // Don't throw here - the battle result is still valid
    }

    const nextReq = xpForNext(next.level);
    const leveledUp = next.level > result.player.level;

    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setColor(win ? THEME.ok : THEME.danger)
        .setTitle(title)
        .setDescription(`${leveledUp ? 'LEVEL UP ' : ''}+${xpGain} XP\nLevel ${next.level} • ${next.xpIntoLevel}/${nextReq} XP`)
        .addFields(
          { name: result.player.name, value: `Level ${result.player.level}${leveledUp ? ' → ' + next.level : ''}`, inline: true },
          { name: result.enemy.name, value: `Level ${result.enemy.level}`, inline: true }
        )
        .setImage('attachment://battle.png')
      ],
      files: [file],
      components: [new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('battle_again:v1')
          .setLabel('Battle Again')
          .setStyle(ButtonStyle.Primary)
      )]
    });
  },
};
