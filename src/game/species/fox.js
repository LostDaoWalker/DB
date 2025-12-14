export const foxSpecies = {
  key: 'fox',
  name: 'Fox',
  baseStats: { hp: 24, atk: 8, def: 4, spd: 8 },
  growthStats: { hp: 5, atk: 2, def: 1, spd: 1 },
  type: 'cunning',
  diet: 'carnivore',

  // Evolution stages with 5 growth phases each
  evolutions: {
    1: {
      name: 'Fox Kit',
      growth: 'baby',
      epCost: 0,
      description: 'Curious and playful, learning to hunt',
      bonuses: {},
      abilities: ['sneak', 'scavenge'],
      phases: [
        { name: 'Newborn', phase: 1, description: 'Just born, very vulnerable', bonusMultiplier: 0.2 },
        { name: 'Nursing', phase: 2, description: 'Learning to nurse and explore', bonusMultiplier: 0.4 },
        { name: 'Playful', phase: 3, description: 'Full of energy, discovering the world', bonusMultiplier: 0.6 },
        { name: 'Curious', phase: 4, description: 'Starting to hunt small prey', bonusMultiplier: 0.8 },
        { name: 'Ready', phase: 5, description: 'Prepared for the next stage of life', bonusMultiplier: 1.0 }
      ]
    },
    2: {
      name: 'Young Fox',
      growth: 'young',
      epCost: 100,
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
      },
      phases: [
        { name: 'Adolescent', phase: 1, description: 'Testing boundaries, learning survival', bonusMultiplier: 1.1 },
        { name: 'Apprentice Hunter', phase: 2, description: 'First successful hunts', bonusMultiplier: 1.2 },
        { name: 'Territory Explorer', phase: 3, description: 'Claiming hunting grounds', bonusMultiplier: 1.3 },
        { name: 'Skill Refiner', phase: 4, description: 'Perfecting hunting techniques', bonusMultiplier: 1.4 },
        { name: 'Young Adult', phase: 5, description: 'Ready to establish independence', bonusMultiplier: 1.5 }
      ]
    },
    3: {
      name: 'Adult Fox',
      growth: 'adult',
      epCost: 300,
      description: 'Prime of life, skilled hunter',
      bonuses: { spd: 0.15, atk: 0.1 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade'],
      phases: [
        { name: 'Established Hunter', phase: 1, description: 'Master of local hunting grounds', bonusMultiplier: 1.6 },
        { name: 'Family Provider', phase: 2, description: 'Supporting mate and offspring', bonusMultiplier: 1.7 },
        { name: 'Territory Defender', phase: 3, description: 'Protecting hunting territory fiercely', bonusMultiplier: 1.8 },
        { name: 'Seasoned Veteran', phase: 4, description: 'Years of hunting experience', bonusMultiplier: 1.9 },
        { name: 'Prime Specimen', phase: 5, description: 'At peak physical condition', bonusMultiplier: 2.0 }
      ]
    },
    4: {
      name: 'Elder Fox',
      growth: 'elder',
      epCost: 600,
      description: 'Wise and experienced, territory master',
      bonuses: { spd: 0.2, atk: 0.15, def: 0.1 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade', 'territory'],
      phases: [
        { name: 'Wise Mentor', phase: 1, description: 'Teaching younger foxes survival skills', bonusMultiplier: 2.1 },
        { name: 'Legendary Hunter', phase: 2, description: 'Known throughout the territory', bonusMultiplier: 2.2 },
        { name: 'Spiritual Guide', phase: 3, description: 'Connecting with fox ancestors', bonusMultiplier: 2.3 },
        { name: 'Eternal Guardian', phase: 4, description: 'Protecting foxkind legacy', bonusMultiplier: 2.4 },
        { name: 'Ascended Elder', phase: 5, description: 'Transcending physical limitations', bonusMultiplier: 2.5 }
      ]
    },
    5: {
      name: 'Fox Spirit',
      growth: 'legendary',
      epCost: 1200,
      description: 'Mythical being, guardian of the wild',
      bonuses: { spd: 0.3, atk: 0.25, def: 0.15, critChance: 0.15 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade', 'territory', 'spirit_walk'],
      phases: [
        { name: 'Spirit Awakening', phase: 1, description: 'First hints of spiritual power', bonusMultiplier: 2.6 },
        { name: 'Nature\'s Ally', phase: 2, description: 'Communing with forest spirits', bonusMultiplier: 2.7 },
        { name: 'Legendary Guardian', phase: 3, description: 'Protector of ancient woodlands', bonusMultiplier: 2.8 },
        { name: 'Mythical Wanderer', phase: 4, description: 'Walking between worlds', bonusMultiplier: 2.9 },
        { name: 'Eternal Spirit', phase: 5, description: 'Immortal guardian of foxkind', bonusMultiplier: 3.0 }
      ]
    },
    6: {
      name: 'Nine-Tailed Fox',
      growth: 'mythical',
      epCost: 2500,
      description: 'Ancient fox with multiple tails, master of illusions',
      bonuses: { spd: 0.35, atk: 0.3, def: 0.2, critChance: 0.25, multiStrike: 0.3 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade', 'territory', 'spirit_walk', 'multi_tail', 'perfect_illusion'],
      phases: [
        { name: 'Tail Manifestation', phase: 1, description: 'First additional tails appear', bonusMultiplier: 3.1 },
        { name: 'Illusion Weaver', phase: 2, description: 'Mastering deceptive arts', bonusMultiplier: 3.2 },
        { name: 'Ancient Trickster', phase: 3, description: 'Wisdom of centuries', bonusMultiplier: 3.3 },
        { name: 'Reality Shaper', phase: 4, description: 'Bending perception and truth', bonusMultiplier: 3.4 },
        { name: 'Ninefold Deity', phase: 5, description: 'Complete mastery of all tails', bonusMultiplier: 3.5 }
      ]
    },
    7: {
      name: 'Celestial Fox',
      growth: 'divine',
      epCost: 5000,
      description: 'Divine messenger of the heavens, weaver of fate',
      bonuses: { spd: 0.4, atk: 0.35, def: 0.25, critChance: 0.3, multiStrike: 0.4, fateWeaver: 0.5 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade', 'territory', 'spirit_walk', 'multi_tail', 'perfect_illusion', 'celestial_blessing', 'fate_manipulation'],
      phases: [
        { name: 'Star Communicator', phase: 1, description: 'Receiving celestial messages', bonusMultiplier: 3.6 },
        { name: 'Fate Weaver', phase: 2, description: 'Influencing destiny itself', bonusMultiplier: 3.7 },
        { name: 'Heavenly Envoy', phase: 3, description: 'Messenger of divine will', bonusMultiplier: 3.8 },
        { name: 'Cosmic Dancer', phase: 4, description: 'Moving between star systems', bonusMultiplier: 3.9 },
        { name: 'Divine Sovereign', phase: 5, description: 'Ruler of celestial foxes', bonusMultiplier: 4.0 }
      ]
    },
    8: {
      name: 'Primordial Fox',
      growth: 'primordial',
      epCost: 10000,
      description: 'The first fox, progenitor of all foxkind, master of creation and destruction',
      bonuses: { spd: 0.5, atk: 0.45, def: 0.35, critChance: 0.4, multiStrike: 0.6, fateWeaver: 0.7, creationForce: 1.0 },
      abilities: ['sneak', 'scavenge', 'pounce', 'evade', 'territory', 'spirit_walk', 'multi_tail', 'perfect_illusion', 'celestial_blessing', 'fate_manipulation', 'primordial_creation', 'reality_warping', 'eternal_guardian'],
      phases: [
        { name: 'Origin Seeker', phase: 1, description: 'Understanding the beginning of all things', bonusMultiplier: 4.1 },
        { name: 'Creation Forger', phase: 2, description: 'Shaping reality from nothing', bonusMultiplier: 4.2 },
        { name: 'Destruction Weaver', phase: 3, description: 'Master of endings and beginnings', bonusMultiplier: 4.3 },
        { name: 'Eternal Progenitor', phase: 4, description: 'Source of all fox life', bonusMultiplier: 4.4 },
        { name: 'Absolute Primordial', phase: 5, description: 'Beyond time, space, and reality itself', bonusMultiplier: 4.5 }
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
