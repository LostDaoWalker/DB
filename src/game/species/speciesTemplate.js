import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

/**
 * Template for creating a species with 9 evolutions and proper growth phases
 * Each evolution has 4 growth phases: baby, young, adult, elder
 * 
 * Usage:
 * const foxSpecies = createSpecies({
 *   key: 'fox',
 *   name: 'Fox',
 *   baseStats: { hp: 24, atk: 8, def: 4, spd: 8 },
 *   growthStats: { hp: 5, atk: 2, def: 1, spd: 1 },
 *   evolutions: [
 *     { name: 'Fox Kit', phase: EVOLUTION_PHASES.BABY, ... },
 *     ...9 evolutions total
 *   ]
 * });
 */

export function createSpecies(config) {
  const {
    key,
    name,
    baseStats,
    growthStats,
    type = 'standard',
    diet = 'omnivore',
    evolutions = [],
    statUpgrades = DEFAULT_STAT_UPGRADES
  } = config;

  if (evolutions.length !== 9) {
    throw new Error(`Species must have exactly 9 evolutions, got ${evolutions.length}`);
  }

  const evolutionMap = {};
  evolutions.forEach((evo, index) => {
    evolutionMap[index + 1] = {
      ...createEvolutionStage(
        index + 1,
        evo.name,
        evo.description,
        evo.phase,
        evo.rarity || EVOLUTION_RARITY.COMMON
      ),
      bonuses: evo.bonuses || {},
      abilities: evo.abilities || []
    };
  });

  return {
    key,
    name,
    baseStats,
    growthStats,
    type,
    diet,
    evolutions: evolutionMap,
    statUpgrades,
    legendaryForm: config.legendaryForm,
    ancientForm: config.ancientForm,
    supernaturalForm: config.supernaturalForm
  };
}

export const DEFAULT_STAT_UPGRADES = {
  power: {
    name: 'Power',
    description: 'Increases attack and physical damage output',
    costPerPoint: 2,
    maxPoints: 50,
    effect: (points) => ({
      atk: points * 0.1,
      critChance: points * 0.002
    })
  },
  resilience: {
    name: 'Resilience',
    description: 'Improves defense and damage reduction',
    costPerPoint: 2,
    maxPoints: 50,
    effect: (points) => ({
      def: points * 0.08,
      damageReduction: points * 0.003
    })
  },
  vitality: {
    name: 'Vitality',
    description: 'Increases health and survivability',
    costPerPoint: 2,
    maxPoints: 60,
    effect: (points) => ({
      hp: points * 0.15,
      regeneration: points * 0.002
    })
  },
  wisdom: {
    name: 'Wisdom',
    description: 'Enhances special abilities and luck',
    costPerPoint: 3,
    maxPoints: 40,
    effect: (points) => ({
      luck: points * 0.005,
      specialPowerBonus: points * 0.003
    })
  }
};

/**
 * Helper to validate species has correct structure
 */
export function validateSpecies(species) {
  const issues = [];

  if (!species.key) issues.push('Missing key');
  if (!species.name) issues.push('Missing name');
  if (!species.baseStats) issues.push('Missing baseStats');
  if (!species.growthStats) issues.push('Missing growthStats');

  if (!species.evolutions || Object.keys(species.evolutions).length !== 9) {
    issues.push(`Expected 9 evolutions, got ${Object.keys(species.evolutions).length || 0}`);
  }

  // Check all 9 evolutions
  for (let i = 1; i <= 9; i++) {
    const evo = species.evolutions[i];
    if (!evo) {
      issues.push(`Missing evolution stage ${i}`);
    } else {
      if (!evo.name) issues.push(`Evolution ${i}: Missing name`);
      if (!evo.growth) issues.push(`Evolution ${i}: Missing growth phase`);
      if (![EVOLUTION_PHASES.BABY, EVOLUTION_PHASES.YOUNG, EVOLUTION_PHASES.ADULT, EVOLUTION_PHASES.ELDER].includes(evo.growth)) {
        issues.push(`Evolution ${i}: Invalid growth phase "${evo.growth}"`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
