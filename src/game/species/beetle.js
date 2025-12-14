import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const beetleSpecies = {
  key: 'beetle',
  name: 'Beetle',
  baseStats: { hp: 25, atk: 6, def: 9, spd: 8 },
  growthStats: { hp: 6, atk: 1, def: 3, spd: 1 },
  type: 'armored',
  diet: 'omnivore',

  evolutions: {
    1: {
      ...createEvolutionStage(1, 'Beetle Larva', 'Small grub burrowing in soil', EVOLUTION_PHASES.BABY),
      bonuses: {},
      abilities: ['burrow', 'harden', 'bite']
    },
    2: {
      ...createEvolutionStage(2, 'Beetle', 'Growing insect with hardening shell', EVOLUTION_PHASES.YOUNG),
      bonuses: { def: 0.1, hp: 0.08 },
      abilities: ['burrow', 'harden', 'bite', 'shell_defense']
    },
    3: {
      ...createEvolutionStage(3, 'Beetle', 'Fully armored insect predator', EVOLUTION_PHASES.ADULT),
      bonuses: { def: 0.16, hp: 0.12, atk: 0.04 },
      abilities: ['burrow', 'harden', 'bite', 'shell_defense', 'charge']
    },
    4: {
      ...createEvolutionStage(4, 'Beetle', 'Ancient beetle, fortress of chitin', EVOLUTION_PHASES.ELDER),
      bonuses: { def: 0.24, hp: 0.18, atk: 0.08, armor: 0.15 },
      abilities: ['burrow', 'harden', 'bite', 'shell_defense', 'charge', 'exoskeleton_mastery']
    },
    5: {
      ...createEvolutionStage(5, 'Metal Beetle', 'Beetle infused with metallic ore', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { def: 0.12, hp: 0.1 },
      abilities: ['burrow', 'harden', 'bite', 'metal_shell']
    },
    6: {
      ...createEvolutionStage(6, 'Metal Beetle', 'Living shield of forged steel', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { def: 0.2, hp: 0.16, atk: 0.05 },
      abilities: ['burrow', 'harden', 'bite', 'metal_shell', 'iron_body', 'reflect_strike']
    },
    7: {
      ...createEvolutionStage(7, 'Metal Beetle', 'Impenetrable fortress of metal', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { def: 0.3, hp: 0.24, atk: 0.08, metallic: 0.1 },
      abilities: ['burrow', 'harden', 'bite', 'metal_shell', 'iron_body', 'reflect_strike', 'hardened_strike']
    },
    8: {
      ...createEvolutionStage(8, 'Metal Beetle', 'Ancient metal given insectoid form', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON),
      bonuses: { def: 0.4, hp: 0.32, atk: 0.12, metalMastery: 0.4 },
      abilities: ['burrow', 'harden', 'bite', 'metal_shell', 'iron_body', 'reflect_strike', 'hardened_strike', 'steel_carapace']
    },
    9: {
      ...createEvolutionStage(9, 'Void Beetle', 'Insect transcending physical form', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL),
      bonuses: { def: 0.6, hp: 0.5, atk: 0.2, infiniteArmor: 0.9, voidShell: 1.0 },
      abilities: ['burrow', 'harden', 'bite', 'metal_shell', 'iron_body', 'reflect_strike', 'hardened_strike', 'steel_carapace', 'void_shell', 'reality_armor']
    }
  },

  legendaryForm: {
    number: 10,
    name: 'Celestial Beetle',
    description: 'Divine beetle blessed with heavenly protection',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.LEGENDARY,
    epCost: 2400,
    requirements: {
      minLevel: 45,
      minStats: { atk: 35, def: 65, spd: 35 },
      minBattlesWon: 500,
      epThreshold: 4000,
      rareItems: 3
    },
    bonuses: { def: 0.35, hp: 0.2, atk: 0.1, luck: 0.25, celestialShield: 0.6 },
    abilities: ['burrow', 'harden', 'bite', 'shell_defense', 'charge', 'exoskeleton_mastery', 'divine_protection']
  },

  ancientForm: {
    number: 11,
    name: 'Primordial Beetle',
    description: 'Ancient beetle from creation\'s age, keeper of eternal defense',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.ANCIENT,
    epCost: 3600,
    requirements: {
      minLevel: 65,
      minStats: { atk: 50, def: 90, spd: 50 },
      minBattlesWon: 1500,
      epThreshold: 7500,
      rareItems: 5,
      timePlayed: 500
    },
    bonuses: { def: 0.55, hp: 0.35, atk: 0.15, primalShell: 0.9, ancestralArmor: 0.8 },
    abilities: ['burrow', 'harden', 'bite', 'shell_defense', 'charge', 'exoskeleton_mastery', 'ancient_shell', 'genesis_defense']
  },

  supernaturalForm: {
    number: 12,
    name: 'Entity of Adamant',
    description: 'Incomprehensible being of unbreakable will and eternal defense',
    growth: EVOLUTION_PHASES.ELDER,
    rarity: EVOLUTION_RARITY.SUPERNATURAL,
    epCost: 6000,
    requirements: {
      minLevel: 100,
      minStats: { atk: 110, def: 165, spd: 95 },
      minBattlesWon: 3000,
      epThreshold: 15000,
      rareItems: 10,
      timePlayed: 1000,
      specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame']
    },
    bonuses: { def: 1.2, hp: 0.7, atk: 0.25, supernaturalDefense: 2.2, voidArmor: 1.8, infiniteProtection: 1.0 },
    abilities: ['burrow', 'void_shell', 'reality_armor', 'void_phase', 'unbreakable_defense', 'chaos_shield', 'infinity_armor', 'absolute_protection']
  },

  statUpgrades: {
    hardness: {
      name: 'Hardness',
      description: 'Increases defense and damage resistance',
      costPerPoint: 2,
      maxPoints: 60,
      effect: (points) => ({
        def: points * 0.1,
        resistance: points * 0.005
      })
    },
    fortitude: {
      name: 'Fortitude',
      description: 'Improves health and durability',
      costPerPoint: 2,
      maxPoints: 55,
      effect: (points) => ({
        hp: points * 0.16,
        endurance: points * 0.004
      })
    },
    reflexes: {
      name: 'Reflexes',
      description: 'Enhances counterattack and reflect abilities',
      costPerPoint: 3,
      maxPoints: 40,
      effect: (points) => ({
        atk: points * 0.07,
        reflection: points * 0.006
      })
    }
  }
};
