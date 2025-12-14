import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

// TEMPLATE: Copy this and replace SPECIES_NAME, abilities, stat bonuses
// Structure: 9 evolutions × 4 phases = 36 stages (1-36)
// Evolution 1: stages 1-4 (baby, young, adult, elder)
// Evolution 2: stages 5-8 (baby, young, adult, elder)
// ... continue to Evolution 9: stages 33-36

export const speciesNameSpecies = {
  key: 'species_name',
  name: 'Species Name',
  baseStats: { hp: 20, atk: 8, def: 5, spd: 8 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 1 },
  type: 'standard',
  diet: 'omnivore',

  evolutions: {
    // Evolution 1: Basic Form
    1: { ...createEvolutionStage(1, 'Species Name', 'Hatchling/infant/pup learning basics', EVOLUTION_PHASES.BABY), bonuses: {}, abilities: ['ability1', 'ability2'] },
    2: { ...createEvolutionStage(2, 'Species Name', 'Growing stronger/faster/wiser', EVOLUTION_PHASES.YOUNG), bonuses: { atk: 0.1, spd: 0.08 }, abilities: ['ability1', 'ability2', 'ability3'] },
    3: { ...createEvolutionStage(3, 'Species Name', 'Adult prime/skilled/experienced', EVOLUTION_PHASES.ADULT), bonuses: { atk: 0.16, spd: 0.12, def: 0.04 }, abilities: ['ability1', 'ability2', 'ability3', 'ability4'] },
    4: { ...createEvolutionStage(4, 'Species Name', 'Elder ancient/wise/master', EVOLUTION_PHASES.ELDER), bonuses: { atk: 0.24, spd: 0.16, def: 0.07, luck: 0.1 }, abilities: ['ability1', 'ability2', 'ability3', 'ability4', 'ability5'] },

    // Evolution 2: Variant 1 (uncommon)
    5: { ...createEvolutionStage(5, 'Variant 1 Name', 'Young variant beginning transformation', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.12, def: 0.05 }, abilities: ['ability1', 'ability2', 'variant_ability1'] },
    6: { ...createEvolutionStage(6, 'Variant 1 Name', 'Growing into new power', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.20, def: 0.08, spd: 0.06 }, abilities: ['ability1', 'ability2', 'variant_ability1', 'variant_ability2'] },
    7: { ...createEvolutionStage(7, 'Variant 1 Name', 'Matured variant form', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.28, def: 0.12, spd: 0.10, luck: 0.06 }, abilities: ['ability1', 'ability2', 'variant_ability1', 'variant_ability2', 'variant_ability3'] },
    8: { ...createEvolutionStage(8, 'Variant 1 Name', 'Ancient variant mastery', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.38, def: 0.16, spd: 0.14, luck: 0.12, variant1: 0.3 }, abilities: ['ability1', 'ability2', 'variant_ability1', 'variant_ability2', 'variant_ability3', 'variant_ability4'] },

    // Evolution 3: Variant 2 (uncommon)
    9: { ...createEvolutionStage(9, 'Variant 2 Name', 'Hatchling of second path', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON), bonuses: { def: 0.06, spd: 0.10 }, abilities: ['ability1', 'ability2', 'variant_ability_a'] },
    10: { ...createEvolutionStage(10, 'Variant 2 Name', 'Growing along different path', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON), bonuses: { def: 0.10, spd: 0.14, atk: 0.08 }, abilities: ['ability1', 'ability2', 'variant_ability_a', 'variant_ability_b'] },
    11: { ...createEvolutionStage(11, 'Variant 2 Name', 'Mature second evolution', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON), bonuses: { def: 0.14, spd: 0.18, atk: 0.12, luck: 0.06 }, abilities: ['ability1', 'ability2', 'variant_ability_a', 'variant_ability_b', 'variant_ability_c'] },
    12: { ...createEvolutionStage(12, 'Variant 2 Name', 'Elder of second path', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON), bonuses: { def: 0.18, spd: 0.24, atk: 0.16, luck: 0.12, variant2: 0.3 }, abilities: ['ability1', 'ability2', 'variant_ability_a', 'variant_ability_b', 'variant_ability_c', 'variant_ability_d'] },

    // Evolution 4: Variant 3 (rare)
    13: { ...createEvolutionStage(13, 'Variant 3 Name', 'Rare form awakening', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.RARE), bonuses: { atk: 0.14, def: 0.08, spd: 0.10 }, abilities: ['ability1', 'ability2', 'rare_ability1'] },
    14: { ...createEvolutionStage(14, 'Variant 3 Name', 'Rare power rising', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.RARE), bonuses: { atk: 0.22, def: 0.12, spd: 0.14 }, abilities: ['ability1', 'ability2', 'rare_ability1', 'rare_ability2'] },
    15: { ...createEvolutionStage(15, 'Variant 3 Name', 'Rare maturity', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.RARE), bonuses: { atk: 0.30, def: 0.16, spd: 0.18, rarity: 0.08 }, abilities: ['ability1', 'ability2', 'rare_ability1', 'rare_ability2', 'rare_ability3'] },
    16: { ...createEvolutionStage(16, 'Variant 3 Name', 'Rare ancient form', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.RARE), bonuses: { atk: 0.40, def: 0.20, spd: 0.24, rarity: 0.6 }, abilities: ['ability1', 'ability2', 'rare_ability1', 'rare_ability2', 'rare_ability3', 'rare_ability4'] },

    // Evolution 5: Variant 4 (rare)
    17: { ...createEvolutionStage(17, 'Variant 4 Name', 'Fourth path emerging', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.RARE), bonuses: { spd: 0.12, atk: 0.10, def: 0.06 }, abilities: ['ability1', 'ability2', 'special_ability1'] },
    18: { ...createEvolutionStage(18, 'Variant 4 Name', 'Strengthening fourth path', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.RARE), bonuses: { spd: 0.16, atk: 0.16, def: 0.10 }, abilities: ['ability1', 'ability2', 'special_ability1', 'special_ability2'] },
    19: { ...createEvolutionStage(19, 'Variant 4 Name', 'Matured special form', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.RARE), bonuses: { spd: 0.20, atk: 0.22, def: 0.14, special: 0.08 }, abilities: ['ability1', 'ability2', 'special_ability1', 'special_ability2', 'special_ability3'] },
    20: { ...createEvolutionStage(20, 'Variant 4 Name', 'Ancient special mastery', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.RARE), bonuses: { spd: 0.26, atk: 0.28, def: 0.18, special: 0.6 }, abilities: ['ability1', 'ability2', 'special_ability1', 'special_ability2', 'special_ability3', 'special_ability4'] },

    // Evolution 6: Variant 5 (rare)
    21: { ...createEvolutionStage(21, 'Variant 5 Name', 'Fifth form beginning', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.RARE), bonuses: { def: 0.10, atk: 0.08, spd: 0.10 }, abilities: ['ability1', 'ability2', 'fifth_ability1'] },
    22: { ...createEvolutionStage(22, 'Variant 5 Name', 'Fifth form strengthening', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.RARE), bonuses: { def: 0.14, atk: 0.14, spd: 0.14 }, abilities: ['ability1', 'ability2', 'fifth_ability1', 'fifth_ability2'] },
    23: { ...createEvolutionStage(23, 'Variant 5 Name', 'Matured fifth form', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.RARE), bonuses: { def: 0.18, atk: 0.20, spd: 0.18, form5: 0.08 }, abilities: ['ability1', 'ability2', 'fifth_ability1', 'fifth_ability2', 'fifth_ability3'] },
    24: { ...createEvolutionStage(24, 'Variant 5 Name', 'Ancient fifth mastery', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.RARE), bonuses: { def: 0.24, atk: 0.26, spd: 0.24, form5: 0.6 }, abilities: ['ability1', 'ability2', 'fifth_ability1', 'fifth_ability2', 'fifth_ability3', 'fifth_ability4'] },

    // Evolution 7: Variant 6 (epic)
    25: { ...createEvolutionStage(25, 'Variant 6 Name', 'Epic form awakening', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.EPIC), bonuses: { atk: 0.16, spd: 0.14, def: 0.08 }, abilities: ['ability1', 'ability2', 'epic_ability1'] },
    26: { ...createEvolutionStage(26, 'Variant 6 Name', 'Epic power rising', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.EPIC), bonuses: { atk: 0.24, spd: 0.20, def: 0.12 }, abilities: ['ability1', 'ability2', 'epic_ability1', 'epic_ability2'] },
    27: { ...createEvolutionStage(27, 'Variant 6 Name', 'Matured epic form', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.EPIC), bonuses: { atk: 0.32, spd: 0.26, def: 0.16, epic: 0.10 }, abilities: ['ability1', 'ability2', 'epic_ability1', 'epic_ability2', 'epic_ability3'] },
    28: { ...createEvolutionStage(28, 'Variant 6 Name', 'Ancient epic mastery', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.EPIC), bonuses: { atk: 0.42, spd: 0.34, def: 0.22, epic: 0.7 }, abilities: ['ability1', 'ability2', 'epic_ability1', 'epic_ability2', 'epic_ability3', 'epic_ability4'] },

    // Evolution 8: Variant 7 (epic)
    29: { ...createEvolutionStage(29, 'Variant 7 Name', 'Seventh evolution emerging', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.EPIC), bonuses: { spd: 0.16, def: 0.10, atk: 0.12 }, abilities: ['ability1', 'ability2', 'seventh_ability1'] },
    30: { ...createEvolutionStage(30, 'Variant 7 Name', 'Seventh form strengthening', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.EPIC), bonuses: { spd: 0.22, def: 0.14, atk: 0.18 }, abilities: ['ability1', 'ability2', 'seventh_ability1', 'seventh_ability2'] },
    31: { ...createEvolutionStage(31, 'Variant 7 Name', 'Matured seventh form', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.EPIC), bonuses: { spd: 0.28, def: 0.18, atk: 0.26, form7: 0.10 }, abilities: ['ability1', 'ability2', 'seventh_ability1', 'seventh_ability2', 'seventh_ability3'] },
    32: { ...createEvolutionStage(32, 'Variant 7 Name', 'Ancient seventh mastery', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.EPIC), bonuses: { spd: 0.36, def: 0.24, atk: 0.34, form7: 0.7 }, abilities: ['ability1', 'ability2', 'seventh_ability1', 'seventh_ability2', 'seventh_ability3', 'seventh_ability4'] },

    // Evolution 9: Void Form (SUPERNATURAL - extreme requirements)
    33: { ...createEvolutionStage(33, 'Void Form', 'Consciousness scattered across realities', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.SUPERNATURAL), bonuses: { atk: 0.35, spd: 0.35, def: 0.15 }, abilities: ['ability1', 'void_ability1'] },
    34: { ...createEvolutionStage(34, 'Void Form', 'Master of infinite dimensions', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.SUPERNATURAL), bonuses: { atk: 0.48, spd: 0.45, def: 0.20 }, abilities: ['ability1', 'void_ability1', 'void_ability2'] },
    35: { ...createEvolutionStage(35, 'Void Form', 'Entity beyond comprehension', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.SUPERNATURAL), bonuses: { atk: 0.60, spd: 0.55, def: 0.26, voidMastery: 0.5 }, abilities: ['ability1', 'void_ability1', 'void_ability2', 'void_ability3'] },
    36: { ...createEvolutionStage(36, 'Void Form', 'Primordial being transcending all reality', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL), bonuses: { atk: 0.75, spd: 0.70, def: 0.35, voidMastery: 1.2, timeless: 1.0 }, abilities: ['ability1', 'void_ability1', 'void_ability2', 'void_ability3', 'void_ability4', 'reality_warper'] }
  },

  legendaryForm: {
    name: 'Celestial [Species]',
    description: 'Divine form blessed by stars',
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
    bonuses: { atk: 0.45, spd: 0.35, def: 0.12, luck: 0.35, celestialBlessing: 0.6 },
    abilities: ['ability1', 'stellar_bound', 'lucky_strike']
  },

  ancientForm: {
    name: 'Primordial [Species]',
    description: 'Ancient form from creation\'s age, keeper of primal power',
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
    bonuses: { atk: 0.65, spd: 0.50, def: 0.20, luck: 0.45, primalForce: 0.9, ancestralMemory: 0.8 },
    abilities: ['ability1', 'primal_strike', 'ancient_wisdom']
  },

  supernaturalForm: {
    name: 'Entity of Eternity',
    description: 'Incomprehensible being existing outside reality itself',
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
    bonuses: { atk: 1.15, spd: 1.0, def: 0.40, luck: 0.70, supernaturalForce: 2.2, realityBend: 1.8, infinitePower: 1.0 },
    abilities: ['void_phase', 'reality_warp', 'chaos_strike', 'infinity_bound']
  },

  statUpgrades: {
    primary: {
      name: 'Primary Stat',
      description: 'Boosts main attribute',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        atk: points * 0.1
      })
    },
    secondary: {
      name: 'Secondary Stat',
      description: 'Improves supporting attribute',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        def: points * 0.08
      })
    },
    tertiary: {
      name: 'Tertiary Stat',
      description: 'Enhances special abilities',
      costPerPoint: 3,
      maxPoints: 40,
      effect: (points) => ({
        luck: points * 0.005
      })
    }
  }
};
