// Evolution system with 4 growth phases per evolution (baby, young, adult, elder)
// and 9 evolution stages per species
// Supernatural, Ancient, and Legendary forms have significantly higher requirements

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

// Base evolution costs increase significantly for rare forms
export const EVOLUTION_COSTS = {
  [EVOLUTION_PHASES.BABY]: 0,
  [EVOLUTION_PHASES.YOUNG]: 100,
  [EVOLUTION_PHASES.ADULT]: 350,
  [EVOLUTION_PHASES.ELDER]: 800
};

// Rare form cost multipliers (much higher requirements)
export const RARE_FORM_MULTIPLIERS = {
  [EVOLUTION_RARITY.LEGENDARY]: 8, // 2400+ EP cost
  [EVOLUTION_RARITY.ANCIENT]: 12, // 3600+ EP cost
  [EVOLUTION_RARITY.SUPERNATURAL]: 20 // 6000+ EP cost
};

// Additional requirements for rare forms (much harder conditions)
export const RARE_FORM_REQUIREMENTS = {
  [EVOLUTION_RARITY.LEGENDARY]: {
    minLevel: 45,
    minStats: { atk: 50, def: 40, spd: 45 }, // Require high base stats
    minBattlesWon: 500,
    epThreshold: 4000,
    rareItems: 3 // Need 3 rare evolution items
  },
  [EVOLUTION_RARITY.ANCIENT]: {
    minLevel: 65,
    minStats: { atk: 75, def: 65, spd: 70 },
    minBattlesWon: 1500,
    epThreshold: 7500,
    rareItems: 5,
    timePlayed: 500 // Hours played
  },
  [EVOLUTION_RARITY.SUPERNATURAL]: {
    minLevel: 100,
    minStats: { atk: 150, def: 120, spd: 140 },
    minBattlesWon: 3000,
    epThreshold: 15000,
    rareItems: 10,
    timePlayed: 1000,
    specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame'] // All three required
  }
};

export function createEvolutionStage(stageNumber, name, description, growth, rarity = EVOLUTION_RARITY.COMMON) {
  const baseCost = EVOLUTION_COSTS[growth];
  const multiplier = RARE_FORM_MULTIPLIERS[rarity] || 1;
  const epCost = baseCost * multiplier;

  return {
    number: stageNumber,
    name,
    description,
    growth,
    rarity,
    epCost,
    requirements: rarity !== EVOLUTION_RARITY.COMMON ? RARE_FORM_REQUIREMENTS[rarity] : {},
    bonuses: {},
    abilities: []
  };
}

export function validateRareFormRequirements(playerStats, formRarity) {
  const requirements = RARE_FORM_REQUIREMENTS[formRarity];
  if (!requirements) return true; // Common forms have no special requirements

  const checks = {
    level: playerStats.level >= requirements.minLevel,
    stats: Object.entries(requirements.minStats).every(
      ([stat, minVal]) => playerStats[stat] >= minVal
    ),
    battles: playerStats.battlesWon >= requirements.minBattlesWon,
    ep: playerStats.ep >= requirements.epThreshold,
    items: (playerStats.rareItems || 0) >= requirements.rareItems,
    timePlayed: (playerStats.timePlayed || 0) >= requirements.timePlayed
  };

  if (formRarity === EVOLUTION_RARITY.SUPERNATURAL) {
    checks.specialItems = requirements.specialItems.every(
      item => (playerStats.inventory || []).includes(item)
    );
  }

  return Object.values(checks).every(check => check);
}
