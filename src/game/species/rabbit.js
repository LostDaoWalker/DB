import { EVOLUTION_PHASES as P, EVOLUTION_RARITY as R, createEvolution } from './evolutions.js';

export const rabbitSpecies = {
  key: 'rabbit',
  name: 'Rabbit',
  baseStats: { hp: 22, atk: 7, def: 4, spd: 10 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 2 },

  evolutions: {
    1: { ...createEvolution(1, 'Rabbit', P.BABY), bonuses: {}, abilities: ['dodge', 'burrow'] },
    2: { ...createEvolution(2, 'Rabbit', P.YOUNG), bonuses: { spd: 0.12, def: 0.03 }, abilities: ['dodge', 'burrow', 'hop'] },
    3: { ...createEvolution(3, 'Rabbit', P.ADULT), bonuses: { spd: 0.15, def: 0.05 }, abilities: ['dodge', 'burrow', 'hop', 'evade'] },
    4: { ...createEvolution(4, 'Rabbit', P.ELDER), bonuses: { spd: 0.18, def: 0.08, evasion: 0.1 }, abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master'] },

    5: { ...createEvolution(5, 'Shadow Rabbit', P.BABY, R.UNCOMMON), bonuses: { spd: 0.2, evasion: 0.05 }, abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak'] },
    6: { ...createEvolution(6, 'Shadow Rabbit', P.YOUNG, R.UNCOMMON), bonuses: { spd: 0.28, def: 0.04, evasion: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak', 'shadow_step'] },
    7: { ...createEvolution(7, 'Shadow Rabbit', P.ADULT, R.UNCOMMON), bonuses: { spd: 0.35, def: 0.06, evasion: 0.18, luck: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak', 'shadow_step', 'void_phase'] },
    8: { ...createEvolution(8, 'Shadow Rabbit', P.ELDER, R.UNCOMMON), bonuses: { spd: 0.42, def: 0.08, evasion: 0.25, luck: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'shadow_cloak', 'shadow_step', 'void_phase', 'eternal_darkness'] },

    9: { ...createEvolution(9, 'Lunar Rabbit', P.BABY, R.UNCOMMON), bonuses: { spd: 0.18, def: 0.06, luck: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'lunar_glow'] },
    10: { ...createEvolution(10, 'Lunar Rabbit', P.YOUNG, R.UNCOMMON), bonuses: { spd: 0.26, def: 0.08, evasion: 0.1, luck: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'lunar_glow', 'tide_hop', 'moon_blessing'] },
    11: { ...createEvolution(11, 'Lunar Rabbit', P.ADULT, R.UNCOMMON), bonuses: { spd: 0.34, def: 0.1, evasion: 0.16, luck: 0.16 }, abilities: ['dodge', 'burrow', 'hop', 'lunar_glow', 'tide_hop', 'moon_blessing', 'celestial_step'] },
    12: { ...createEvolution(12, 'Lunar Rabbit', P.ELDER, R.UNCOMMON), bonuses: { spd: 0.42, def: 0.13, evasion: 0.22, luck: 0.22 }, abilities: ['dodge', 'burrow', 'hop', 'lunar_glow', 'tide_hop', 'moon_blessing', 'celestial_step', 'cosmic_bound'] },

    13: { ...createEvolution(13, 'Storm Rabbit', P.BABY, R.UNCOMMON), bonuses: { spd: 0.22, atk: 0.06 }, abilities: ['dodge', 'burrow', 'hop', 'lightning_hop'] },
    14: { ...createEvolution(14, 'Storm Rabbit', P.YOUNG, R.UNCOMMON), bonuses: { spd: 0.32, atk: 0.12, def: 0.02 }, abilities: ['dodge', 'burrow', 'hop', 'lightning_hop', 'storm_dash', 'electric_aura'] },
    15: { ...createEvolution(15, 'Storm Rabbit', P.ADULT, R.UNCOMMON), bonuses: { spd: 0.40, atk: 0.16, def: 0.04 }, abilities: ['dodge', 'burrow', 'hop', 'lightning_hop', 'storm_dash', 'electric_aura', 'thunder_strike'] },
    16: { ...createEvolution(16, 'Storm Rabbit', P.ELDER, R.UNCOMMON), bonuses: { spd: 0.50, atk: 0.22, def: 0.07 }, abilities: ['dodge', 'burrow', 'hop', 'lightning_hop', 'storm_dash', 'electric_aura', 'thunder_strike', 'hurricane_bound'] },

    17: { ...createEvolution(17, 'Crystal Rabbit', P.BABY, R.RARE), bonuses: { def: 0.08, spd: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'crystal_shell'] },
    18: { ...createEvolution(18, 'Crystal Rabbit', P.YOUNG, R.RARE), bonuses: { def: 0.14, spd: 0.16, evasion: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'crystal_shell', 'reflect', 'gem_aura'] },
    19: { ...createEvolution(19, 'Crystal Rabbit', P.ADULT, R.RARE), bonuses: { def: 0.20, spd: 0.20, evasion: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'crystal_shell', 'reflect', 'gem_aura', 'prismatic_bound'] },
    20: { ...createEvolution(20, 'Crystal Rabbit', P.ELDER, R.RARE), bonuses: { def: 0.28, spd: 0.26, evasion: 0.18 }, abilities: ['dodge', 'burrow', 'hop', 'crystal_shell', 'reflect', 'gem_aura', 'prismatic_bound', 'eternal_crystal'] },

    21: { ...createEvolution(21, 'Inferno Rabbit', P.BABY, R.RARE), bonuses: { atk: 0.12, spd: 0.10 }, abilities: ['dodge', 'burrow', 'hop', 'flame_bite'] },
    22: { ...createEvolution(22, 'Inferno Rabbit', P.YOUNG, R.RARE), bonuses: { atk: 0.20, spd: 0.14, def: 0.03 }, abilities: ['dodge', 'burrow', 'hop', 'flame_bite', 'inferno_dash', 'fire_aura'] },
    23: { ...createEvolution(23, 'Inferno Rabbit', P.ADULT, R.RARE), bonuses: { atk: 0.28, spd: 0.18, def: 0.06 }, abilities: ['dodge', 'burrow', 'hop', 'flame_bite', 'inferno_dash', 'fire_aura', 'magma_strike'] },
    24: { ...createEvolution(24, 'Inferno Rabbit', P.ELDER, R.RARE), bonuses: { atk: 0.36, spd: 0.24, def: 0.09 }, abilities: ['dodge', 'burrow', 'hop', 'flame_bite', 'inferno_dash', 'fire_aura', 'magma_strike', 'eternal_flame'] },

    25: { ...createEvolution(25, 'Primal Rabbit', P.BABY, R.RARE), bonuses: { atk: 0.10, def: 0.08, spd: 0.14 }, abilities: ['dodge', 'burrow', 'hop', 'primal_strike'] },
    26: { ...createEvolution(26, 'Primal Rabbit', P.YOUNG, R.RARE), bonuses: { atk: 0.18, def: 0.12, spd: 0.20 }, abilities: ['dodge', 'burrow', 'hop', 'primal_strike', 'ancestral_leap', 'earth_bond'] },
    27: { ...createEvolution(27, 'Primal Rabbit', P.ADULT, R.RARE), bonuses: { atk: 0.26, def: 0.16, spd: 0.28 }, abilities: ['dodge', 'burrow', 'hop', 'primal_strike', 'ancestral_leap', 'earth_bond', 'genesis_bound'] },
    28: { ...createEvolution(28, 'Primal Rabbit', P.ELDER, R.RARE), bonuses: { atk: 0.34, def: 0.22, spd: 0.36 }, abilities: ['dodge', 'burrow', 'hop', 'primal_strike', 'ancestral_leap', 'earth_bond', 'genesis_bound', 'primal_roar'] },

    29: { ...createEvolution(29, 'Spectral Rabbit', P.BABY, R.EPIC), bonuses: { evasion: 0.12, spd: 0.16, def: 0.04 }, abilities: ['dodge', 'burrow', 'hop', 'phase_shift'] },
    30: { ...createEvolution(30, 'Spectral Rabbit', P.YOUNG, R.EPIC), bonuses: { evasion: 0.18, spd: 0.24, def: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'phase_shift', 'ghost_hop', 'spectral_cloak'] },
    31: { ...createEvolution(31, 'Spectral Rabbit', P.ADULT, R.EPIC), bonuses: { evasion: 0.26, spd: 0.32, def: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'phase_shift', 'ghost_hop', 'spectral_cloak', 'dimensional_leap'] },
    32: { ...createEvolution(32, 'Spectral Rabbit', P.ELDER, R.EPIC), bonuses: { evasion: 0.35, spd: 0.42, def: 0.16 }, abilities: ['dodge', 'burrow', 'hop', 'phase_shift', 'ghost_hop', 'spectral_cloak', 'dimensional_leap', 'spirit_bound'] },

    33: { ...createEvolution(33, 'Void Rabbit', P.BABY, R.SUPERNATURAL), bonuses: { spd: 0.40, evasion: 0.25, atk: 0.10 }, abilities: ['dodge', 'burrow', 'hop', 'void_phase'] },
    34: { ...createEvolution(34, 'Void Rabbit', P.YOUNG, R.SUPERNATURAL), bonuses: { spd: 0.50, evasion: 0.35, atk: 0.18, def: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'void_phase', 'reality_hop', 'void_cloak'] },
    35: { ...createEvolution(35, 'Void Rabbit', P.ADULT, R.SUPERNATURAL), bonuses: { spd: 0.60, evasion: 0.50, atk: 0.28, def: 0.14 }, abilities: ['dodge', 'burrow', 'hop', 'void_phase', 'reality_hop', 'void_cloak', 'chaos_bound'] },
    36: { ...createEvolution(36, 'Void Rabbit', P.ELDER, R.SUPERNATURAL), bonuses: { spd: 0.75, evasion: 0.65, atk: 0.40, def: 0.20 }, abilities: ['dodge', 'burrow', 'hop', 'void_phase', 'reality_hop', 'void_cloak', 'chaos_bound', 'eternity_bound', 'infinity_slip'] }
  },

  legendaryForm: {
    name: 'Celestial Rabbit',
    rarity: R.LEGENDARY,
    bonuses: { spd: 0.5, def: 0.12, evasion: 0.35, luck: 0.3 },
    abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'stellar_bound', 'lucky_bounce']
  },

  ancientForm: {
    name: 'Primordial Rabbit',
    rarity: R.ANCIENT,
    bonuses: { spd: 0.7, def: 0.2, evasion: 0.45, luck: 0.4 },
    abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'primal_dash', 'ancient_instinct', 'genesis_hop']
  },

  supernaturalForm: {
    name: 'Entity of Eternity',
    rarity: R.SUPERNATURAL,
    bonuses: { spd: 1.2, def: 0.4, evasion: 0.7, luck: 0.6 },
    abilities: ['dodge', 'burrow', 'hop', 'evade', 'warren_master', 'chaos_leap', 'void_phase', 'reality_warp', 'infinity_bound']
  },

  statUpgrades: {
    agility: { name: 'Agility', costPerPoint: 2, maxPoints: 50, effect: (p) => ({ spd: p * 0.12, evasion: p * 0.004 }) },
    luck: { name: 'Luck', costPerPoint: 3, maxPoints: 40, effect: (p) => ({ critChance: p * 0.003, luckBonus: p * 0.005 }) },
    endurance: { name: 'Endurance', costPerPoint: 2, maxPoints: 45, effect: (p) => ({ def: p * 0.08, stamina: p * 0.01 }) }
  }
};
