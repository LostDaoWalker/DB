import { EVOLUTION_PHASES as P, EVOLUTION_RARITY as R, createEvolution } from './evolutions.js';

const RABBIT_EVOLUTIONS = [
  { phases: [
    { name: 'Rabbit', phase: P.BABY, bonuses: {}, abilities: ['dodge', 'burrow'] },
    { name: 'Rabbit', phase: P.YOUNG, bonuses: { spd: 0.12, def: 0.03 }, abilities: ['dodge', 'burrow', 'hop'] },
    { name: 'Rabbit', phase: P.ADULT, bonuses: { spd: 0.15, def: 0.05 }, abilities: ['dodge', 'burrow', 'hop', 'evade'] },
    { name: 'Rabbit', phase: P.ELDER, bonuses: { spd: 0.18, def: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'evade', 'master'] }
  ], rarity: R.COMMON },
  
  { phases: [
    { name: 'Shadow Rabbit', phase: P.BABY, bonuses: { spd: 0.2, evasion: 0.05 }, abilities: ['dodge', 'burrow', 'hop', 'shadow'] },
    { name: 'Shadow Rabbit', phase: P.YOUNG, bonuses: { spd: 0.28, def: 0.04, evasion: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'shadow', 'step'] },
    { name: 'Shadow Rabbit', phase: P.ADULT, bonuses: { spd: 0.35, def: 0.06, evasion: 0.18, luck: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'shadow', 'step', 'void'] },
    { name: 'Shadow Rabbit', phase: P.ELDER, bonuses: { spd: 0.42, def: 0.08, evasion: 0.25, luck: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'shadow', 'step', 'void', 'darkness'] }
  ], rarity: R.UNCOMMON },
  
  { phases: [
    { name: 'Lunar Rabbit', phase: P.BABY, bonuses: { spd: 0.18, def: 0.06, luck: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'lunar'] },
    { name: 'Lunar Rabbit', phase: P.YOUNG, bonuses: { spd: 0.26, def: 0.08, evasion: 0.1, luck: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'lunar', 'tide', 'moon'] },
    { name: 'Lunar Rabbit', phase: P.ADULT, bonuses: { spd: 0.34, def: 0.1, evasion: 0.16, luck: 0.16 }, abilities: ['dodge', 'burrow', 'hop', 'lunar', 'tide', 'moon', 'celestial'] },
    { name: 'Lunar Rabbit', phase: P.ELDER, bonuses: { spd: 0.42, def: 0.13, evasion: 0.22, luck: 0.22 }, abilities: ['dodge', 'burrow', 'hop', 'lunar', 'tide', 'moon', 'celestial', 'cosmic'] }
  ], rarity: R.UNCOMMON },
  
  { phases: [
    { name: 'Storm Rabbit', phase: P.BABY, bonuses: { spd: 0.22, atk: 0.06 }, abilities: ['dodge', 'burrow', 'hop', 'lightning'] },
    { name: 'Storm Rabbit', phase: P.YOUNG, bonuses: { spd: 0.32, atk: 0.12, def: 0.02 }, abilities: ['dodge', 'burrow', 'hop', 'lightning', 'storm', 'electric'] },
    { name: 'Storm Rabbit', phase: P.ADULT, bonuses: { spd: 0.40, atk: 0.16, def: 0.04 }, abilities: ['dodge', 'burrow', 'hop', 'lightning', 'storm', 'electric', 'thunder'] },
    { name: 'Storm Rabbit', phase: P.ELDER, bonuses: { spd: 0.50, atk: 0.22, def: 0.07 }, abilities: ['dodge', 'burrow', 'hop', 'lightning', 'storm', 'electric', 'thunder', 'hurricane'] }
  ], rarity: R.UNCOMMON },
  
  { phases: [
    { name: 'Crystal Rabbit', phase: P.BABY, bonuses: { def: 0.08, spd: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'crystal'] },
    { name: 'Crystal Rabbit', phase: P.YOUNG, bonuses: { def: 0.14, spd: 0.16, evasion: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'crystal', 'reflect', 'gem'] },
    { name: 'Crystal Rabbit', phase: P.ADULT, bonuses: { def: 0.20, spd: 0.20, evasion: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'crystal', 'reflect', 'gem', 'prism'] },
    { name: 'Crystal Rabbit', phase: P.ELDER, bonuses: { def: 0.28, spd: 0.26, evasion: 0.18 }, abilities: ['dodge', 'burrow', 'hop', 'crystal', 'reflect', 'gem', 'prism', 'eternal'] }
  ], rarity: R.RARE },
  
  { phases: [
    { name: 'Inferno Rabbit', phase: P.BABY, bonuses: { atk: 0.12, spd: 0.10 }, abilities: ['dodge', 'burrow', 'hop', 'flame'] },
    { name: 'Inferno Rabbit', phase: P.YOUNG, bonuses: { atk: 0.20, spd: 0.14, def: 0.03 }, abilities: ['dodge', 'burrow', 'hop', 'flame', 'inferno', 'fire'] },
    { name: 'Inferno Rabbit', phase: P.ADULT, bonuses: { atk: 0.28, spd: 0.18, def: 0.06 }, abilities: ['dodge', 'burrow', 'hop', 'flame', 'inferno', 'fire', 'magma'] },
    { name: 'Inferno Rabbit', phase: P.ELDER, bonuses: { atk: 0.36, spd: 0.24, def: 0.09 }, abilities: ['dodge', 'burrow', 'hop', 'flame', 'inferno', 'fire', 'magma', 'eternal'] }
  ], rarity: R.RARE },
  
  { phases: [
    { name: 'Primal Rabbit', phase: P.BABY, bonuses: { atk: 0.10, def: 0.08, spd: 0.14 }, abilities: ['dodge', 'burrow', 'hop', 'primal'] },
    { name: 'Primal Rabbit', phase: P.YOUNG, bonuses: { atk: 0.18, def: 0.12, spd: 0.20 }, abilities: ['dodge', 'burrow', 'hop', 'primal', 'ancestral', 'earth'] },
    { name: 'Primal Rabbit', phase: P.ADULT, bonuses: { atk: 0.26, def: 0.16, spd: 0.28 }, abilities: ['dodge', 'burrow', 'hop', 'primal', 'ancestral', 'earth', 'genesis'] },
    { name: 'Primal Rabbit', phase: P.ELDER, bonuses: { atk: 0.34, def: 0.22, spd: 0.36 }, abilities: ['dodge', 'burrow', 'hop', 'primal', 'ancestral', 'earth', 'genesis', 'roar'] }
  ], rarity: R.RARE },
  
  { phases: [
    { name: 'Spectral Rabbit', phase: P.BABY, bonuses: { evasion: 0.12, spd: 0.16, def: 0.04 }, abilities: ['dodge', 'burrow', 'hop', 'phase'] },
    { name: 'Spectral Rabbit', phase: P.YOUNG, bonuses: { evasion: 0.18, spd: 0.24, def: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'phase', 'ghost', 'spectral'] },
    { name: 'Spectral Rabbit', phase: P.ADULT, bonuses: { evasion: 0.26, spd: 0.32, def: 0.12 }, abilities: ['dodge', 'burrow', 'hop', 'phase', 'ghost', 'spectral', 'dimension'] },
    { name: 'Spectral Rabbit', phase: P.ELDER, bonuses: { evasion: 0.35, spd: 0.42, def: 0.16 }, abilities: ['dodge', 'burrow', 'hop', 'phase', 'ghost', 'spectral', 'dimension', 'spirit'] }
  ], rarity: R.EPIC },
  
  { phases: [
    { name: 'Void Rabbit', phase: P.BABY, bonuses: { spd: 0.40, evasion: 0.25, atk: 0.10 }, abilities: ['dodge', 'burrow', 'hop', 'void'] },
    { name: 'Void Rabbit', phase: P.YOUNG, bonuses: { spd: 0.50, evasion: 0.35, atk: 0.18, def: 0.08 }, abilities: ['dodge', 'burrow', 'hop', 'void', 'reality', 'void_cloak'] },
    { name: 'Void Rabbit', phase: P.ADULT, bonuses: { spd: 0.60, evasion: 0.50, atk: 0.28, def: 0.14 }, abilities: ['dodge', 'burrow', 'hop', 'void', 'reality', 'void_cloak', 'chaos'] },
    { name: 'Void Rabbit', phase: P.ELDER, bonuses: { spd: 0.75, evasion: 0.65, atk: 0.40, def: 0.20 }, abilities: ['dodge', 'burrow', 'hop', 'void', 'reality', 'void_cloak', 'chaos', 'eternity'] }
  ], rarity: R.SUPERNATURAL }
];

