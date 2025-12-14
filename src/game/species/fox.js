export const foxSpecies = {
  key: 'fox',
  name: 'Fox',
  baseStats: { hp: 24, atk: 8, def: 4, spd: 8 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 1 },
  type: 'cunning',
  diet: 'carnivore',

  // 4 evolution stages with standardized phases
  evolutions: {
    1: {
      name: 'Baby',
      epCost: 0,
      bonuses: {},
      abilities: ['sneak', 'scavenge'],
      phases: [
        { phase: 1, bonusMultiplier: 0.2 },
        { phase: 2, bonusMultiplier: 0.4 },
        { phase: 3, bonusMultiplier: 0.6 },
        { phase: 4, bonusMultiplier: 0.8 },
        { phase: 5, bonusMultiplier: 1.0 }
      ]
    },
    2: {
      name: 'Young',
      epCost: 100,
      bonuses: { spd: 0.1, atk: 0.05 },
      abilities: ['sneak', 'scavenge', 'pounce'],
      phases: [
        { phase: 1, bonusMultiplier: 1.1 },
        { phase: 2, bonusMultiplier: 1.2 },
        { phase: 3, bonusMultiplier: 1.3 },
        { phase: 4, bonusMultiplier: 1.4 },
        { phase: 5, bonusMultiplier: 1.5 }
      ]
    },
    3: {
      name: 'Adult',
      epCost: 300,
      bonuses: { spd: 0.15, atk: 0.1 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade'],
      phases: [
        { phase: 1, bonusMultiplier: 1.6 },
        { phase: 2, bonusMultiplier: 1.7 },
        { phase: 3, bonusMultiplier: 1.8 },
        { phase: 4, bonusMultiplier: 1.9 },
        { phase: 5, bonusMultiplier: 2.0 }
      ]
    },
    4: {
      name: 'Elder',
      epCost: 600,
      bonuses: { spd: 0.2, atk: 0.15, def: 0.1 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade', 'territory'],
      phases: [
        { phase: 1, bonusMultiplier: 2.1 },
        { phase: 2, bonusMultiplier: 2.2 },
        { phase: 3, bonusMultiplier: 2.3 },
        { phase: 4, bonusMultiplier: 2.4 },
        { phase: 5, bonusMultiplier: 2.5 }
      ]
    }
  },

  // EP-based stat upgrades
  statUpgrades: {
    cunning: {
      name: 'Cunning',
      description: 'Increases critical hit chance and evasion',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        critChance: points * 0.005,
        evasion: points * 0.003
      })
    },
    agility: {
      name: 'Agility',
      description: 'Increases speed and reduces enemy accuracy',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        spd: points * 0.1,
        enemyAccuracyPenalty: points * 0.002
      })
    },
    stealth: {
      name: 'Stealth',
      description: 'Better at ambushes and escaping',
      costPerPoint: 3,
      maxPoints: 30,
      effect: (points) => ({
        ambushBonus: points * 0.02,
        fleeSuccess: points * 0.01
      })
    }
  },

  // Cross-species evolution forms
  legendaryForm: {
    name: 'Trickster Spirit',
    epCost: 300,
    description: 'Legendary fox spirit, master of deception and illusion',
    bonuses: { spd: 0.35, atk: 0.25, def: 0.15, critChance: 0.3 }
  },

  ancientForm: {
    name: 'Primordial Trickster',
    epCost: 800,
    description: 'Ancient fox from the dawn of time, weaver of fate',
    bonuses: { spd: 0.45, atk: 0.35, def: 0.25, critChance: 0.35, fateWeaver: 0.6 }
  },

  mythicalForm: {
    name: 'Nine-Tails Deity',
    epCost: 2500,
    description: 'Divine nine-tailed fox, god of cunning and destiny',
    bonuses: { spd: 0.6, atk: 0.5, def: 0.4, critChance: 0.5, fateWeaver: 0.8, multiStrike: 0.8 }
  }
};
