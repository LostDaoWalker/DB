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

// EP cost requirements - dramatic exponential scaling
export const EP_COST_BASE = {
  [EVOLUTION_RARITY.COMMON]: 100,
  [EVOLUTION_RARITY.UNCOMMON]: 300,
  [EVOLUTION_RARITY.RARE]: 800,
  [EVOLUTION_RARITY.EPIC]: 2000,
  [EVOLUTION_RARITY.LEGENDARY]: 8000,
  [EVOLUTION_RARITY.ANCIENT]: 35000,
  [EVOLUTION_RARITY.SUPERNATURAL]: 150000
};

// Extreme legendary/ancient/supernatural requirements
export const EXTREME_REQUIREMENTS = {
  [EVOLUTION_RARITY.LEGENDARY]: {
    minLevel: 50,
    minStats: { atk: 80, def: 60, spd: 75 },
    minBattlesWon: 1000,
    minPlaytimeHours: 100,
    rarityMult: 8,
    totalEpRequired: 64000
  },
  [EVOLUTION_RARITY.ANCIENT]: {
    minLevel: 85,
    minStats: { atk: 150, def: 120, spd: 140 },
    minBattlesWon: 5000,
    minPlaytimeHours: 500,
    rarityMult: 35,
    totalEpRequired: 1225000,
    specialItems: 5
  },
  [EVOLUTION_RARITY.SUPERNATURAL]: {
    minLevel: 120,
    minStats: { atk: 250, def: 200, spd: 220 },
    minBattlesWon: 15000,
    minPlaytimeHours: 1500,
    rarityMult: 150,
    totalEpRequired: 22500000,
    specialItems: 15,
    requiredItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame', 'primordial_stone']
  }
};

export function createEvolution(stageNum, name, phase, rarity = EVOLUTION_RARITY.COMMON) {
  const baseEp = EP_COST_BASE[rarity] || 0;
  
  return {
    stage: stageNum,
    name,
    phase,
    rarity,
    epCost: baseEp,
    bonuses: {},
    abilities: [],
    requirements: EXTREME_REQUIREMENTS[rarity] || {}
  };
}

export function calculateTotalEpForRarity(rarity) {
  return EXTREME_REQUIREMENTS[rarity]?.totalEpRequired || 0;
}
