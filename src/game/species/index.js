import fs from 'node:fs';
import path from 'node:path';

// Dynamic species loading from JSON
let ANIMALS = {};
let ANIMALS_LIST = [];

function loadSpecies() {
  try {
    const speciesPath = path.join(process.cwd(), 'src', 'game', 'species.json');
    const data = fs.readFileSync(speciesPath, 'utf8');
    ANIMALS = JSON.parse(data);
    ANIMALS_LIST = Object.freeze(Object.values(ANIMALS));
  } catch (err) {
    console.error('Failed to load species:', err.message);
    // Fallback to empty
    ANIMALS = {};
    ANIMALS_LIST = [];
  }
}

// Load species on module load
loadSpecies();

// Reload species on file changes for development
if (process.env.NODE_ENV !== 'production') {
  const speciesPath = path.join(process.cwd(), 'src', 'game', 'species.json');
  fs.watchFile(speciesPath, { interval: 1000 }, () => {
    console.log('Species file changed, reloading...');
    loadSpecies();
  });
}
// Reduced cache size and TTL for memory optimization
const statsCache = new Map();
const CACHE_MAX_SIZE = 50; // Limit cache size
const CACHE_TTL = 300000; // 5 minutes TTL

export function listAnimals() {
  return ANIMALS_LIST;
}

export function getAnimal(key) {
  const animal = ANIMALS[key];
  if (!animal) throw new Error(`Unknown animal key: ${key}`);
  return animal;
}

export function getStats(animalKey, level) {
  const a = getAnimal(animalKey);
  const L = Math.max(1, Math.floor(level));

  // Cache stats by key+level to avoid recalculation
  const cacheKey = `${animalKey}:${L}`;
  if (statsCache.has(cacheKey)) {
    return statsCache.get(cacheKey);
  }

  const n = L - 1;
  const stats = {
    hp: a.base.hp + a.growth.hp * n,
    atk: a.base.atk + a.growth.atk * n,
    def: a.base.def + a.growth.def * n,
    spd: a.base.spd + a.growth.spd * n,
  };

  // Memory optimization: limit cache size
  if (statsCache.size >= CACHE_MAX_SIZE) {
    const firstKey = statsCache.keys().next().value;
    statsCache.delete(firstKey);
  }

  statsCache.set(cacheKey, { ...stats, timestamp: Date.now() });
  return stats;
}

// Periodic cache cleanup for memory optimization
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of statsCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      statsCache.delete(key);
    }
  }
}, 60000); // Clean every minute
