import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const wolfSpecies = {
  key: 'wolf',
  name: 'Wolf',
  baseStats: { hp: 28, atk: 9, def: 6, spd: 7 },
  growthStats: { hp: 6, atk: 2, def: 2, spd: 1 },
  type: 'hunter',
  diet: 'carnivore',

  evolutions: {
    1: {
      ...createEvolutionStage(1, 'Wolf Pup', 'Young pack member, learning to hunt', EVOLUTION_PHASES.BABY),
      bonuses: {},
      abilities: ['bite', 'howl', 'pack_sense']
    },
    2: {
      ...createEvolutionStage(2, 'Young Wolf', 'Growing stronger within the pack', EVOLUTION_PHASES.YOUNG),
      bonuses: { atk: 0.12, def: 0.05, hp: 0.08 },
      abilities: ['bite', 'howl', 'pack_sense', 'coordinated_strike']
    },
    3: {
      ...createEvolutionStage(3, 'Adult Wolf', 'Experienced hunter, pack leader', EVOLUTION_PHASES.ADULT),
      bonuses: { atk: 0.18, def: 0.08, hp: 0.12, spd: 0.06 },
      abilities: ['bite', 'howl', 'pack_sense', 'coordinated_strike', 'alpha_roar']
    },
    4: {
      ...createEvolutionStage(4, 'Elder Wolf', 'Ancient alpha, wisest of the pack', EVOLUTION_PHASES.ELDER),
      bonuses: { atk: 0.25, def: 0.12, hp: 0.18, spd: 0.08, leadership: 0.15 },
      abilities: ['bite', 'howl', 'pack_sense', 'coordinated_strike', 'alpha_roar', 'ancestral_wisdom']
    },
    5: {
      ...createEvolutionStage(5, 'Frost Wolf', 'Wolf blessed with ice', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.14, def: 0.06, spd: 0.08 },
      abilities: ['bite', 'howl', 'pack_sense', 'frost_bite']
    },
    6: {
      ...createEvolutionStage(6, 'Frost Wolf', 'Master of winter storms', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.24, def: 0.1, hp: 0.06, spd: 0.12 },
      abilities: ['bite', 'howl', 'pack_sense', 'frost_bite', 'blizzard_dash', 'ice_armor']
    },
    7: {
      ...createEvolutionStage(7, 'Frost Wolf', 'Frozen apex predator', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.34, def: 0.14, hp: 0.12, spd: 0.16, frozenWill: 0.08 },
      abilities: ['bite', 'howl', 'pack_sense', 'frost_bite', 'blizzard_dash', 'ice_armor', 'permafrost_step']
    },
    8: {
      ...createEvolutionStage(8, 'Frost Wolf', 'Ancient winter given form', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.44, def: 0.18, hp: 0.2, spd: 0.2, infiniteFrost: 0.5, iceAge: 0.3 },
      abilities: ['bite', 'howl', 'pack_sense', 'frost_bite', 'blizzard_dash', 'ice_armor', 'permafrost_step', 'world_freeze']
    },
    9: {
      ...createEvolutionStage(9, 'Void Wolf', 'Predator transcending reality', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL),
      bonuses: { atk: 0.68, def: 0.3, hp: 0.32, spd: 0.32, infiniteHunt: 0.9, voidPredator: 1.2, timeless: 1.0 },
      abilities: ['bite', 'howl', 'pack_sense', 'frost_bite', 'blizzard_dash', 'ice_armor', 'permafrost_step', 'world_freeze', 'void_bite', 'reality_hunt']
    }
  },

  legendaryForm: {
    number: 10,
    name: 'Celestial Wolf',
    description: 'Divine alpha blessed by starlight and destiny',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.LEGENDARY,
    epCost: 2400,
    requirements: {
      minLevel: 45,
      minStats: { atk: 65, def: 45, spd: 50 },
      minBattlesWon: 500,
      epThreshold: 4000,
      rareItems: 3
    },
    bonuses: { atk: 0.5, def: 0.15, hp: 0.15, spd: 0.2, celestialPack: 0.65 },
    abilities: ['bite', 'howl', 'pack_sense', 'coordinated_strike', 'alpha_roar', 'stellar_howl', 'lucky_hunt']
  },

  ancientForm: {
    number: 11,
    name: 'Primordial Alpha',
    description: 'First alpha from the age of creation, keeper of the hunt',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.ANCIENT,
    epCost: 3600,
    requirements: {
      minLevel: 65,
      minStats: { atk: 90, def: 70, spd: 75 },
      minBattlesWon: 1500,
      epThreshold: 7500,
      rareItems: 5,
      timePlayed: 500
    },
    bonuses: { atk: 0.7, def: 0.25, hp: 0.28, spd: 0.3, primalAlpha: 1.0, ancestralPack: 0.8 },
    abilities: ['bite', 'howl', 'pack_sense', 'coordinated_strike', 'alpha_roar', 'primal_hunt', 'ancient_roar', 'genesis_pack']
  },

  supernaturalForm: {
    number: 12,
    name: 'Void Predator',
    description: 'Incomprehensible entity hunting across realities',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.SUPERNATURAL,
    epCost: 6000,
    requirements: {
      minLevel: 100,
      minStats: { atk: 170, def: 130, spd: 140 },
      minBattlesWon: 3000,
      epThreshold: 15000,
      rareItems: 10,
      timePlayed: 1000,
      specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame']
    },
    bonuses: { atk: 1.2, def: 0.45, hp: 0.5, spd: 0.5, supernaturalHunt: 2.2, voidPack: 1.8, infinitePredator: 1.0 },
    abilities: ['bite', 'howl', 'pack_sense', 'void_bite', 'reality_howl', 'chaos_hunt', 'infinity_pack', 'void_phase']
  },

  statUpgrades: {
    ferocity: {
      name: 'Ferocity',
      description: 'Increases attack power and pack coordination',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        atk: points * 0.12,
        packBonus: points * 0.004
      })
    },
    resilience: {
      name: 'Resilience',
      description: 'Improves defense and pack protection',
      costPerPoint: 2,
      maxPoints: 45,
      effect: (points) => ({
        def: points * 0.09,
        protectionAura: points * 0.003
      })
    },
    instinct: {
      name: 'Instinct',
      description: 'Enhances hunting sense and coordination',
      costPerPoint: 3,
      maxPoints: 40,
      effect: (points) => ({
        atk: points * 0.08,
        coordination: points * 0.006
      })
    }
  }
};
