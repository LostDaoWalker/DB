import { EVOLUTION_PHASES as P, EVOLUTION_RARITY as R, createEvolution } from './evolutions.js';

export const foxSpecies = {
  key: 'fox',
  name: 'Fox',
  baseStats: { hp: 24, atk: 8, def: 4, spd: 8 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 1 },

  evolutions: {
    1: { ...createEvolution(1, 'Fox', P.BABY), bonuses: {}, abilities: ['bite', 'pounce', 'trick'] },
    2: { ...createEvolution(2, 'Fox', P.YOUNG), bonuses: { atk: 0.1, spd: 0.08 }, abilities: ['bite', 'pounce', 'trick', 'feint'] },
    3: { ...createEvolution(3, 'Fox', P.ADULT), bonuses: { atk: 0.16, spd: 0.12, def: 0.04 }, abilities: ['bite', 'pounce', 'trick', 'feint', 'ambush'] },
    4: { ...createEvolution(4, 'Fox', P.ELDER), bonuses: { atk: 0.24, spd: 0.16, def: 0.07, luck: 0.1 }, abilities: ['bite', 'pounce', 'trick', 'feint', 'ambush', 'cunning'] },

    5: { ...createEvolution(5, 'Flame Fox', P.BABY, R.UNCOMMON), bonuses: { atk: 0.12, spd: 0.1 }, abilities: ['bite', 'pounce', 'trick', 'flame_bite'] },
    6: { ...createEvolution(6, 'Flame Fox', P.YOUNG, R.UNCOMMON), bonuses: { atk: 0.20, spd: 0.14, def: 0.03 }, abilities: ['bite', 'pounce', 'trick', 'flame_bite', 'inferno_dash', 'fire_aura'] },
    7: { ...createEvolution(7, 'Flame Fox', P.ADULT, R.UNCOMMON), bonuses: { atk: 0.28, spd: 0.18, def: 0.06 }, abilities: ['bite', 'pounce', 'trick', 'flame_bite', 'inferno_dash', 'fire_aura', 'magma_strike'] },
    8: { ...createEvolution(8, 'Flame Fox', P.ELDER, R.UNCOMMON), bonuses: { atk: 0.36, spd: 0.24, def: 0.09 }, abilities: ['bite', 'pounce', 'trick', 'flame_bite', 'inferno_dash', 'fire_aura', 'magma_strike', 'eternal_flame'] },

    9: { ...createEvolution(9, 'Silver Fox', P.BABY, R.UNCOMMON), bonuses: { spd: 0.12, atk: 0.08 }, abilities: ['bite', 'pounce', 'trick', 'swift_strike'] },
    10: { ...createEvolution(10, 'Silver Fox', P.YOUNG, R.UNCOMMON), bonuses: { spd: 0.18, atk: 0.14, def: 0.04 }, abilities: ['bite', 'pounce', 'trick', 'swift_strike', 'silver_dash', 'sheen'] },
    11: { ...createEvolution(11, 'Silver Fox', P.ADULT, R.UNCOMMON), bonuses: { spd: 0.24, atk: 0.20, def: 0.08 }, abilities: ['bite', 'pounce', 'trick', 'swift_strike', 'silver_dash', 'sheen', 'silver_strike'] },
    12: { ...createEvolution(12, 'Silver Fox', P.ELDER, R.UNCOMMON), bonuses: { spd: 0.32, atk: 0.28, def: 0.12 }, abilities: ['bite', 'pounce', 'trick', 'swift_strike', 'silver_dash', 'sheen', 'silver_strike', 'moonlight'] },

    13: { ...createEvolution(13, 'Shadow Fox', P.BABY, R.RARE), bonuses: { atk: 0.14, def: 0.06, spd: 0.10 }, abilities: ['bite', 'pounce', 'trick', 'shadow_bite'] },
    14: { ...createEvolution(14, 'Shadow Fox', P.YOUNG, R.RARE), bonuses: { atk: 0.22, def: 0.10, spd: 0.16 }, abilities: ['bite', 'pounce', 'trick', 'shadow_bite', 'shadow_dash', 'cloak'] },
    15: { ...createEvolution(15, 'Shadow Fox', P.ADULT, R.RARE), bonuses: { atk: 0.30, def: 0.14, spd: 0.22 }, abilities: ['bite', 'pounce', 'trick', 'shadow_bite', 'shadow_dash', 'cloak', 'darkness'] },
    16: { ...createEvolution(16, 'Shadow Fox', P.ELDER, R.RARE), bonuses: { atk: 0.40, def: 0.18, spd: 0.30 }, abilities: ['bite', 'pounce', 'trick', 'shadow_bite', 'shadow_dash', 'cloak', 'darkness', 'void_form'] },

    17: { ...createEvolution(17, 'Storm Fox', P.BABY, R.RARE), bonuses: { spd: 0.14, atk: 0.10, def: 0.05 }, abilities: ['bite', 'pounce', 'trick', 'lightning_bite'] },
    18: { ...createEvolution(18, 'Storm Fox', P.YOUNG, R.RARE), bonuses: { spd: 0.22, atk: 0.16, def: 0.08 }, abilities: ['bite', 'pounce', 'trick', 'lightning_bite', 'storm_dash', 'electric'] },
    19: { ...createEvolution(19, 'Storm Fox', P.ADULT, R.RARE), bonuses: { spd: 0.30, atk: 0.24, def: 0.12 }, abilities: ['bite', 'pounce', 'trick', 'lightning_bite', 'storm_dash', 'electric', 'thunder'] },
    20: { ...createEvolution(20, 'Storm Fox', P.ELDER, R.RARE), bonuses: { spd: 0.40, atk: 0.32, def: 0.16 }, abilities: ['bite', 'pounce', 'trick', 'lightning_bite', 'storm_dash', 'electric', 'thunder', 'tempest'] },

    21: { ...createEvolution(21, 'Crystal Fox', P.BABY, R.RARE), bonuses: { def: 0.08, atk: 0.10, spd: 0.08 }, abilities: ['bite', 'pounce', 'trick', 'crystal_bite'] },
    22: { ...createEvolution(22, 'Crystal Fox', P.YOUNG, R.RARE), bonuses: { def: 0.12, atk: 0.16, spd: 0.12 }, abilities: ['bite', 'pounce', 'trick', 'crystal_bite', 'reflect', 'gem'] },
    23: { ...createEvolution(23, 'Crystal Fox', P.ADULT, R.RARE), bonuses: { def: 0.16, atk: 0.22, spd: 0.16 }, abilities: ['bite', 'pounce', 'trick', 'crystal_bite', 'reflect', 'gem', 'prism'] },
    24: { ...createEvolution(24, 'Crystal Fox', P.ELDER, R.RARE), bonuses: { def: 0.20, atk: 0.30, spd: 0.20 }, abilities: ['bite', 'pounce', 'trick', 'crystal_bite', 'reflect', 'gem', 'prism', 'diamond'] },

    25: { ...createEvolution(25, 'Frost Fox', P.BABY, R.EPIC), bonuses: { spd: 0.12, def: 0.07, atk: 0.09 }, abilities: ['bite', 'pounce', 'trick', 'frost_bite'] },
    26: { ...createEvolution(26, 'Frost Fox', P.YOUNG, R.EPIC), bonuses: { spd: 0.20, def: 0.11, atk: 0.15 }, abilities: ['bite', 'pounce', 'trick', 'frost_bite', 'chill_dash', 'freeze'] },
    27: { ...createEvolution(27, 'Frost Fox', P.ADULT, R.EPIC), bonuses: { spd: 0.28, def: 0.15, atk: 0.23 }, abilities: ['bite', 'pounce', 'trick', 'frost_bite', 'chill_dash', 'freeze', 'ice_strike'] },
    28: { ...createEvolution(28, 'Frost Fox', P.ELDER, R.EPIC), bonuses: { spd: 0.38, def: 0.19, atk: 0.31 }, abilities: ['bite', 'pounce', 'trick', 'frost_bite', 'chill_dash', 'freeze', 'ice_strike', 'blizzard'] },

    29: { ...createEvolution(29, 'Primal Fox', P.BABY, R.EPIC), bonuses: { atk: 0.13, spd: 0.11, def: 0.06 }, abilities: ['bite', 'pounce', 'trick', 'primal_bite'] },
    30: { ...createEvolution(30, 'Primal Fox', P.YOUNG, R.EPIC), bonuses: { atk: 0.21, spd: 0.19, def: 0.10 }, abilities: ['bite', 'pounce', 'trick', 'primal_bite', 'feral_dash', 'savage'] },
    31: { ...createEvolution(31, 'Primal Fox', P.ADULT, R.EPIC), bonuses: { atk: 0.29, spd: 0.27, def: 0.14 }, abilities: ['bite', 'pounce', 'trick', 'primal_bite', 'feral_dash', 'savage', 'wild_strike'] },
    32: { ...createEvolution(32, 'Primal Fox', P.ELDER, R.EPIC), bonuses: { atk: 0.39, spd: 0.37, def: 0.18 }, abilities: ['bite', 'pounce', 'trick', 'primal_bite', 'feral_dash', 'savage', 'wild_strike', 'ancient'] },

    33: { ...createEvolution(33, 'Void Fox', P.BABY, R.SUPERNATURAL), bonuses: { atk: 0.35, spd: 0.35, def: 0.15 }, abilities: ['bite', 'void'] },
    34: { ...createEvolution(34, 'Void Fox', P.YOUNG, R.SUPERNATURAL), bonuses: { atk: 0.48, spd: 0.45, def: 0.20 }, abilities: ['bite', 'void', 'voidpw'] },
    35: { ...createEvolution(35, 'Void Fox', P.ADULT, R.SUPERNATURAL), bonuses: { atk: 0.60, spd: 0.55, def: 0.26 }, abilities: ['bite', 'void', 'voidpw', 'voidm'] },
    36: { ...createEvolution(36, 'Void Fox', P.ELDER, R.SUPERNATURAL), bonuses: { atk: 0.75, spd: 0.70, def: 0.35 }, abilities: ['bite', 'void', 'voidpw', 'voidm', 'reality'] }
  },

  legendaryForm: { name: 'Celestial Fox', rarity: R.LEGENDARY, bonuses: { atk: 0.45, spd: 0.35, def: 0.12, luck: 0.35 }, abilities: ['bite', 'pounce', 'stellar'] },
  ancientForm: { name: 'Primordial Fox', rarity: R.ANCIENT, bonuses: { atk: 0.65, spd: 0.50, def: 0.20, luck: 0.45 }, abilities: ['bite', 'pounce', 'primal'] },
  supernaturalForm: { name: 'Entity Fox', rarity: R.SUPERNATURAL, bonuses: { atk: 1.15, spd: 1.0, def: 0.40, luck: 0.70 }, abilities: ['void', 'reality', 'chaos'] },

  statUpgrades: {
    cunning: { name: 'Cunning', costPerPoint: 2, maxPoints: 50, effect: (p) => ({ atk: p * 0.1, crit: p * 0.004 }) },
    agility: { name: 'Agility', costPerPoint: 2, maxPoints: 45, effect: (p) => ({ spd: p * 0.12, evasion: p * 0.003 }) },
    instinct: { name: 'Instinct', costPerPoint: 3, maxPoints: 40, effect: (p) => ({ atk: p * 0.08, luck: p * 0.006 }) }
  }
};
