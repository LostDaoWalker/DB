import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const rabbitSpecies = {
  key: 'rabbit',
  name: 'Rabbit',
  baseStats: { hp: 22, atk: 7, def: 4, spd: 10 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 2 },
  type: 'nimble',
  diet: 'herbivore',

  // 9 evolution stages with 4 growth phases each (baby, young, adult, elder)
  evolutions: {
    1: {
      ...createEvolutionStage(1, 'Rabbit Kit', 'Playful and curious, learning to hop and hide', EVOLUTION_PHASES.BABY),
      bonuses: {},
      abilities: ['dodge', 'burrow']
    },
    2: {
      ...createEvolutionStage(2, 'Young Rabbit', 'Growing more agile, developing evasion skills', EVOLUTION_PHASES.YOUNG),
      bonuses: { spd: 0.12, def: 0.03 },
      abilities: ['dodge', 'burrow', 'hop']
    },
    3: {
      ...createEvolutionStage(3, 'Adult Rabbit', 'Prime of life, skilled at evasion and survival', EVOLUTION_PHASES.ADULT),
      bonuses: { spd: 0.15, def: 0.05 },
      abilities: ['dodge', 'burrow', 'hop', 'evade']
    },
    4: {
      ...createEvolutionStage(4, 'Elder Rabbit', 'Wise and experienced, master of the warren', EVOLUTION_PHASES.ELDER),
      bonuses: { spd: 0.18, def: 0.08, evasion: 0.1 },
      abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master']
    },
    5: {
      ...createEvolutionStage(5, 'Shadow Rabbit', 'Shadow-touched rabbit of dark places', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { spd: 0.2, evasion: 0.05 },
      abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak']
    },
    6: {
      ...createEvolutionStage(6, 'Shadow Rabbit', 'Master of shadows and darkness', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { spd: 0.28, def: 0.04, evasion: 0.12 },
      abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak', 'shadow_step']
    },
    7: {
      ...createEvolutionStage(7, 'Shadow Rabbit', 'One with the void', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { spd: 0.35, def: 0.06, evasion: 0.18, luck: 0.08 },
      abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak', 'shadow_step', 'void_phase']
    },
    8: {
      ...createEvolutionStage(8, 'Shadow Rabbit', 'Ancient darkness given form', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { spd: 0.42, def: 0.08, evasion: 0.25, luck: 0.12, voidshift: 0.4 },
      abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak', 'shadow_step', 'void_phase', 'eternal_darkness']
    },
    9: {
      ...createEvolutionStage(9, 'Void Rabbit', 'Primordial rabbit transcending time and space', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL),
      bonuses: { spd: 0.65, def: 0.15, evasion: 0.4, luck: 0.25, voidshift: 0.7, timeless: 1.0 },
      abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak', 'shadow_step', 'void_phase', 'eternal_darkness', 'reality_slip']
    }
  },

  // Legendary branch (high requirements)
  legendaryForm: {
    number: 10,
    name: 'Celestial Rabbit',
    description: 'Divine rabbit of the stars, embodiment of fortune and speed',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.LEGENDARY,
    epCost: 2400,
    requirements: {
      minLevel: 45,
      minStats: { atk: 50, def: 40, spd: 45 },
      minBattlesWon: 500,
      epThreshold: 4000,
      rareItems: 3
    },
    bonuses: { spd: 0.5, def: 0.12, evasion: 0.35, luck: 0.3, celestialBlessing: 0.5 },
    abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'stellar_bound', 'lucky_bounce', 'cosmic_shift']
  },

  // Ancient branch (much higher requirements)
  ancientForm: {
    number: 11,
    name: 'Primordial Hare',
    description: 'Ancient rabbit from the first dawn, master of primal momentum',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.ANCIENT,
    epCost: 3600,
    requirements: {
      minLevel: 65,
      minStats: { atk: 75, def: 65, spd: 70 },
      minBattlesWon: 1500,
      epThreshold: 7500,
      rareItems: 5,
      timePlayed: 500
    },
    bonuses: { spd: 0.7, def: 0.2, evasion: 0.45, luck: 0.4, primordialForce: 0.8, ancestralMemory: 0.6 },
    abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'primal_dash', 'ancient_instinct', 'genesis_hop', 'ancestral_echo']
  },

  // Supernatural branch (extremely high requirements)
  supernaturalForm: {
    number: 12,
    name: 'Entity of Eternity',
    description: 'Incomprehensible being that exists outside reality, pure essence of speed incarnate',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.SUPERNATURAL,
    epCost: 6000,
    requirements: {
      minLevel: 100,
      minStats: { atk: 150, def: 120, spd: 140 },
      minBattlesWon: 3000,
      epThreshold: 15000,
      rareItems: 10,
      timePlayed: 1000,
      specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame']
    },
    bonuses: { spd: 1.2, def: 0.4, evasion: 0.7, luck: 0.6, supernaturalForce: 2.0, realityBend: 1.5, infiniteBounce: 1.0 },
    abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'chaos_leap', 'void_phase', 'reality_warp', 'infinity_bound', 'temporal_shift']
  },

  // EP-based stat upgrades
  statUpgrades: {
    agility: {
      name: 'Agility',
      description: 'Increases speed and evasion capabilities',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        spd: points * 0.12,
        evasion: points * 0.004
      })
    },
    luck: {
      name: 'Luck',
      description: 'Improves critical hits and random positive effects',
      costPerPoint: 3,
      maxPoints: 40,
      effect: (points) => ({
        critChance: points * 0.003,
        luckBonus: points * 0.005
      })
    },
    endurance: {
      name: 'Endurance',
      description: 'Better stamina and defense while moving',
      costPerPoint: 2,
      maxPoints: 45,
      effect: (points) => ({
        def: points * 0.08,
        stamina: points * 0.01
      })
    }
  }
};
