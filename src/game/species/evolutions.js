export const EVOLUTION_PHASES = {
  BABY: 'baby',
  YOUNG: 'young',
  ADULT: 'adult',
  ELDER: 'elder'
};

export const EVOLUTION_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  ANCIENT: 'ancient',
  SUPERNATURAL: 'supernatural'
};

export const PHASE_BONUSES = {
  [EVOLUTION_PHASES.BABY]: { multiplier: 0.6 },
  [EVOLUTION_PHASES.YOUNG]: { multiplier: 0.8 },
  [EVOLUTION_PHASES.ADULT]: { multiplier: 1.0 },
  [EVOLUTION_PHASES.ELDER]: { multiplier: 1.3 }
};

export const RARITY_MULTIPLIERS = {
  [EVOLUTION_RARITY.COMMON]: 1.0,
  [EVOLUTION_RARITY.UNCOMMON]: 1.2,
  [EVOLUTION_RARITY.RARE]: 1.4,
  [EVOLUTION_RARITY.EPIC]: 1.7,
  [EVOLUTION_RARITY.LEGENDARY]: 2.0,
  [EVOLUTION_RARITY.ANCIENT]: 2.5,
  [EVOLUTION_RARITY.SUPERNATURAL]: 3.0
};

export const EVOLUTION_STAGE_REQUIREMENTS = {
  [EVOLUTION_RARITY.LEGENDARY]: {
    minLevel: 45,
    minStats: { atk: 50, def: 40, spd: 45 },
    minBattlesWon: 500,
    epThreshold: 4000,
    rareItems: 3
  },
  [EVOLUTION_RARITY.ANCIENT]: {
    minLevel: 65,
    minStats: { atk: 75, def: 65, spd: 70 },
    minBattlesWon: 1500,
    epThreshold: 7500,
    rareItems: 5,
    timePlayed: 500
  },
  [EVOLUTION_RARITY.SUPERNATURAL]: {
    minLevel: 100,
    minStats: { atk: 150, def: 120, spd: 140 },
    minBattlesWon: 3000,
    epThreshold: 15000,
    rareItems: 10,
    timePlayed: 1000,
    specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame']
  }
};

export function createEvolution(stageNum, name, phase, rarity = EVOLUTION_RARITY.COMMON) {
  return {
    stage: stageNum,
    name,
    phase,
    rarity,
    bonuses: {},
    abilities: [],
    requirements: EVOLUTION_STAGE_REQUIREMENTS[rarity] || {}
  };
}
