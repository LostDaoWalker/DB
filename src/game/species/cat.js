import { EVOLUTION_PHASES, EVOLUTION_RARITY, createEvolutionStage } from './evolutions.js';

export const catSpecies = {
  key: 'cat',
  name: 'Cat',
  baseStats: { hp: 18, atk: 8, def: 3, spd: 12 },
  growthStats: { hp: 4, atk: 2, def: 1, spd: 3 },
  type: 'swift',
  diet: 'carnivore',

  evolutions: {
    1: { ...createEvolutionStage(1, 'Cat Kitten', 'Playful and curious young feline', EVOLUTION_PHASES.BABY), bonuses: {}, abilities: ['claw', 'pounce', 'purr'] },
    2: { ...createEvolutionStage(2, 'Cat', 'Growing hunter with agility', EVOLUTION_PHASES.YOUNG), bonuses: { atk: 0.12, spd: 0.12, def: 0.02 }, abilities: ['claw', 'pounce', 'purr', 'swift_strike'] },
    3: { ...createEvolutionStage(3, 'Cat', 'Skilled predator with grace', EVOLUTION_PHASES.ADULT), bonuses: { atk: 0.18, spd: 0.18, def: 0.04, luck: 0.08 }, abilities: ['claw', 'pounce', 'purr', 'swift_strike', 'acrobatic_dodge'] },
    4: { ...createEvolutionStage(4, 'Cat', 'Ancient feline, master of grace', EVOLUTION_PHASES.ELDER), bonuses: { atk: 0.26, spd: 0.25, def: 0.06, luck: 0.15, nineLives: 0.2 }, abilities: ['claw', 'pounce', 'purr', 'swift_strike', 'acrobatic_dodge', 'nine_lives'] },
    5: { ...createEvolutionStage(5, 'Shadow Cat', 'Cat of darkness and stealth', EVOLUTION_PHASES.BABY, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.14, spd: 0.14, evasion: 0.08 }, abilities: ['claw', 'pounce', 'purr', 'shadow_strike'] },
    6: { ...createEvolutionStage(6, 'Shadow Cat', 'Master of darkness and stealth', EVOLUTION_PHASES.YOUNG, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.24, spd: 0.22, def: 0.04, evasion: 0.12 }, abilities: ['claw', 'pounce', 'purr', 'shadow_strike', 'nightfall', 'shadow_clone'] },
    7: { ...createEvolutionStage(7, 'Shadow Cat', 'One with the darkness', EVOLUTION_PHASES.ADULT, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.34, spd: 0.32, def: 0.08, evasion: 0.18, luck: 0.08 }, abilities: ['claw', 'pounce', 'purr', 'shadow_strike', 'nightfall', 'shadow_clone', 'shadow_leap'] },
    8: { ...createEvolutionStage(8, 'Shadow Cat', 'Ancient darkness given feline form', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.UNCOMMON), bonuses: { atk: 0.44, spd: 0.42, def: 0.12, evasion: 0.25, luck: 0.15, voidStep: 0.3 }, abilities: ['claw', 'pounce', 'purr', 'shadow_strike', 'nightfall', 'shadow_clone', 'shadow_leap', 'void_walk'] },
    9: { ...createEvolutionStage(9, 'Void Cat', 'Feline transcending all reality', EVOLUTION_PHASES.ELDER, EVOLUTION_RARITY.SUPERNATURAL), bonuses: { atk: 0.64, spd: 0.62, def: 0.2, evasion: 0.4, luck: 0.3, infiniteGrace: 0.9, voidStep: 1.0 }, abilities: ['claw', 'pounce', 'purr', 'shadow_strike', 'nightfall', 'shadow_clone', 'shadow_leap', 'void_walk', 'reality_claw', 'infinity_leap'] }
  },

  legendaryForm: { number: 10, name: 'Celestial Cat', description: 'Divine feline blessed by fortune itself', growth: EVOLUTION_PHASES.ELDER, rarity: EVOLUTION_RARITY.LEGENDARY, epCost: 2400, requirements: { minLevel: 45, minStats: { atk: 55, def: 30, spd: 65 }, minBattlesWon: 500, epThreshold: 4000, rareItems: 3 }, bonuses: { atk: 0.4, spd: 0.45, def: 0.08, luck: 0.45, celestialGrace: 0.7 }, abilities: ['claw', 'pounce', 'purr', 'swift_strike', 'acrobatic_dodge', 'nine_lives', 'stellar_grace'] },
  ancientForm: { number: 11, name: 'Primordial Cat', description: 'Ancient feline from creation\'s age, keeper of grace', growth: EVOLUTION_PHASES.ELDER, rarity: EVOLUTION_RARITY.ANCIENT, epCost: 3600, requirements: { minLevel: 65, minStats: { atk: 80, def: 50, spd: 90 }, minBattlesWon: 1500, epThreshold: 7500, rareItems: 5, timePlayed: 500 }, bonuses: { atk: 0.6, spd: 0.65, def: 0.15, luck: 0.6, primalGrace: 1.0, ancestralAgility: 0.8 }, abilities: ['claw', 'pounce', 'purr', 'swift_strike', 'acrobatic_dodge', 'nine_lives', 'primal_grace'] },
  supernaturalForm: { number: 12, name: 'Entity of Grace', description: 'Incomprehensible being of infinite speed and fortune', growth: EVOLUTION_PHASES.ELDER, rarity: EVOLUTION_RARITY.SUPERNATURAL, epCost: 6000, requirements: { minLevel: 100, minStats: { atk: 155, def: 100, spd: 165 }, minBattlesWon: 3000, epThreshold: 15000, rareItems: 10, timePlayed: 1000, specialItems: ['essence_of_chaos', 'void_crystal', 'eternal_flame'] }, bonuses: { atk: 1.0, spd: 1.3, def: 0.28, luck: 0.9, supernaturalGrace: 2.3, voidAgility: 2.0, infiniteFortune: 1.0 }, abilities: ['claw', 'pounce', 'void_claw', 'reality_leap', 'void_phase', 'chaos_grace', 'infinity_speed'] },

  statUpgrades: {
    swiftness: { name: 'Swiftness', description: 'Increases speed and agility', costPerPoint: 2, maxPoints: 55, effect: (points) => ({ spd: points * 0.14, evasion: points * 0.004 }) },
    sharpness: { name: 'Sharpness', description: 'Increases attack and claw damage', costPerPoint: 2, maxPoints: 50, effect: (points) => ({ atk: points * 0.11, critChance: points * 0.003 }) },
    fortune: { name: 'Fortune', description: 'Increases luck and critical hits', costPerPoint: 3, maxPoints: 40, effect: (points) => ({ luck: points * 0.008, critChance: points * 0.004 }) }
  }
};
