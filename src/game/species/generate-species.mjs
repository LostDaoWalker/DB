import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SPECIES_DATA = {
  fox: { baseStats: { hp: 24, atk: 8, def: 4, spd: 8 }, growthStats: { hp: 5, atk: 2, def: 1, spd: 1 } },
  bear: { baseStats: { hp: 32, atk: 7, def: 7, spd: 4 }, growthStats: { hp: 7, atk: 2, def: 2, spd: 1 } },
  wolf: { baseStats: { hp: 28, atk: 9, def: 6, spd: 7 }, growthStats: { hp: 6, atk: 2, def: 2, spd: 1 } },
  owl: { baseStats: { hp: 26, atk: 8, def: 5, spd: 6 }, growthStats: { hp: 6, atk: 2, def: 1, spd: 1 } },
  snake: { baseStats: { hp: 20, atk: 10, def: 5, spd: 9 }, growthStats: { hp: 4, atk: 3, def: 1, spd: 2 } },
  beetle: { baseStats: { hp: 25, atk: 6, def: 9, spd: 8 }, growthStats: { hp: 6, atk: 1, def: 3, spd: 1 } },
  cat: { baseStats: { hp: 18, atk: 8, def: 3, spd: 12 }, growthStats: { hp: 4, atk: 2, def: 1, spd: 3 } },
  ape: { baseStats: { hp: 35, atk: 12, def: 8, spd: 6 }, growthStats: { hp: 8, atk: 3, def: 2, spd: 1 } },
  butterfly: { baseStats: { hp: 8, atk: 2, def: 2, spd: 15 }, growthStats: { hp: 2, atk: 1, def: 1, spd: 4 } },
  ostrich: { baseStats: { hp: 28, atk: 9, def: 6, spd: 14 }, growthStats: { hp: 6, atk: 2, def: 2, spd: 3 } },
  dog: { baseStats: { hp: 25, atk: 8, def: 5, spd: 10 }, growthStats: { hp: 5, atk: 2, def: 2, spd: 2 } },
  moose: { baseStats: { hp: 45, atk: 7, def: 12, spd: 4 }, growthStats: { hp: 10, atk: 1, def: 4, spd: 1 } },
  goat: { baseStats: { hp: 22, atk: 6, def: 8, spd: 8 }, growthStats: { hp: 5, atk: 1, def: 3, spd: 2 } },
  hippo: { baseStats: { hp: 50, atk: 15, def: 15, spd: 3 }, growthStats: { hp: 12, atk: 4, def: 5, spd: 1 } },
  zebra: { baseStats: { hp: 30, atk: 6, def: 7, spd: 11 }, growthStats: { hp: 7, atk: 1, def: 2, spd: 3 } },
  giraffe: { baseStats: { hp: 40, atk: 8, def: 10, spd: 7 }, growthStats: { hp: 9, atk: 2, def: 3, spd: 2 } },
  kangaroo: { baseStats: { hp: 32, atk: 11, def: 6, spd: 13 }, growthStats: { hp: 7, atk: 3, def: 2, spd: 3 } },
  spider: { baseStats: { hp: 12, atk: 12, def: 4, spd: 11 }, growthStats: { hp: 3, atk: 4, def: 1, spd: 2 } },
  ant: { baseStats: { hp: 15, atk: 6, def: 6, spd: 8 }, growthStats: { hp: 4, atk: 2, def: 2, spd: 1 } },
  mantis: { baseStats: { hp: 16, atk: 14, def: 5, spd: 9 }, growthStats: { hp: 4, atk: 4, def: 1, spd: 2 } },
  ghost: { baseStats: { hp: 25, atk: 10, def: 8, spd: 10 }, growthStats: { hp: 6, atk: 3, def: 3, spd: 2 } },
  t_rex: { baseStats: { hp: 120, atk: 45, def: 25, spd: 15 }, growthStats: { hp: 25, atk: 12, def: 8, spd: 3 } },
  mammoth: { baseStats: { hp: 180, atk: 30, def: 40, spd: 8 }, growthStats: { hp: 35, atk: 6, def: 15, spd: 1 } },
  saber_tooth: { baseStats: { hp: 85, atk: 50, def: 20, spd: 25 }, growthStats: { hp: 18, atk: 15, def: 5, spd: 8 } },
  triceratops: { baseStats: { hp: 140, atk: 25, def: 50, spd: 10 }, growthStats: { hp: 28, atk: 4, def: 18, spd: 2 } },
  stegosaurus: { baseStats: { hp: 130, atk: 20, def: 45, spd: 12 }, growthStats: { hp: 26, atk: 3, def: 16, spd: 2 } },
  dragon: { baseStats: { hp: 200, atk: 65, def: 35, spd: 20 }, growthStats: { hp: 40, atk: 18, def: 12, spd: 5 } },
  phoenix: { baseStats: { hp: 90, atk: 55, def: 20, spd: 50 }, growthStats: { hp: 20, atk: 16, def: 4, spd: 15 } },
  unicorn: { baseStats: { hp: 100, atk: 40, def: 25, spd: 55 }, growthStats: { hp: 22, atk: 10, def: 6, spd: 18 } },
  griffin: { baseStats: { hp: 110, atk: 45, def: 30, spd: 35 }, growthStats: { hp: 24, atk: 12, def: 8, spd: 10 } },
  leviathan: { baseStats: { hp: 250, atk: 50, def: 45, spd: 15 }, growthStats: { hp: 45, atk: 14, def: 16, spd: 3 } }
};

