import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const snakeSpecies = {
  key: 'snake',
  name: 'Snake',
  baseStats: { hp: 20, atk: 10, def: 5, spd: 9 },
  growthStats: { hp: 4, atk: 3, def: 1, spd: 2 },
  type: 'venomous',
  diet: 'carnivore',

  evolutions: {
    1: {
      ...createEvolutionStage(1, 'Snake Hatchling', 'Tiny serpent just emerged', EVOLUTION_PHASES.BABY),
      bonuses: {},
      abilities: ['bite', 'hiss', 'coil']
    },
    2: {
      ...createEvolutionStage(2, 'Snake', 'Growing serpent, learning to hunt', EVOLUTION_PHASES.YOUNG),
      bonuses: { atk: 0.12, spd: 0.1 },
      abilities: ['bite', 'hiss', 'coil', 'venom_strike']
    },
    3: {
      ...createEvolutionStage(3, 'Snake', 'Deadly predator with lethal venom', EVOLUTION_PHASES.ADULT),
      bonuses: { atk: 0.18, spd: 0.15, def: 0.03 },
      abilities: ['bite', 'hiss', 'coil', 'venom_strike', 'poison_pool']
    },
    4: {
      ...createEvolutionStage(4, 'Snake', 'Ancient serpent, master of venom', EVOLUTION_PHASES.ELDER),
      bonuses: { atk: 0.26, spd: 0.2, def: 0.05, toxicity: 0.2 },
      abilities: ['bite', 'hiss', 'coil', 'venom_strike', 'poison_pool', 'venom_mastery']
    },
    5: {
      ...createEvolutionStage(5, 'Crystal Snake', 'Serpent of crystalline beauty', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.14, def: 0.06, spd: 0.08 },
      abilities: ['bite', 'hiss', 'coil', 'crystal_bite']
    },
    6: {
      ...createEvolutionStage(6, 'Crystal Snake', 'Master of hardened defenses', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.24, def: 0.12, spd: 0.12 },
      abilities: ['bite', 'hiss', 'coil', 'crystal_bite', 'crystal_armor', 'reflect']
    },
    7: {
      ...createEvolutionStage(7, 'Crystal Snake', 'Living gem of unbreakable will', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.34, def: 0.18, spd: 0.16, durability: 0.08 },
      abilities: ['bite', 'hiss', 'coil', 'crystal_bite', 'crystal_armor', 'reflect', 'prismatic_strike']
    },
    8: {
      ...createEvolutionStage(8, 'Crystal Snake', 'Ancient crystal given serpent form', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.44, def: 0.26, spd: 0.2, crystalline: 0.4 },
      abilities: ['bite', 'hiss', 'coil', 'crystal_bite', 'crystal_armor', 'reflect', 'prismatic_strike', 'gem_barrier']
    },
    9: {
      ...createEvolutionStage(9, 'Void Snake', 'Serpent transcending reality', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL),
      bonuses: { atk: 0.64, def: 0.4, spd: 0.32, infiniteVenom: 0.9, voidShift: 1.0 },
      abilities: ['bite', 'hiss', 'coil', 'crystal_bite', 'crystal_armor', 'reflect', 'prismatic_strike', 'gem_barrier', 'void_fang', 'reality_strike']
    }
  },

  legendaryForm: {
    number: 10,
    name: 'Celestial Serpent',
    description: 'Divine snake blessed by the heavens, bearer of grace',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.LEGENDARY,
    epCost: 2400,
    requirements: {
      minLevel: 45,
      minStats: { atk: 60, def: 38, spd: 50 },
      minBattlesWon: 500,
      epThreshold: 4000,
      rareItems: 3
    },
    bonuses: { atk: 0.5, spd: 0.32, def: 0.08, luck: 0.3, celestialBlessing: 0.6 },
    abilities: ['bite', 'hiss', 'coil', 'venom_strike', 'poison_pool', 'venom_mastery', 'stellar_strike']
  },

  ancientForm: {
    number: 11,
    name: 'Primordial Serpent',
    description: 'Ancient serpent from creation\'s dawn, keeper of primal venom',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.ANCIENT,
    epCost: 3600,
    requirements: {
      minLevel: 65,
      minStats: { atk: 85, def: 58, spd: 75 },
      minBattlesWon: 1500,
      epThreshold: 7500,
      rareItems: 5,
      timePlayed: 500
    },
    bonuses: { atk: 0.7, spd: 0.48, def: 0.15, toxicity: 0.8, primalVenom: 0.9 },
    abilities: ['bite', 'hiss', 'coil', 'venom_strike', 'poison_pool', 'venom_mastery', 'primal_toxin', 'genesis_strike']
  },

  supernaturalForm: {
    number: 12,
    name: 'Entity of Venom',
    description: 'Incomprehensible being of pure toxicity and corruption',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.SUPERNATURAL,
    epCost: 6000,
    requirements: {
      minLevel: 100,
      minStats: { atk: 165, def: 110, spd: 145 },
      minBattlesWon: 3000,
      epThreshold: 15000,
      rareItems: 10,
      timePlayed: 1000,
      specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame']
    },
    bonuses: { atk: 1.15, spd: 0.7, def: 0.28, supernaturalToxin: 2.2, voidCorruption: 1.8, infiniteVenom: 1.0 },
    abilities: ['bite', 'hiss', 'void_fang', 'reality_strike', 'void_phase', 'corruption_bite', 'chaos_toxin', 'infinity_venom']
  },

  statUpgrades: {
    toxicity: {
      name: 'Toxicity',
      description: 'Increases venom potency and poison damage',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        atk: points * 0.11,
        poisonDamage: points * 0.006
      })
    },
    agility: {
      name: 'Agility',
      description: 'Improves speed and evasion',
      costPerPoint: 2,
      maxPoints: 45,
      effect: (points) => ({
        spd: points * 0.13,
        evasion: points * 0.003
      })
    },
    durability: {
      name: 'Durability',
      description: 'Increases scale hardness and defense',
      costPerPoint: 2,
      maxPoints: 45,
      effect: (points) => ({
        def: points * 0.09,
        resistance: points * 0.004
      })
    }
  }
};
