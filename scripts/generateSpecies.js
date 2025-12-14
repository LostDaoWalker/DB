import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVOLUTION_TEMPLATE = `import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const {keySpecies} = {
  key: '{key}',
  name: '{name}',
  baseStats: { hp: {baseHp}, atk: {baseAtk}, def: {baseDef}, spd: {baseSpd} },
  growthStats: { hp: {growthHp}, atk: {growthAtk}, def: {growthDef}, spd: {growthSpd} },
  type: '{type}',
  diet: '{diet}',

  // 9 evolution stages
  evolutions: {
    1: {
      ...createEvolutionStage(1, '{name} Hatchling', 'Just beginning its journey', EVOLUTION_PHASES.BABY),
      bonuses: {},
      abilities: ['{ability1}', '{ability2}']
    },
    2: {
      ...createEvolutionStage(2, 'Young {name}', 'Growing stronger and more capable', EVOLUTION_PHASES.YOUNG),
      bonuses: { atk: 0.1, spd: 0.08 },
      abilities: ['{ability1}', '{ability2}', '{ability3}']
    },
    3: {
      ...createEvolutionStage(3, 'Adult {name}', 'Reaching full maturity and strength', EVOLUTION_PHASES.ADULT),
      bonuses: { atk: 0.15, spd: 0.12, def: 0.05 },
      abilities: ['{ability1}', '{ability2}', '{ability3}', '{ability4}']
    },
    4: {
      ...createEvolutionStage(4, 'Elder {name}', 'Wise and experienced, master of survival', EVOLUTION_PHASES.ELDER),
      bonuses: { atk: 0.2, spd: 0.15, def: 0.08, luck: 0.1 },
      abilities: ['{ability1}', '{ability2}', '{ability3}', '{ability4}', '{ability5}']
    },
    5: {
      ...createEvolutionStage(5, 'Shadow {name}', 'Embraces darkness and mystery', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.12, spd: 0.1, evasion: 0.08 },
      abilities: ['{ability1}', '{ability2}', '{ability3}', 'shadow_cloak']
    },
    6: {
      ...createEvolutionStage(6, 'Twilight {name}', 'Master of the shadows', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.22, spd: 0.16, evasion: 0.12, def: 0.04 },
      abilities: ['{ability1}', '{ability2}', '{ability3}', 'shadow_cloak', 'shadow_step']
    },
    7: {
      ...createEvolutionStage(7, 'Nocturnal {name}', 'One with the night', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.32, spd: 0.22, evasion: 0.16, def: 0.08, luck: 0.08 },
      abilities: ['{ability1}', '{ability2}', '{ability3}', 'shadow_cloak', 'shadow_step', 'night_vision']
    },
    8: {
      ...createEvolutionStage(8, 'Void {name}', 'Transcends reality itself', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { atk: 0.42, spd: 0.28, evasion: 0.22, def: 0.12, luck: 0.15, void: 0.3 },
      abilities: ['{ability1}', '{ability2}', '{ability3}', 'shadow_cloak', 'shadow_step', 'night_vision', 'void_step']
    },
    9: {
      ...createEvolutionStage(9, 'Eternal {name}', 'Primordial being of endless darkness', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL),
      bonuses: { atk: 0.62, spd: 0.4, evasion: 0.35, def: 0.2, luck: 0.3, infiniteShadow: 0.8, timeless: 1.0 },
      abilities: ['{ability1}', '{ability2}', '{ability3}', 'shadow_cloak', 'shadow_step', 'night_vision', 'void_step', 'eternal_darkness', 'reality_slip']
    }
  },

  legendaryForm: {
    number: 10,
    name: 'Celestial {name}',
    description: 'Divine form blessed by the stars',
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
    bonuses: { atk: 0.45, spd: 0.28, def: 0.12, luck: 0.35, celestialBlessing: 0.6 },
    abilities: ['{ability1}', '{ability2}', 'stellar_strike', 'lucky_fortune']
  },

  ancientForm: {
    number: 11,
    name: 'Primordial {name}',
    description: 'Ancient being from the age of creation',
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
    bonuses: { atk: 0.65, spd: 0.42, def: 0.2, luck: 0.45, primalForce: 0.8, ancestralMemory: 0.7 },
    abilities: ['{ability1}', '{ability2}', 'primal_strike', 'ancient_wisdom']
  },

  supernaturalForm: {
    number: 12,
    name: 'Entity of Eternity',
    description: 'Incomprehensible being transcending reality',
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
    bonuses: { atk: 1.1, spd: 0.65, def: 0.35, luck: 0.7, supernaturalForce: 2.0, realityBend: 1.5, infinitePower: 1.0 },
    abilities: ['{ability1}', 'void_phase', 'reality_warp', 'chaos_strike']
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
`;

function generateSpeciesFile(speciesData) {
  const template = EVOLUTION_TEMPLATE
    .replace(/{key}/g, speciesData.key)
    .replace(/{keySpecies}/g, speciesData.key.charAt(0).toUpperCase() + speciesData.key.slice(1) + 'Species')
    .replace(/{name}/g, speciesData.name)
    .replace(/{baseHp}/g, speciesData.base.hp)
    .replace(/{baseAtk}/g, speciesData.base.atk)
    .replace(/{baseDef}/g, speciesData.base.def)
    .replace(/{baseSpd}/g, speciesData.base.spd)
    .replace(/{growthHp}/g, speciesData.growth.hp)
    .replace(/{growthAtk}/g, speciesData.growth.atk)
    .replace(/{growthDef}/g, speciesData.growth.def)
    .replace(/{growthSpd}/g, speciesData.growth.spd)
    .replace(/{type}/g, speciesData.passive ? speciesData.passive.toLowerCase() : 'standard')
    .replace(/{diet}/g, speciesData.diet ? speciesData.diet.toLowerCase() : 'omnivore')
    .replace(/{ability1}/g, 'strike')
    .replace(/{ability2}/g, 'defend')
    .replace(/{ability3}/g, 'boost')
    .replace(/{ability4}/g, 'power_up')
    .replace(/{ability5}/g, 'master');

  return template;
}

// Read species.json
const speciesPath = path.join(__dirname, '..', 'src', 'game', 'species.json');
const speciesData = JSON.parse(fs.readFileSync(speciesPath, 'utf8'));

// Generate files for species that don't have custom implementations
const speciesDir = path.join(__dirname, '..', 'src', 'game', 'species');
const existingFiles = fs.readdirSync(speciesDir).map(f => f.replace('.js', ''));

let generated = 0;
let skipped = 0;

Object.entries(speciesData).forEach(([key, species]) => {
  const fileName = key + '.js';
  const filePath = path.join(speciesDir, fileName);

  // Skip if already custom implemented
  if (existingFiles.includes(key)) {
    console.log(`✓ Skipping ${key} (already custom implemented)`);
    skipped++;
    return;
  }

  const content = generateSpeciesFile(species);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Generated ${fileName}`);
  generated++;
});

console.log(`\n✓ Generated ${generated} species files`);
console.log(`✓ Skipped ${skipped} species (already implemented)`);
console.log(`\nTotal species: ${Object.keys(speciesData).length}`);
