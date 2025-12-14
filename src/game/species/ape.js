import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const apeSpecies = {
  key: 'ape',
  name: 'Ape',
  baseStats: { hp: 35, atk: 12, def: 8, spd: 6 },
  growthStats: { hp: 8, atk: 3, def: 2, spd: 1 },
  type: 'mighty',
  diet: 'omnivore',

  evolutions: {
    1: { ...createEvolutionStage(1, 'Ape Infant', 'Young ape learning from elders', EVOLUTION_PHASES.BABY), bonuses: {}, abilities: ['pound', 'grunt', 'climb'] },
    2: { ...createEvolutionStage(2, 'Ape', 'Growing strong in the troop', EVOLUTION_PHASES.YOUNG), bonuses: { atk: 0.14, def: 0.06, hp: 0.1 }, abilities: ['pound', 'grunt', 'climb', 'power_strike'] },
    3: { ...createEvolutionStage(3, 'Ape', 'Powerful member of the troop', EVOLUTION_PHASES.ADULT), bonuses: { atk: 0.22, def: 0.1, hp: 0.15 }, abilities: ['pound', 'grunt', 'climb', 'power_strike', 'ground_slam'] },
    4: { ...createEvolutionStage(4, 'Ape', 'Elder leader, master of strength', EVOLUTION_PHASES.ELDER), bonuses: { atk: 0.32, def: 0.14, hp: 0.22, leadership: 0.15 }, abilities: ['pound', 'grunt', 'climb', 'power_strike', 'ground_slam', 'primal_roar'] },
    5: { ...createEvolutionStage(5, 'Inferno Ape', 'Ape wielding flames', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.16, def: 0.08, hp: 0.08 }, abilities: ['pound', 'grunt', 'climb', 'flame_strike'] },
    6: { ...createEvolutionStage(6, 'Inferno Ape', 'Master of blazing strength', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.26, def: 0.12, hp: 0.14 }, abilities: ['pound', 'grunt', 'climb', 'flame_strike', 'inferno_pound', 'burning_aura'] },
    7: { ...createEvolutionStage(7, 'Inferno Ape', 'Living inferno of power', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.36, def: 0.16, hp: 0.22, firepower: 0.1 }, abilities: ['pound', 'grunt', 'climb', 'flame_strike', 'inferno_pound', 'burning_aura', 'magma_slam'] },
    8: { ...createEvolutionStage(8, 'Inferno Ape', 'Ancient flames given ape form', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.46, def: 0.2, hp: 0.3, infernoPower: 0.4 }, abilities: ['pound', 'grunt', 'climb', 'flame_strike', 'inferno_pound', 'burning_aura', 'magma_slam', 'volcano_strike'] },
    9: { ...createEvolutionStage(9, 'Void Ape', 'Primal being transcending reality', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL), bonuses: { atk: 0.66, def: 0.32, hp: 0.5, infinitePower: 0.9, voidRage: 1.0 }, abilities: ['pound', 'grunt', 'climb', 'flame_strike', 'inferno_pound', 'burning_aura', 'magma_slam', 'volcano_strike', 'void_smash', 'reality_pound'] }
  },

  legendaryForm: { number: 10, name: 'Celestial Ape', description: 'Divine ape blessed with heavenly might', growth: EVOLUTION_PHASES.ELDER, rarity: EVOLUTION_RARITY.LEGENDARY, epCost: 2400, requirements: { minLevel: 45, minStats: { atk: 70, def: 50, spd: 35 }, minBattlesWon: 500, epThreshold: 4000, rareItems: 3 }, bonuses: { atk: 0.5, def: 0.18, hp: 0.2, celestialPower: 0.65 }, abilities: ['pound', 'grunt', 'climb', 'power_strike', 'ground_slam', 'primal_roar', 'stellar_strike'] },
  ancientForm: { number: 11, name: 'Primordial Ape', description: 'First ape from creation\'s age, keeper of primal fury', growth: EVOLUTION_PHASES.ELDER, rarity: EVOLUTION_RARITY.ANCIENT, epCost: 3600, requirements: { minLevel: 65, minStats: { atk: 100, def: 75, spd: 50 }, minBattlesWon: 1500, epThreshold: 7500, rareItems: 5, timePlayed: 500 }, bonuses: { atk: 0.7, def: 0.28, hp: 0.35, primalFury: 1.1, ancestralStrength: 0.9 }, abilities: ['pound', 'grunt', 'climb', 'power_strike', 'ground_slam', 'primal_roar', 'genesis_pound'] },
  supernaturalForm: { number: 12, name: 'Entity of Fury', description: 'Incomprehensible force of pure destructive power', growth: EVOLUTION_PHASES.ELDER, rarity: EVOLUTION_RARITY.SUPERNATURAL, epCost: 6000, requirements: { minLevel: 100, minStats: { atk: 185, def: 135, spd: 95 }, minBattlesWon: 3000, epThreshold: 15000, rareItems: 10, timePlayed: 1000, specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame'] }, bonuses: { atk: 1.25, def: 0.5, hp: 0.7, supernaturalFury: 2.5, voidDestruction: 2.0, infinitePower: 1.0 }, abilities: ['pound', 'void_smash', 'reality_pound', 'void_phase', 'chaos_roar', 'infinity_strike'] },

  statUpgrades: {
    strength: { name: 'Strength', description: 'Increases attack and crushing power', costPerPoint: 2, maxPoints: 55, effect: (points) => ({ atk: points * 0.13, crushPower: points * 0.006 }) },
    stability: { name: 'Stability', description: 'Improves defense and footing', costPerPoint: 2, maxPoints: 50, effect: (points) => ({ def: points * 0.1, stability: points * 0.005 }) },
    vitality: { name: 'Vitality', description: 'Increases health and stamina', costPerPoint: 2, maxPoints: 55, effect: (points) => ({ hp: points * 0.17, endurance: points * 0.004 }) }
  }
};
