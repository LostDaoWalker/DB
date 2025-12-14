import fs from 'node:fs';
import path from 'node:path';

// Dynamically load all species modules
let speciesModules = {};
let animalsList = [];
let animalsMap = {};

function loadSpecies() {
  try {
    const speciesDir = path.join(process.cwd(), 'src', 'game', 'species');
    const files = fs.readdirSync(speciesDir);

    speciesModules = {};
    animalsList = [];
    animalsMap = {};

    for (const file of files) {
      if (file.endsWith('.js') && file !== 'index.js') {
        const speciesKey = file.replace('.js', '');
        const modulePath = path.join(speciesDir, file);

        // Dynamic import
        const module = await import(modulePath);
        const speciesData = module.default || module[Object.keys(module)[0]];

        speciesModules[speciesKey] = speciesData;
        animalsMap[speciesKey] = speciesData;

        // Create legacy format for backward compatibility
        animalsList.push({
          key: speciesData.key,
          name: speciesData.name,
          pros: speciesData.type || 'Balanced',
          cons: 'Evolves over time',
          passive: speciesData.diet || 'Adaptive',
          base: speciesData.baseStats,
          growth: speciesData.growthStats
        });
      }
    }

    console.log(`Loaded ${Object.keys(speciesModules).length} species modules`);
  } catch (err) {
    console.error('Failed to load species modules:', err.message);
    // Fallback empty data
    speciesModules = {};
    animalsList = [];
    animalsMap = {};
  }
}

// Load species on module load
loadSpecies();

// Reload species on file changes for development
if (process.env.NODE_ENV !== 'production') {
  const speciesDir = path.join(process.cwd(), 'src', 'game', 'species');
  fs.watch(speciesDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.js') && filename !== 'index.js') {
      console.log(`Species file ${filename} changed, reloading...`);
      loadSpecies();
    }
  });
}

export function listAnimals() {
  return animalsList;
}

export function getAnimal(key) {
  const species = speciesModules[key];
  if (!species) {
    // Try legacy JSON format as fallback
    try {
      const legacyPath = path.join(process.cwd(), 'src', 'game', 'species.json');
      if (fs.existsSync(legacyPath)) {
        const data = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
        if (data[key]) {
          return {
            key: data[key].key,
            name: data[key].name,
            baseStats: data[key].base,
            growthStats: data[key].growth,
            passive: data[key].passive,
            pros: data[key].pros,
            cons: data[key].cons
          };
        }
      }
    } catch (err) {
      console.warn('Could not load legacy species data');
    }
    throw new Error(`Unknown species key: ${key}`);
  }

  // Return species in legacy format for backward compatibility
  return {
    key: species.key,
    name: species.name,
    baseStats: species.baseStats,
    growthStats: species.growthStats,
    passive: species.passive || species.diet,
    pros: species.type || 'Balanced',
    cons: 'Evolves over time'
  };
}

export function getStats(animalKey, level) {
  const species = speciesModules[animalKey];
  if (!species) {
    throw new Error(`Unknown species key: ${animalKey}`);
  }

  const L = Math.max(1, Math.floor(level));
  const n = L - 1;

  return {
    hp: species.baseStats.hp + species.growthStats.hp * n,
    atk: species.baseStats.atk + species.growthStats.atk * n,
    def: species.baseStats.def + species.growthStats.def * n,
    spd: species.baseStats.spd + species.growthStats.spd * n,
  };
}

export function getSpeciesModule(key) {
  return speciesModules[key];
}

export function getAllSpeciesModules() {
  return speciesModules;
}

// Export specific species for direct access
export { foxSpecies } from './fox.js';
