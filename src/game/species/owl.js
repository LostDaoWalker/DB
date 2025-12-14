import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const owlSpecies = {
  key: 'owl',
  name: 'Owl',
  baseStats: { hp: 26, atk: 8, def: 5, spd: 6 },
  growthStats: { hp: 6, atk: 2, def: 1, spd: 1 },
  type: 'wise',
  diet: 'carnivore',

  evolutions: {
    1: {
      ...createEvolutionStage(1, 'Owlet', 'Young owl just learning to fly', EVOLUTION_PHASES.BABY),
      bonuses: {},
      abilities: ['peck', 'hoot', 'night_hunt']
    },
    2: {
      ...createEvolutionStage(2, 'Owl', 'Growing owl with improved vision', EVOLUTION_PHASES.YOUNG),
      bonuses: { atk: 0.1, spd: 0.08, def: 0.03 },
      abilities: ['peck', 'hoot', 'night_hunt', 'swoop']
    },
    3: {
      ...createEvolutionStage(3, 'Owl', 'Skilled hunter with precise strikes', EVOLUTION_PHASES.ADULT),
      bonuses: { atk: 0.16, spd: 0.12, def: 0.05, luck: 0.05 },
      abilities: ['peck', 'hoot', 'night_hunt', 'swoop', 'precision_strike']
    },
    4: {
      ...createEvolutionStage(4, 'Owl', 'Wise guardian of the night', EVOLUTION_PHASES.ELDER),
      bonuses: { atk: 0.22, spd: 0.15, def: 0.08, luck: 0.1, wisdom: 0.15 },
      abilities: ['peck', 'hoot', 'night_hunt', 'swoop', 'precision_strike', 'wise_judgment']
    },
    5: {
      ...createEvolutionStage(5, 'Thunder Owl', 'Owl channeling lightning', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.14, spd: 0.1 },
      abilities: ['peck', 'hoot', 'night_hunt', 'lightning_peck']
    },
    6: {
      ...createEvolutionStage(6, 'Thunder Owl', 'Master of storm and lightning', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.24, spd: 0.14, def: 0.04 },
      abilities: ['peck', 'hoot', 'night_hunt', 'lightning_peck', 'storm_dive', 'electric_aura']
    },
    7: {
      ...createEvolutionStage(7, 'Thunder Owl', 'Storm bringer of the sky', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.34, spd: 0.18, def: 0.08, luck: 0.08 },
      abilities: ['peck', 'hoot', 'night_hunt', 'lightning_peck', 'storm_dive', 'electric_aura', 'thunder_strike']
    },
    8: {
      ...createEvolutionStage(8, 'Thunder Owl', 'Ancient tempest given wings', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.44, spd: 0.22, def: 0.12, luck: 0.15, stormwrath: 0.4 },
      abilities: ['peck', 'hoot', 'night_hunt', 'lightning_peck', 'storm_dive', 'electric_aura', 'thunder_strike', 'sky_shatter']
    },
    9: {
      ...createEvolutionStage(9, 'Void Owl', 'Primordial owl transcending reality', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL),
      bonuses: { atk: 0.64, spd: 0.34, def: 0.2, luck: 0.3, infiniteStorm: 0.8, voidSight: 1.0 },
      abilities: ['peck', 'hoot', 'night_hunt', 'lightning_peck', 'storm_dive', 'electric_aura', 'thunder_strike', 'sky_shatter', 'void_gaze', 'reality_screech']
    }
  },

  legendaryForm: {
    number: 10,
    name: 'Celestial Owl',
    description: 'Divine owl blessed with celestial wisdom and foresight',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.LEGENDARY,
    epCost: 2400,
    requirements: {
      minLevel: 45,
      minStats: { atk: 55, def: 40, spd: 45 },
      minBattlesWon: 500,
      epThreshold: 4000,
      rareItems: 3
    },
    bonuses: { atk: 0.4, spd: 0.25, def: 0.1, luck: 0.35, celestialVision: 0.6 },
    abilities: ['peck', 'hoot', 'night_hunt', 'swoop', 'precision_strike', 'wise_judgment', 'foresight', 'stellar_gaze']
  },

  ancientForm: {
    number: 11,
    name: 'Primordial Owl',
    description: 'Ancient owl from the first dawn, keeper of eternal knowledge',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.ANCIENT,
    epCost: 3600,
    requirements: {
      minLevel: 65,
      minStats: { atk: 80, def: 60, spd: 70 },
      minBattlesWon: 1500,
      epThreshold: 7500,
      rareItems: 5,
      timePlayed: 500
    },
    bonuses: { atk: 0.6, spd: 0.4, def: 0.18, luck: 0.45, ancientWisdom: 0.9, primalVision: 0.7 },
    abilities: ['peck', 'hoot', 'night_hunt', 'swoop', 'precision_strike', 'wise_judgment', 'ancient_knowledge', 'genesis_sight']
  },

  supernaturalForm: {
    number: 12,
    name: 'Void Seer',
    description: 'Incomprehensible entity seeing all realities at once',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.SUPERNATURAL,
    epCost: 6000,
    requirements: {
      minLevel: 100,
      minStats: { atk: 155, def: 120, spd: 135 },
      minBattlesWon: 3000,
      epThreshold: 15000,
      rareItems: 10,
      timePlayed: 1000,
      specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame']
    },
    bonuses: { atk: 1.0, spd: 0.6, def: 0.32, luck: 0.7, supernaturalSight: 2.0, omniscience: 1.5, infiniteVision: 1.0 },
    abilities: ['peck', 'hoot', 'void_gaze', 'reality_screech', 'void_phase', 'omniscient_strike', 'infinity_sight', 'chaos_vision']
  },

  statUpgrades: {
    precision: {
      name: 'Precision',
      description: 'Increases accuracy and critical strikes',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        atk: points * 0.1,
        accuracy: points * 0.005
      })
    },
    swiftness: {
      name: 'Swiftness',
      description: 'Improves speed and flight maneuverability',
      costPerPoint: 2,
      maxPoints: 45,
      effect: (points) => ({
        spd: points * 0.12,
        maneuver: points * 0.004
      })
    },
    wisdom: {
      name: 'Wisdom',
      description: 'Enhances special vision and perception abilities',
      costPerPoint: 3,
      maxPoints: 40,
      effect: (points) => ({
        luck: points * 0.006,
        perception: points * 0.005
      })
    }
  }
};
