import fs from 'node:fs';
import path from 'node:path';

// Load species from JSON for now - will migrate to modular system later
let speciesData = {};
let animalsList = [];

try {
  const speciesPath = path.join(process.cwd(), 'src', 'game', 'species.json');
  speciesData = JSON.parse(fs.readFileSync(speciesPath, 'utf8'));
  animalsList = Object.values(speciesData);
  console.log(`Loaded ${animalsList.length} species from JSON`);
} catch (err) {
  console.error('Failed to load species:', err.message);
  speciesData = {};
  animalsList = [];
}

export function listAnimals() {
  return animalsList;
}

export function getAnimal(key) {
  const species = speciesData[key];
  if (!species) {
    throw new Error(`Unknown species key: ${key}`);
  }

  return {
    key: species.key,
    name: species.name,
    baseStats: species.base,
    growthStats: species.growth,
    passive: species.passive,
    pros: species.pros,
    cons: species.cons
  };
}

export function getStats(animalKey, level) {
  const species = speciesData[animalKey];
  if (!species) {
    throw new Error(`Unknown species key: ${animalKey}`);
  }

  const L = Math.max(1, Math.floor(level));
  const n = L - 1;

  return {
    hp: species.base.hp + species.growth.hp * n,
    atk: species.base.atk + species.growth.atk * n,
    def: species.base.def + species.growth.def * n,
    spd: species.base.spd + species.growth.spd * n,
  };
}

export function getSpeciesModule(key) {
  return speciesData[key];
}

export function getAllSpeciesModules() {
  return speciesData;
}

// Export specific species for direct access
export { foxSpecies } from './fox.js';
export { rabbitSpecies } from './rabbit.js';
export { bearSpecies } from './bear.js';
