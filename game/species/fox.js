export const foxSpecies = {
  key: 'fox',
  name: 'Fox',
  baseStats: { hp: 24, atk: 8, def: 4, spd: 8 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 1 },
  type: 'cunning',
  diet: 'carnivore',

  // 5-stage evolution tree
  evolutions: {
    1: {
      name: 'Fox Kit',
      growth: 'baby',
      epCost: 0,
      description: 'Curious and playful, learning to hunt',
      bonuses: {},
      abilities: ['sneak', 'scavenge']
    },
    2: {
      name: 'Young Fox',
      growth: 'young',
      epCost: 25,
      description: 'Growing bolder, developing hunting skills',
      bonuses: { spd: 0.1, atk: 0.05 },
      abilities: ['sneak', 'scavenge', 'pounce'],
      branches: {
        cunning: {
          name: 'Trickster Fox',
          description: 'Masters deception and misdirection',
          bonuses: { spd: 0.15, critChance: 0.2 },
          abilities: ['sneak', 'illusion', 'backstab']
        },
        fierce: {
          name: 'Hunter Fox',
          description: 'Becomes a relentless predator',
          bonuses: { atk: 0.2, huntSkill: 0.25 },
          abilities: ['sneak', 'track', 'ambush']
        }
      }
    },
    3: {
      name: 'Adult Fox',
      growth: 'adult',
      epCost: 75,
      description: 'Prime of life, skilled hunter',
      bonuses: { spd: 0.15, atk: 0.1 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade']
    },
    4: {
      name: 'Elder Fox',
      growth: 'elder',
      epCost: 150,
      description: 'Wise and experienced, territory master',
      bonuses: { spd: 0.2, atk: 0.15, def: 0.1 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade', 'territory']
    },
    5: {
      name: 'Fox Spirit',
      growth: 'legendary',
      epCost: 300,
      description: 'Mythical being, guardian of the wild',
      bonuses: { spd: 0.3, atk: 0.25, def: 0.15, critChance: 0.15 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade', 'territory', 'spirit_walk']
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
  }
};