export const rabbitSpecies = {
  key: 'rabbit',
  name: 'Rabbit',
  baseStats: { hp: 22, atk: 7, def: 4, spd: 10 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 2 },

  evolutions: (() => {
    const evo = {};
    let stageNum = 1;
    
    RABBIT_EVOLUTIONS.forEach(evolution => {
      evolution.phases.forEach(phase => {
        evo[stageNum] = {
          ...createEvolution(stageNum, phase.name, phase.phase, evolution.rarity),
          bonuses: phase.bonuses,
          abilities: phase.abilities
        };
        stageNum++;
      });
    });
    
    return evo;
  })(),

  legendaryForm: {
    name: 'Celestial Rabbit',
    rarity: R.LEGENDARY,
    bonuses: { spd: 0.5, def: 0.12, evasion: 0.35, luck: 0.3 },
    abilities: ['dodge', 'burrow', 'hop', 'stellar']
  },

  ancientForm: {
    name: 'Primordial Rabbit',
    rarity: R.ANCIENT,
    bonuses: { spd: 0.7, def: 0.2, evasion: 0.45, luck: 0.4 },
    abilities: ['dodge', 'burrow', 'hop', 'primal', 'ancient', 'genesis']
  },

  supernaturalForm: {
    name: 'Entity of Eternity',
    rarity: R.SUPERNATURAL,
    bonuses: { spd: 1.2, def: 0.4, evasion: 0.7, luck: 0.6 },
    abilities: ['dodge', 'burrow', 'hop', 'void', 'reality', 'chaos', 'infinity']
  },

  statUpgrades: {
    agility: { name: 'Agility', costPerPoint: 2, maxPoints: 50, effect: (p) => ({ spd: p * 0.12, evasion: p * 0.004 }) },
    luck: { name: 'Luck', costPerPoint: 3, maxPoints: 40, effect: (p) => ({ critChance: p * 0.003, luckBonus: p * 0.005 }) },
    endurance: { name: 'Endurance', costPerPoint: 2, maxPoints: 45, effect: (p) => ({ def: p * 0.08, stamina: p * 0.01 }) }
  }
};
