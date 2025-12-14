import { EVOLUTION_PHASES as P, EVOLUTION_RARITY as R, createEvolution } from './evolutions.js';

export const leviathanSpecies = {
  key: 'leviathan',
  name: 'Leviathan',
  baseStats: { hp: 250, atk: 50, def: 45, spd: 15 },
  growthStats: { hp: 45, atk: 14, def: 16, spd: 3 },

  evolutions: {
    1: { ...createEvolution(1, 'Leviathan', P.BABY), bonuses: {}, abilities: ['attack', 'defend'] },
    2: { ...createEvolution(2, 'Leviathan', P.YOUNG), bonuses: { atk: 0.1, spd: 0.08 }, abilities: ['attack', 'defend', 'special'] },
    3: { ...createEvolution(3, 'Leviathan', P.ADULT), bonuses: { atk: 0.16, spd: 0.12, def: 0.04 }, abilities: ['attack', 'defend', 'special', 'power'] },
    4: { ...createEvolution(4, 'Leviathan', P.ELDER), bonuses: { atk: 0.24, spd: 0.16, def: 0.07, luck: 0.1 }, abilities: ['attack', 'defend', 'special', 'power', 'master'] },

    5: { ...createEvolution(5, 'Leviathan', P.BABY, R.UNCOMMON), bonuses: { atk: 0.12, def: 0.05 }, abilities: ['attack', 'defend', 'v1'] },
    6: { ...createEvolution(6, 'Leviathan', P.YOUNG, R.UNCOMMON), bonuses: { atk: 0.20, def: 0.08, spd: 0.06 }, abilities: ['attack', 'defend', 'v1', 'v2'] },
    7: { ...createEvolution(7, 'Leviathan', P.ADULT, R.UNCOMMON), bonuses: { atk: 0.28, def: 0.12, spd: 0.10, luck: 0.06 }, abilities: ['attack', 'defend', 'v1', 'v2', 'v3'] },
    8: { ...createEvolution(8, 'Leviathan', P.ELDER, R.UNCOMMON), bonuses: { atk: 0.38, def: 0.16, spd: 0.14, luck: 0.12 }, abilities: ['attack', 'defend', 'v1', 'v2', 'v3', 'v4'] },

    9: { ...createEvolution(9, 'Leviathan', P.BABY, R.UNCOMMON), bonuses: { def: 0.06, spd: 0.10 }, abilities: ['attack', 'defend', 'va'] },
    10: { ...createEvolution(10, 'Leviathan', P.YOUNG, R.UNCOMMON), bonuses: { def: 0.10, spd: 0.14, atk: 0.08 }, abilities: ['attack', 'defend', 'va', 'vb'] },
    11: { ...createEvolution(11, 'Leviathan', P.ADULT, R.UNCOMMON), bonuses: { def: 0.14, spd: 0.18, atk: 0.12, luck: 0.06 }, abilities: ['attack', 'defend', 'va', 'vb', 'vc'] },
    12: { ...createEvolution(12, 'Leviathan', P.ELDER, R.UNCOMMON), bonuses: { def: 0.18, spd: 0.24, atk: 0.16, luck: 0.12 }, abilities: ['attack', 'defend', 'va', 'vb', 'vc', 'vd'] },

    13: { ...createEvolution(13, 'Leviathan', P.BABY, R.RARE), bonuses: { atk: 0.14, def: 0.08, spd: 0.10 }, abilities: ['attack', 'defend', 'r1'] },
    14: { ...createEvolution(14, 'Leviathan', P.YOUNG, R.RARE), bonuses: { atk: 0.22, def: 0.12, spd: 0.14 }, abilities: ['attack', 'defend', 'r1', 'r2'] },
    15: { ...createEvolution(15, 'Leviathan', P.ADULT, R.RARE), bonuses: { atk: 0.30, def: 0.16, spd: 0.18 }, abilities: ['attack', 'defend', 'r1', 'r2', 'r3'] },
    16: { ...createEvolution(16, 'Leviathan', P.ELDER, R.RARE), bonuses: { atk: 0.40, def: 0.20, spd: 0.24 }, abilities: ['attack', 'defend', 'r1', 'r2', 'r3', 'r4'] },

    17: { ...createEvolution(17, 'Leviathan', P.BABY, R.RARE), bonuses: { spd: 0.12, atk: 0.10, def: 0.06 }, abilities: ['attack', 'defend', 'sp1'] },
    18: { ...createEvolution(18, 'Leviathan', P.YOUNG, R.RARE), bonuses: { spd: 0.16, atk: 0.16, def: 0.10 }, abilities: ['attack', 'defend', 'sp1', 'sp2'] },
    19: { ...createEvolution(19, 'Leviathan', P.ADULT, R.RARE), bonuses: { spd: 0.20, atk: 0.22, def: 0.14 }, abilities: ['attack', 'defend', 'sp1', 'sp2', 'sp3'] },
    20: { ...createEvolution(20, 'Leviathan', P.ELDER, R.RARE), bonuses: { spd: 0.26, atk: 0.28, def: 0.18 }, abilities: ['attack', 'defend', 'sp1', 'sp2', 'sp3', 'sp4'] },

    21: { ...createEvolution(21, 'Leviathan', P.BABY, R.RARE), bonuses: { def: 0.10, atk: 0.08, spd: 0.10 }, abilities: ['attack', 'defend', 'e1'] },
    22: { ...createEvolution(22, 'Leviathan', P.YOUNG, R.RARE), bonuses: { def: 0.14, atk: 0.14, spd: 0.14 }, abilities: ['attack', 'defend', 'e1', 'e2'] },
    23: { ...createEvolution(23, 'Leviathan', P.ADULT, R.RARE), bonuses: { def: 0.18, atk: 0.20, spd: 0.18 }, abilities: ['attack', 'defend', 'e1', 'e2', 'e3'] },
    24: { ...createEvolution(24, 'Leviathan', P.ELDER, R.RARE), bonuses: { def: 0.24, atk: 0.26, spd: 0.24 }, abilities: ['attack', 'defend', 'e1', 'e2', 'e3', 'e4'] },

    25: { ...createEvolution(25, 'Leviathan', P.BABY, R.EPIC), bonuses: { atk: 0.16, spd: 0.14, def: 0.08 }, abilities: ['attack', 'defend', 'ep1'] },
    26: { ...createEvolution(26, 'Leviathan', P.YOUNG, R.EPIC), bonuses: { atk: 0.24, spd: 0.20, def: 0.12 }, abilities: ['attack', 'defend', 'ep1', 'ep2'] },
    27: { ...createEvolution(27, 'Leviathan', P.ADULT, R.EPIC), bonuses: { atk: 0.32, spd: 0.26, def: 0.16 }, abilities: ['attack', 'defend', 'ep1', 'ep2', 'ep3'] },
    28: { ...createEvolution(28, 'Leviathan', P.ELDER, R.EPIC), bonuses: { atk: 0.42, spd: 0.34, def: 0.22 }, abilities: ['attack', 'defend', 'ep1', 'ep2', 'ep3', 'ep4'] },

    29: { ...createEvolution(29, 'Leviathan', P.BABY, R.EPIC), bonuses: { spd: 0.16, def: 0.10, atk: 0.12 }, abilities: ['attack', 'defend', 'f7'] },
    30: { ...createEvolution(30, 'Leviathan', P.YOUNG, R.EPIC), bonuses: { spd: 0.22, def: 0.14, atk: 0.18 }, abilities: ['attack', 'defend', 'f7', 'f7b'] },
    31: { ...createEvolution(31, 'Leviathan', P.ADULT, R.EPIC), bonuses: { spd: 0.28, def: 0.18, atk: 0.26 }, abilities: ['attack', 'defend', 'f7', 'f7b', 'f7c'] },
    32: { ...createEvolution(32, 'Leviathan', P.ELDER, R.EPIC), bonuses: { spd: 0.36, def: 0.24, atk: 0.34 }, abilities: ['attack', 'defend', 'f7', 'f7b', 'f7c', 'f7d'] },

    33: { ...createEvolution(33, 'Void Leviathan', P.BABY, R.SUPERNATURAL), bonuses: { atk: 0.35, spd: 0.35, def: 0.15 }, abilities: ['attack', 'void'] },
    34: { ...createEvolution(34, 'Void Leviathan', P.YOUNG, R.SUPERNATURAL), bonuses: { atk: 0.48, spd: 0.45, def: 0.20 }, abilities: ['attack', 'void', 'voidpw'] },
    35: { ...createEvolution(35, 'Void Leviathan', P.ADULT, R.SUPERNATURAL), bonuses: { atk: 0.60, spd: 0.55, def: 0.26 }, abilities: ['attack', 'void', 'voidpw', 'voidm'] },
    36: { ...createEvolution(36, 'Void Leviathan', P.ELDER, R.SUPERNATURAL), bonuses: { atk: 0.75, spd: 0.70, def: 0.35 }, abilities: ['attack', 'void', 'voidpw', 'voidm', 'reality'] }
  },

  legendaryForm: { name: 'Celestial Leviathan', rarity: R.LEGENDARY, bonuses: { atk: 0.45, spd: 0.35, def: 0.12, luck: 0.35 }, abilities: ['attack', 'defend', 'stellar'] },
  ancientForm: { name: 'Primordial Leviathan', rarity: R.ANCIENT, bonuses: { atk: 0.65, spd: 0.50, def: 0.20, luck: 0.45 }, abilities: ['attack', 'defend', 'primal'] },
  supernaturalForm: { name: 'Entity Leviathan', rarity: R.SUPERNATURAL, bonuses: { atk: 1.15, spd: 1.0, def: 0.40, luck: 0.70 }, abilities: ['void', 'reality', 'chaos'] },

  statUpgrades: {
    primary: { name: 'Primary', costPerPoint: 2, maxPoints: 50, effect: (p) => ({ atk: p * 0.1 }) },
    secondary: { name: 'Secondary', costPerPoint: 2, maxPoints: 50, effect: (p) => ({ def: p * 0.08 }) },
    tertiary: { name: 'Tertiary', costPerPoint: 3, maxPoints: 40, effect: (p) => ({ luck: p * 0.005 }) }
  }
};
