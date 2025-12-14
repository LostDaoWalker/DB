export const rabbitSpecies = {
  key: 'rabbit',
  name: 'Rabbit',
  baseStats: { hp: 22, atk: 7, def: 4, spd: 10 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 2 },
  type: 'nimble',
  diet: 'herbivore',

  // 8-stage evolution tree with growth phases for each evolution
  evolutions: {
    1: {
      name: 'Rabbit Kit',
      growth: 'baby',
      epCost: 0,
      description: 'Playful and curious, learning to hop and hide',
      bonuses: {},
      abilities: ['dodge', 'burrow']
    },
    2: {
      name: 'Young Rabbit',
      growth: 'young',
      epCost: 80,
      description: 'Growing more agile, developing evasion skills',
      bonuses: { spd: 0.12, def: 0.03 },
      abilities: ['dodge', 'burrow', 'hop'],
      branches: {
        nimble: {
          name: 'Swift Rabbit',
          description: 'Masters speed and evasion, becomes untouchable',
          bonuses: { spd: 0.18, evasion: 0.25 },
          abilities: ['dodge', 'lightning_hop', 'blur']
        },
        tough: {
          name: 'Burrowing Rabbit',
          description: 'Develops incredible digging abilities and defenses',
          bonuses: { def: 0.15, burrowDefense: 0.3 },
          abilities: ['dodge', 'deep_burrow', 'earth_shield']
        }
      }
    },
    3: {
      name: 'Adult Rabbit',
      growth: 'adult',
      epCost: 250,
      description: 'Prime of life, skilled at evasion and survival',
      bonuses: { spd: 0.15, def: 0.05 },
      abilities: ['dodge', 'burrow', 'hop', 'evade']
    },
    4: {
      name: 'Elder Rabbit',
      growth: 'elder',
      epCost: 500,
      description: 'Wise and experienced, master of the warren',
      bonuses: { spd: 0.18, def: 0.08, evasion: 0.1 },
      abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master']
    },
    5: {
      name: 'Rabbit Spirit',
      growth: 'legendary',
      epCost: 1000,
      description: 'Mythical spirit of fertility and speed',
      bonuses: { spd: 0.25, def: 0.12, evasion: 0.15, luck: 0.2 },
      abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'spirit_speed']
    },
    6: {
      name: 'Moon Rabbit',
      growth: 'mythical',
      epCost: 2000,
      description: 'Celestial rabbit from lunar legends, weaver of dreams',
      bonuses: { spd: 0.32, def: 0.18, evasion: 0.22, luck: 0.3, dreamWeaver: 0.4 },
      abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'spirit_speed', 'dream_hop', 'lunar_blessing']
    },
    7: {
      name: 'Void Hopper',
      growth: 'divine',
      epCost: 4000,
      description: 'Rabbit that hops between dimensions, master of space and time',
      bonuses: { spd: 0.4, def: 0.25, evasion: 0.3, luck: 0.4, dreamWeaver: 0.6, dimensionalShift: 0.7 },
      abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'spirit_speed', 'dream_hop', 'lunar_blessing', 'void_jump', 'time_hop']
    },
    8: {
      name: 'Primordial Leaper',
      growth: 'primordial',
      epCost: 8000,
      description: 'The original rabbit, ancestor of all lagomorphs, bounder through eternity',
      bonuses: { spd: 0.55, def: 0.35, evasion: 0.4, luck: 0.5, dreamWeaver: 0.8, dimensionalShift: 0.9, eternalBounce: 1.0 },
      abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'spirit_speed', 'dream_hop', 'lunar_blessing', 'void_jump', 'time_hop', 'primordial_leap', 'eternal_warren', 'reality_bound']
    }
  },

  // EP-based stat upgrades
  statUpgrades: {
    agility: {
      name: 'Agility',
      description: 'Increases speed and evasion capabilities',
      costPerPoint: 2,
      maxPoints: 50,
      effect: (points) => ({
        spd: points * 0.12,
        evasion: points * 0.004
      })
    },
    luck: {
      name: 'Luck',
      description: 'Improves critical hits and random positive effects',
      costPerPoint: 3,
      maxPoints: 40,
      effect: (points) => ({
        critChance: points * 0.003,
        luckBonus: points * 0.005
      })
    },
    endurance: {
      name: 'Endurance',
      description: 'Better stamina and defense while moving',
      costPerPoint: 2,
      maxPoints: 45,
      effect: (points) => ({
        def: points * 0.08,
        stamina: points * 0.01
      })
    }
  },

  // Cross-species evolution forms
  legendaryForm: {
    name: 'Fleet Spirit',
    epCost: 280,
    description: 'Legendary rabbit spirit, embodiment of speed and evasion',
    bonuses: { spd: 0.4, def: 0.1, evasion: 0.35, luck: 0.25 }
  },

  ancientForm: {
    name: 'Dawn Hopper',
    epCost: 650,
    description: 'Ancient rabbit from the first light, master of momentum',
    bonuses: { spd: 0.5, def: 0.15, evasion: 0.4, luck: 0.35, momentum: 0.6 }
  },

  mythicalForm: {
    name: 'Chinchilla Deity',
    epCost: 2200,
    description: 'Divine rabbit of abundance, bringer of fortune and fertility',
    bonuses: { spd: 0.65, def: 0.25, evasion: 0.5, luck: 0.6, momentum: 0.8, abundance: 0.9 }
  }
};