function generateSpeciesFile(key, name, baseStats, growthStats) {
  return `import { EVOLUTION_PHASES as P, EVOLUTION_RARITY as R, createEvolution } from './evolutions.js';

export const ${key}Species = {
  key: '${key}',
  name: '${name}',
  baseStats: { hp: ${baseStats.hp}, atk: ${baseStats.atk}, def: ${baseStats.def}, spd: ${baseStats.spd} },
  growthStats: { hp: ${growthStats.hp}, atk: ${growthStats.atk}, def: ${growthStats.def}, spd: ${growthStats.spd} },

  evolutions: {
    1: { ...createEvolution(1, '${name}', P.BABY), bonuses: {}, abilities: ['attack', 'defend'] },
    2: { ...createEvolution(2, '${name}', P.YOUNG), bonuses: { atk: 0.1, spd: 0.08 }, abilities: ['attack', 'defend', 'special'] },
    3: { ...createEvolution(3, '${name}', P.ADULT), bonuses: { atk: 0.16, spd: 0.12, def: 0.04 }, abilities: ['attack', 'defend', 'special', 'power'] },
    4: { ...createEvolution(4, '${name}', P.ELDER), bonuses: { atk: 0.24, spd: 0.16, def: 0.07, luck: 0.1 }, abilities: ['attack', 'defend', 'special', 'power', 'master'] },

    5: { ...createEvolution(5, '${name}', P.BABY, R.UNCOMMON), bonuses: { atk: 0.12, def: 0.05 }, abilities: ['attack', 'defend', 'v1'] },
    6: { ...createEvolution(6, '${name}', P.YOUNG, R.UNCOMMON), bonuses: { atk: 0.20, def: 0.08, spd: 0.06 }, abilities: ['attack', 'defend', 'v1', 'v2'] },
    7: { ...createEvolution(7, '${name}', P.ADULT, R.UNCOMMON), bonuses: { atk: 0.28, def: 0.12, spd: 0.10, luck: 0.06 }, abilities: ['attack', 'defend', 'v1', 'v2', 'v3'] },
    8: { ...createEvolution(8, '${name}', P.ELDER, R.UNCOMMON), bonuses: { atk: 0.38, def: 0.16, spd: 0.14, luck: 0.12 }, abilities: ['attack', 'defend', 'v1', 'v2', 'v3', 'v4'] },

    9: { ...createEvolution(9, '${name}', P.BABY, R.UNCOMMON), bonuses: { def: 0.06, spd: 0.10 }, abilities: ['attack', 'defend', 'va'] },
    10: { ...createEvolution(10, '${name}', P.YOUNG, R.UNCOMMON), bonuses: { def: 0.10, spd: 0.14, atk: 0.08 }, abilities: ['attack', 'defend', 'va', 'vb'] },
    11: { ...createEvolution(11, '${name}', P.ADULT, R.UNCOMMON), bonuses: { def: 0.14, spd: 0.18, atk: 0.12, luck: 0.06 }, abilities: ['attack', 'defend', 'va', 'vb', 'vc'] },
    12: { ...createEvolution(12, '${name}', P.ELDER, R.UNCOMMON), bonuses: { def: 0.18, spd: 0.24, atk: 0.16, luck: 0.12 }, abilities: ['attack', 'defend', 'va', 'vb', 'vc', 'vd'] },

    13: { ...createEvolution(13, '${name}', P.BABY, R.RARE), bonuses: { atk: 0.14, def: 0.08, spd: 0.10 }, abilities: ['attack', 'defend', 'r1'] },
    14: { ...createEvolution(14, '${name}', P.YOUNG, R.RARE), bonuses: { atk: 0.22, def: 0.12, spd: 0.14 }, abilities: ['attack', 'defend', 'r1', 'r2'] },
    15: { ...createEvolution(15, '${name}', P.ADULT, R.RARE), bonuses: { atk: 0.30, def: 0.16, spd: 0.18 }, abilities: ['attack', 'defend', 'r1', 'r2', 'r3'] },
    16: { ...createEvolution(16, '${name}', P.ELDER, R.RARE), bonuses: { atk: 0.40, def: 0.20, spd: 0.24 }, abilities: ['attack', 'defend', 'r1', 'r2', 'r3', 'r4'] },

    17: { ...createEvolution(17, '${name}', P.BABY, R.RARE), bonuses: { spd: 0.12, atk: 0.10, def: 0.06 }, abilities: ['attack', 'defend', 'sp1'] },
    18: { ...createEvolution(18, '${name}', P.YOUNG, R.RARE), bonuses: { spd: 0.16, atk: 0.16, def: 0.10 }, abilities: ['attack', 'defend', 'sp1', 'sp2'] },
    19: { ...createEvolution(19, '${name}', P.ADULT, R.RARE), bonuses: { spd: 0.20, atk: 0.22, def: 0.14 }, abilities: ['attack', 'defend', 'sp1', 'sp2', 'sp3'] },
    20: { ...createEvolution(20, '${name}', P.ELDER, R.RARE), bonuses: { spd: 0.26, atk: 0.28, def: 0.18 }, abilities: ['attack', 'defend', 'sp1', 'sp2', 'sp3', 'sp4'] },

    21: { ...createEvolution(21, '${name}', P.BABY, R.RARE), bonuses: { def: 0.10, atk: 0.08, spd: 0.10 }, abilities: ['attack', 'defend', 'e1'] },
    22: { ...createEvolution(22, '${name}', P.YOUNG, R.RARE), bonuses: { def: 0.14, atk: 0.14, spd: 0.14 }, abilities: ['attack', 'defend', 'e1', 'e2'] },
    23: { ...createEvolution(23, '${name}', P.ADULT, R.RARE), bonuses: { def: 0.18, atk: 0.20, spd: 0.18 }, abilities: ['attack', 'defend', 'e1', 'e2', 'e3'] },
    24: { ...createEvolution(24, '${name}', P.ELDER, R.RARE), bonuses: { def: 0.24, atk: 0.26, spd: 0.24 }, abilities: ['attack', 'defend', 'e1', 'e2', 'e3', 'e4'] },

    25: { ...createEvolution(25, '${name}', P.BABY, R.EPIC), bonuses: { atk: 0.16, spd: 0.14, def: 0.08 }, abilities: ['attack', 'defend', 'ep1'] },
    26: { ...createEvolution(26, '${name}', P.YOUNG, R.EPIC), bonuses: { atk: 0.24, spd: 0.20, def: 0.12 }, abilities: ['attack', 'defend', 'ep1', 'ep2'] },
    27: { ...createEvolution(27, '${name}', P.ADULT, R.EPIC), bonuses: { atk: 0.32, spd: 0.26, def: 0.16 }, abilities: ['attack', 'defend', 'ep1', 'ep2', 'ep3'] },
    28: { ...createEvolution(28, '${name}', P.ELDER, R.EPIC), bonuses: { atk: 0.42, spd: 0.34, def: 0.22 }, abilities: ['attack', 'defend', 'ep1', 'ep2', 'ep3', 'ep4'] },

    29: { ...createEvolution(29, '${name}', P.BABY, R.EPIC), bonuses: { spd: 0.16, def: 0.10, atk: 0.12 }, abilities: ['attack', 'defend', 'f7'] },
    30: { ...createEvolution(30, '${name}', P.YOUNG, R.EPIC), bonuses: { spd: 0.22, def: 0.14, atk: 0.18 }, abilities: ['attack', 'defend', 'f7', 'f7b'] },
    31: { ...createEvolution(31, '${name}', P.ADULT, R.EPIC), bonuses: { spd: 0.28, def: 0.18, atk: 0.26 }, abilities: ['attack', 'defend', 'f7', 'f7b', 'f7c'] },
    32: { ...createEvolution(32, '${name}', P.ELDER, R.EPIC), bonuses: { spd: 0.36, def: 0.24, atk: 0.34 }, abilities: ['attack', 'defend', 'f7', 'f7b', 'f7c', 'f7d'] },

    33: { ...createEvolution(33, 'Void ${name}', P.BABY, R.SUPERNATURAL), bonuses: { atk: 0.35, spd: 0.35, def: 0.15 }, abilities: ['attack', 'void'] },
    34: { ...createEvolution(34, 'Void ${name}', P.YOUNG, R.SUPERNATURAL), bonuses: { atk: 0.48, spd: 0.45, def: 0.20 }, abilities: ['attack', 'void', 'voidpw'] },
    35: { ...createEvolution(35, 'Void ${name}', P.ADULT, R.SUPERNATURAL), bonuses: { atk: 0.60, spd: 0.55, def: 0.26 }, abilities: ['attack', 'void', 'voidpw', 'voidm'] },
    36: { ...createEvolution(36, 'Void ${name}', P.ELDER, R.SUPERNATURAL), bonuses: { atk: 0.75, spd: 0.70, def: 0.35 }, abilities: ['attack', 'void', 'voidpw', 'voidm', 'reality'] }
  },

  legendaryForm: { name: 'Celestial ${name}', rarity: R.LEGENDARY, bonuses: { atk: 0.45, spd: 0.35, def: 0.12, luck: 0.35 }, abilities: ['attack', 'defend', 'stellar'] },
  ancientForm: { name: 'Primordial ${name}', rarity: R.ANCIENT, bonuses: { atk: 0.65, spd: 0.50, def: 0.20, luck: 0.45 }, abilities: ['attack', 'defend', 'primal'] },
  supernaturalForm: { name: 'Entity ${name}', rarity: R.SUPERNATURAL, bonuses: { atk: 1.15, spd: 1.0, def: 0.40, luck: 0.70 }, abilities: ['void', 'reality', 'chaos'] },

  statUpgrades: {
    primary: { name: 'Primary', costPerPoint: 2, maxPoints: 50, effect: (p) => ({ atk: p * 0.1 }) },
    secondary: { name: 'Secondary', costPerPoint: 2, maxPoints: 50, effect: (p) => ({ def: p * 0.08 }) },
    tertiary: { name: 'Tertiary', costPerPoint: 3, maxPoints: 40, effect: (p) => ({ luck: p * 0.005 }) }
  }
};
`;
}

// Generate files for all species
let count = 0;
Object.entries(SPECIES_DATA).forEach(([key, data]) => {
  const name = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const filePath = path.join(__dirname, `${key}.js`);
  
  // Skip if already exists
  if (fs.existsSync(filePath)) {
    console.log(`✓ Skipping ${key} (exists)`);
    return;
  }
  
  const content = generateSpeciesFile(key, name, data.baseStats, data.growthStats);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${key}`);
  count++;
});

console.log(`\nGenerated ${count} species files`);
