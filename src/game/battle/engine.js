import { randomInt } from 'node:crypto';
import { getStats, getAnimal } from '../animals.js';

function clampMin(n, min) {
  return n < min ? min : n;
}

function rollChance(outOf100) {
  return randomInt(0, 100) < outOf100;
}

function calcDamage({ atk, def, steady }) {
  // Fast integer math; DEF softens but never negates.
  const base = atk - Math.floor(def / 2);
  const variance = steady ? randomInt(0, 2) : randomInt(0, 4); // owl slightly steadier
  return clampMin(base + variance, 1);
}

function applyPassives({ attackerKey, defenderKey, dmg }) {
  // Keep this intentionally small and deterministic-ish (no complicated state).
  if (attackerKey === 'fox' && rollChance(12)) return { dmg: dmg + Math.max(1, Math.floor(dmg * 0.5)), tag: 'crit' };
  if (defenderKey === 'bear' && rollChance(18)) return { dmg: Math.max(1, Math.floor(dmg * 0.65)), tag: 'guard' };
  if (defenderKey === 'rabbit' && rollChance(12)) return { dmg: 0, tag: 'dodge' };
  return { dmg, tag: null };
}

export function simulateBattle({ player, enemy }) {
  const pAnimal = getAnimal(player.animalKey);
  const eAnimal = getAnimal(enemy.animalKey);

  const pStats = getStats(player.animalKey, player.level);
  const eStats = getStats(enemy.animalKey, enemy.level);

  let pHp = pStats.hp;
  let eHp = eStats.hp;

  const log = [];
  const maxTurns = 30;

  const pSteady = player.animalKey === 'owl';
  const eSteady = enemy.animalKey === 'owl';

  for (let turn = 1; turn <= maxTurns; turn += 1) {
    const first = pStats.spd >= eStats.spd ? 'p' : 'e';

    const step = (who) => {
      if (pHp <= 0 || eHp <= 0) return;

      const atkSide = who === 'p' ? 'p' : 'e';
      const defSide = who === 'p' ? 'e' : 'p';

      const atkKey = atkSide === 'p' ? player.animalKey : enemy.animalKey;
      const defKey = defSide === 'p' ? player.animalKey : enemy.animalKey;

      const atkStats = atkSide === 'p' ? pStats : eStats;
      const defStats = defSide === 'p' ? pStats : eStats;

      const raw = calcDamage({ atk: atkStats.atk, def: defStats.def, steady: atkSide === 'p' ? pSteady : eSteady });
      const mod = applyPassives({ attackerKey: atkKey, defenderKey: defKey, dmg: raw });

      if (defSide === 'p') pHp = clampMin(pHp - mod.dmg, 0);
      else eHp = clampMin(eHp - mod.dmg, 0);

      log.push({
        turn,
        attacker: atkSide,
        damage: mod.dmg,
        tag: mod.tag,
        hp: { p: pHp, e: eHp },
      });
    };

    if (first === 'p') {
      step('p');
      step('e');
    } else {
      step('e');
      step('p');
    }

    if (pHp <= 0 || eHp <= 0) break;
  }

  const winner = pHp > 0 && eHp <= 0 ? 'player' : eHp > 0 && pHp <= 0 ? 'enemy' : pHp >= eHp ? 'player' : 'enemy';

  return {
    player: {
      name: pAnimal.name,
      animalKey: player.animalKey,
      level: player.level,
      maxHp: pStats.hp,
      hp: pHp,
    },
    enemy: {
      name: eAnimal.name,
      animalKey: enemy.animalKey,
      level: enemy.level,
      maxHp: eStats.hp,
      hp: eHp,
    },
    winner,
    log,
  };
}
