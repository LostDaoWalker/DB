import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const foxSpecies = {
  key: 'fox',
  name: 'Fox',
  baseStats: { hp: 24, atk: 8, def: 4, spd: 8 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 1 },
  type: 'cunning',
  diet: 'carnivore',

  // 9 evolution stages
  evolutions: {
    1: {
      ...createEvolutionStage(1, 'Fox Kit', 'Curious and playful, learning to hunt', EVOLUTION_PHASES.BABY),
      bonuses: {},
      abilities: ['bite', 'pounce', 'trick']
    },
    2: {
      ...createEvolutionStage(2, 'Young Fox', 'Growing cunning, improving hunting tactics', EVOLUTION_PHASES.YOUNG),
      bonuses: { atk: 0.1, spd: 0.08 },
      abilities: ['bite', 'pounce', 'trick', 'feint']
    },
    3: {
      ...createEvolutionStage(3, 'Adult Fox', 'Skilled hunter with refined tactics', EVOLUTION_PHASES.ADULT),
      bonuses: { atk: 0.15, spd: 0.12, def: 0.03 },
      abilities: ['bite', 'pounce', 'trick', 'feint', 'ambush']
    },
    4: {
      ...createEvolutionStage(4, 'Elder Fox', 'Wise predator, master strategist', EVOLUTION_PHASES.ELDER),
      bonuses: { atk: 0.2, spd: 0.15, def: 0.05, luck: 0.1 },
      abilities: ['bite', 'pounce', 'trick', 'feint', 'ambush', 'cunning_strike']
    },
    5: {
      ...createEvolutionStage(5, 'Flame Fox', 'Fox with control over fire', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.18, spd: 0.1 },
      abilities: ['bite', 'pounce', 'trick', 'flame_bite']
    },
    6: {
      ...createEvolutionStage(6, 'Flame Fox', 'Master of flames and heat', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.28, spd: 0.14, def: 0.04 },
      abilities: ['bite', 'pounce', 'trick', 'flame_bite', 'inferno_dash', 'fox_fire']
    },
    7: {
      ...createEvolutionStage(7, 'Flame Fox', 'Inferno incarnate', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.38, spd: 0.18, def: 0.08, luck: 0.08 },
      abilities: ['bite', 'pounce', 'trick', 'flame_bite', 'inferno_dash', 'fox_fire', 'flame_shield']
    },
    8: {
      ...createEvolutionStage(8, 'Flame Fox', 'Ancient phoenix reborn in flames', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.48, spd: 0.22, def: 0.12, luck: 0.15, rebirth: 0.3 },
      abilities: ['bite', 'pounce', 'trick', 'flame_bite', 'inferno_dash', 'fox_fire', 'flame_shield', 'phoenix_revival']
    },
    9: {
      ...createEvolutionStage(9, 'Void Fox', 'Primordial fox transcending reality', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL),
      bonuses: { atk: 0.68, spd: 0.35, def: 0.2, luck: 0.3, infiniteFlame: 0.8, timelessFire: 1.0 },
      abilities: ['bite', 'pounce', 'trick', 'flame_bite', 'inferno_dash', 'fox_fire', 'flame_shield', 'phoenix_revival', 'eternal_inferno', 'reality_burn']
    }
  },

  legendaryForm: {
    number: 10,
    name: 'Celestial Fox',
    description: 'Divine fox of stars and destiny, master of fortune',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.LEGENDARY,
    epCost: 2400,
    requirements: {
      minLevel: 45,
      minStats: { atk: 60, def: 35, spd: 50 },
      minBattlesWon: 500,
      epThreshold: 4000,
      rareItems: 3
    },
    bonuses: { atk: 0.45, spd: 0.28, def: 0.08, luck: 0.4, celestialBond: 0.6 },
    abilities: ['bite', 'pounce', 'trick', 'feint', 'ambush', 'cunning_strike', 'stellar_bound', 'lucky_strike']
  },

  ancientForm: {
    number: 11,
    name: 'Primordial Kitsune',
    description: 'Ancient nine-tailed fox from primordial times, keeper of arcane knowledge',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.ANCIENT,
    epCost: 3600,
    requirements: {
      minLevel: 65,
      minStats: { atk: 85, def: 55, spd: 75 },
      minBattlesWon: 1500,
      epThreshold: 7500,
      rareItems: 5,
      timePlayed: 500
    },
    bonuses: { atk: 0.65, spd: 0.42, def: 0.15, luck: 0.5, primalMagic: 0.9, ancestralWisdom: 0.7 },
    abilities: ['bite', 'pounce', 'trick', 'feint', 'ambush', 'cunning_strike', 'ancient_magic', 'nine_tails_strike', 'arcane_echo']
  },

  supernaturalForm: {
    number: 12,
    name: 'Void Kitsune',
    description: 'Incomprehensible being existing between reality and void, transcendent trickster',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.SUPERNATURAL,
    epCost: 6000,
    requirements: {
      minLevel: 100,
      minStats: { atk: 160, def: 100, spd: 150 },
      minBattlesWon: 3000,
      epThreshold: 15000,
      rareItems: 10,
      timePlayed: 1000,
      specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame']
    },
    bonuses: { atk: 1.1, spd: 0.65, def: 0.28, luck: 0.75, supernaturalTrick: 2.0, voidMastery: 1.5, infiniteTails: 1.0 },
    abilities: ['bite', 'pounce', 'trick', 'feint', 'ambush', 'cunning_strike', 'void_phase', 'reality_trick', 'chaos_bite', 'infinity_tails']
  },

  statUpgrades: {
    cunning: {
      name: 'Cunning',
      description: 'Increases critical hits and special trick success rate',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        critChance: points * 0.004,
        trickSuccess: points * 0.005
      })
    },
    agility: {
      name: 'Agility',
      description: 'Improves speed and evasion',
      costPerPoint: 2,
      maxPoints: 45,
      effect: (points) => ({
        spd: points * 0.1,
        evasion: points * 0.003
      })
    },
    instinct: {
      name: 'Instinct',
      description: 'Enhances hunting precision and luck',
      costPerPoint: 3,
      maxPoints: 40,
      effect: (points) => ({
        atk: points * 0.08,
        luckBonus: points * 0.006
      })
    }
  }
};
