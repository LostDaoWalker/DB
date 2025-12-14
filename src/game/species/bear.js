export const bearSpecies = {
  key: 'bear',
  name: 'Bear',
  baseStats: { hp: 32, atk: 7, def: 7, spd: 4 },
  growthStats: { hp: 7, atk: 2, def: 2, spd: 1 },
  type: 'sturdy',
  diet: 'omnivore',

  // 8-stage evolution tree with growth phases for each evolution
  evolutions: {
    1: {
      name: 'Bear Cub',
      growth: 'baby',
      epCost: 0,
      description: 'Playful and curious, learning to growl and wrestle',
      bonuses: {},
      abilities: ['growl', 'wrestle']
    },
    2: {
      name: 'Young Bear',
      growth: 'young',
      epCost: 120,
      description: 'Growing stronger, developing defensive instincts',
      bonuses: { hp: 0.08, def: 0.05 },
      abilities: ['growl', 'wrestle', 'guard'],
      branches: {
        sturdy: {
          name: 'Guardian Bear',
          description: 'Becomes the ultimate protector, tanking damage for others',
          bonuses: { hp: 0.15, def: 0.12, guardBonus: 0.3 },
          abilities: ['growl', 'shield_ally', 'last_stand']
        },
        fierce: {
          name: 'Berserker Bear',
          description: 'Channels primal rage, becoming more powerful as damaged',
          bonuses: { atk: 0.18, rageBonus: 0.25 },
          abilities: ['growl', 'berserk', 'reckless_charge']
        }
      }
    },
    3: {
      name: 'Adult Bear',
      growth: 'adult',
      epCost: 350,
      description: 'Prime of life, master of strength and defense',
      bonuses: { hp: 0.12, def: 0.08 },
      abilities: ['growl', 'wrestle', 'guard', 'roar']
    },
    4: {
      name: 'Elder Bear',
      growth: 'elder',
      epCost: 700,
      description: 'Wise and powerful, guardian of the wild',
      bonuses: { hp: 0.18, def: 0.12, atk: 0.08 },
      abilities: ['growl', 'wrestle', 'guard', 'roar', 'wise_guardian']
    },
    5: {
      name: 'Bear Spirit',
      growth: 'legendary',
      epCost: 1400,
      description: 'Mythical spirit of strength and protection',
      bonuses: { hp: 0.25, def: 0.18, atk: 0.12, regeneration: 0.15 },
      abilities: ['growl', 'wrestle', 'guard', 'roar', 'wise_guardian', 'spirit_strength']
    },
    6: {
      name: 'Ursine Behemoth',
      growth: 'mythical',
      epCost: 2800,
      description: 'Massive bear of legend, embodiment of raw power',
      bonuses: { hp: 0.35, def: 0.25, atk: 0.2, regeneration: 0.25, behemothForce: 0.4 },
      abilities: ['growl', 'wrestle', 'guard', 'roar', 'wise_guardian', 'spirit_strength', 'earthquake_stomp', 'titanic_roar']
    },
    7: {
      name: 'Celestial Bear',
      growth: 'divine',
      epCost: 5500,
      description: 'Bear blessed by the stars, channeler of cosmic energy',
      bonuses: { hp: 0.45, def: 0.32, atk: 0.28, regeneration: 0.35, behemothForce: 0.6, stellarPower: 0.7 },
      abilities: ['growl', 'wrestle', 'guard', 'roar', 'wise_guardian', 'spirit_strength', 'earthquake_stomp', 'titanic_roar', 'cosmic_guard', 'stellar_fury']
    },
    8: {
      name: 'Primordial Titan',
      growth: 'primordial',
      epCost: 11000,
      description: 'The first bear, progenitor of all ursines, master of creation and destruction',
      bonuses: { hp: 0.6, def: 0.45, atk: 0.4, regeneration: 0.5, behemothForce: 0.8, stellarPower: 0.9, primordialMight: 1.0 },
      abilities: ['growl', 'wrestle', 'guard', 'roar', 'wise_guardian', 'spirit_strength', 'earthquake_stomp', 'titanic_roar', 'cosmic_guard', 'stellar_fury', 'primordial_crush', 'eternal_guard', 'titanic_creation']
    }
  },

  // EP-based stat upgrades
  statUpgrades: {
    fortitude: {
      name: 'Fortitude',
      description: 'Increases health and defensive capabilities',
      costPerPoint: 3,
      maxPoints: 50,
      effect: (points) => ({
        hp: points * 0.15,
        def: points * 0.08
      })
    },
    might: {
      name: 'Might',
      description: 'Boosts attack power and physical strength',
      costPerPoint: 2,
      maxPoints: 45,
      effect: (points) => ({
        atk: points * 0.1,
        strength: points * 0.012
      })
    },
    regeneration: {
      name: 'Regeneration',
      description: 'Heals over time and resists status effects',
      costPerPoint: 4,
      maxPoints: 35,
      effect: (points) => ({
        regenRate: points * 0.005,
        statusResist: points * 0.003
      })
    }
  },

  // Cross-species evolution forms
  legendaryForm: {
    name: 'Ursa Major Spirit',
    epCost: 320,
    description: 'Legendary bear spirit, constellation made flesh',
    bonuses: { hp: 0.35, def: 0.25, atk: 0.15, regeneration: 0.2 }
  },

  ancientForm: {
    name: 'Cave Bear Ancient',
    epCost: 750,
    description: 'Ancient bear from prehistoric caves, master of primal strength',
    bonuses: { hp: 0.45, def: 0.35, atk: 0.25, regeneration: 0.3, primalPower: 0.6 }
  },

  mythicalForm: {
    name: 'Arthurius Deity',
    epCost: 2800,
    description: 'Divine bear of legend, king of beasts and protector of realms',
    bonuses: { hp: 0.65, def: 0.5, atk: 0.4, regeneration: 0.5, primalPower: 0.8, divineAuthority: 0.9 }
  }
};
