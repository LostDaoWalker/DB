export const ANIMALS = {
  fox: {
    key: 'fox',
    name: 'Fox',
    size: 'Medium',
    diet: 'Carnivore',
    mobility: 'Ground',
    base: { hp: 24, atk: 8, def: 4, spd: 8 },
    growth: { hp: 5, atk: 2, def: 1, spd: 1 },
    passive: 'Trickster (crit chance)',
    pros: 'Fast learner, sneaky damage',
    cons: 'Fragile, inconsistent',
  },
  bear: {
    key: 'bear',
    name: 'Bear',
    size: 'Large',
    diet: 'Omnivore',
    mobility: 'Ground',
    base: { hp: 32, atk: 7, def: 7, spd: 4 },
    growth: { hp: 7, atk: 2, def: 2, spd: 1 },
    passive: 'Guard (damage reduction)',
    pros: 'Tanky, steady damage',
    cons: 'Slow, low crit potential',
  },
  rabbit: {
    key: 'rabbit',
    name: 'Rabbit',
    size: 'Small',
    diet: 'Herbivore',
    mobility: 'Ground',
    base: { hp: 22, atk: 7, def: 4, spd: 10 },
    growth: { hp: 5, atk: 2, def: 1, spd: 2 },
    passive: 'Dodge (evasion chance)',
    pros: 'Fast, evasive',
    cons: 'Squishy, weak early',
  },
  owl: {
    key: 'owl',
    name: 'Owl',
    size: 'Medium',
    diet: 'Carnivore',
    mobility: 'Flight',
    base: { hp: 26, atk: 8, def: 5, spd: 6 },
    growth: { hp: 6, atk: 2, def: 1, spd: 1 },
    passive: 'Focus (steady damage)',
    pros: 'Balanced, consistent',
    cons: 'No standout strengths',
  },
};

const ANIMALS_LIST = Object.freeze(Object.values(ANIMALS));
const statsCache = new Map();

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

  statsCache.set(cacheKey, stats);
  return stats;
}
