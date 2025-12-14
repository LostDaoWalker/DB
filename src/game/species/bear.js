import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const bearSpecies = {
  key: 'bear',
  name: 'Bear',
  baseStats: { hp: 32, atk: 7, def: 7, spd: 4 },
  growthStats: { hp: 7, atk: 2, def: 2, spd: 1 },
  type: 'tank',
  diet: 'omnivore',

  // 9 evolution stages
  evolutions: {
    1: {
      ...createEvolutionStage(1, 'Bear Cub', 'Young and playful, learning to be strong', EVOLUTION_PHASES.BABY),
      bonuses: {},
      abilities: ['maul', 'growl', 'bash']
    },
    2: {
      ...createEvolutionStage(2, 'Young Bear', 'Growing stronger, developing muscle', EVOLUTION_PHASES.YOUNG),
      bonuses: { atk: 0.1, def: 0.08, hp: 0.05 },
      abilities: ['maul', 'growl', 'bash', 'charge']
    },
    3: {
      ...createEvolutionStage(3, 'Adult Bear', 'Full strength and dominance', EVOLUTION_PHASES.ADULT),
      bonuses: { atk: 0.15, def: 0.12, hp: 0.1 },
      abilities: ['maul', 'growl', 'bash', 'charge', 'slam']
    },
    4: {
      ...createEvolutionStage(4, 'Elder Bear', 'Ancient guardian of the forest', EVOLUTION_PHASES.ELDER),
      bonuses: { atk: 0.2, def: 0.15, hp: 0.15, damageReduction: 0.1 },
      abilities: ['maul', 'growl', 'bash', 'charge', 'slam', 'earth_shake']
    },
    5: {
      ...createEvolutionStage(5, 'Stone Bear', 'Bear hardened like mountain rock', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { def: 0.12, hp: 0.08 },
      abilities: ['maul', 'growl', 'bash', 'stone_skin']
    },
    6: {
      ...createEvolutionStage(6, 'Stone Bear', 'Living mountain of stone and muscle', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { def: 0.2, hp: 0.15, atk: 0.08 },
      abilities: ['maul', 'growl', 'bash', 'stone_skin', 'granite_form', 'boulder_throw']
    },
    7: {
      ...createEvolutionStage(7, 'Stone Bear', 'Fortress of stone, immovable', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { def: 0.28, hp: 0.25, atk: 0.12, damageReduction: 0.15 },
      abilities: ['maul', 'growl', 'bash', 'stone_skin', 'granite_form', 'boulder_throw', 'mountain_stand']
    },
    8: {
      ...createEvolutionStage(8, 'Stone Bear', 'Ancient mountain given life', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { def: 0.38, hp: 0.35, atk: 0.16, damageReduction: 0.22, stability: 0.4 },
      abilities: ['maul', 'growl', 'bash', 'stone_skin', 'granite_form', 'boulder_throw', 'mountain_stand', 'continental_shift']
    },
    9: {
      ...createEvolutionStage(9, 'Void Bear', 'Primordial being transcending reality', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL),
      bonuses: { def: 0.58, hp: 0.55, atk: 0.28, damageReduction: 0.4, infiniteStone: 0.8, geologicMastery: 1.0 },
      abilities: ['maul', 'growl', 'bash', 'stone_skin', 'granite_form', 'boulder_throw', 'mountain_stand', 'continental_shift', 'world_quake', 'stone_eternity']
    }
  },

  legendaryForm: {
    number: 10,
    name: 'Divine Guardian',
    description: 'Holy bear of protection and strength, blessed guardian',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.LEGENDARY,
    epCost: 2400,
    requirements: {
      minLevel: 45,
      minStats: { atk: 40, def: 60, spd: 25 },
      minBattlesWon: 500,
      epThreshold: 4000,
      rareItems: 3
    },
    bonuses: { atk: 0.25, def: 0.35, hp: 0.2, holyAura: 0.5 },
    abilities: ['maul', 'growl', 'bash', 'charge', 'slam', 'earth_shake', 'divine_protection', 'sacred_roar']
  },

  ancientForm: {
    number: 11,
    name: 'Primordial Guardian',
    description: 'Ancient guardian from the age of creation, keeper of balance',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.ANCIENT,
    epCost: 3600,
    requirements: {
      minLevel: 65,
      minStats: { atk: 55, def: 85, spd: 40 },
      minBattlesWon: 1500,
      epThreshold: 7500,
      rareItems: 5,
      timePlayed: 500
    },
    bonuses: { atk: 0.35, def: 0.52, hp: 0.35, primalForce: 0.8, ancientMemory: 0.7 },
    abilities: ['maul', 'growl', 'bash', 'charge', 'slam', 'earth_shake', 'primal_rage', 'ancient_blessing', 'genesis_roar']
  },

  supernaturalForm: {
    number: 12,
    name: 'Titan of Eternity',
    description: 'Being transcending time and space, infinite protector',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.SUPERNATURAL,
    epCost: 6000,
    requirements: {
      minLevel: 100,
      minStats: { atk: 120, def: 160, spd: 70 },
      minBattlesWon: 3000,
      epThreshold: 15000,
      rareItems: 10,
      timePlayed: 1000,
      specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame']
    },
    bonuses: { atk: 0.6, def: 1.0, hp: 0.7, supernaturalShield: 2.0, realityAnchor: 1.5, infiniteGuard: 1.0 },
    abilities: ['maul', 'growl', 'bash', 'charge', 'slam', 'earth_shake', 'void_protection', 'reality_anchoring', 'chaos_guard', 'infinity_shield']
  },

  statUpgrades: {
    strength: {
      name: 'Strength',
      description: 'Increases attack and crushing power',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        atk: points * 0.12,
        crushPower: points * 0.005
      })
    },
    fortitude: {
      name: 'Fortitude',
      description: 'Improves defense and damage reduction',
      costPerPoint: 2,
      maxPoints: 60,
      effect: (points) => ({
        def: points * 0.1,
        damageReduction: points * 0.004
      })
    },
    endurance: {
      name: 'Endurance',
      description: 'Increases health and resilience',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        hp: points * 0.18,
        regeneration: points * 0.003
      })
    }
  }
};
