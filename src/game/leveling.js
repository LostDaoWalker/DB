export function levelFromXp(xp) {
  let level = 1;
  let remaining = Math.max(0, Math.floor(xp));
  while (remaining >= xpForNext(level)) {
    remaining -= xpForNext(level);
    level += 1;
    if (level >= 100) break;
  }
  return { level, xpIntoLevel: remaining };
}

export function xpForNext(level) {
  const L = Math.max(1, Math.floor(level));
  // Cozy curve: quick early levels, gently ramps.
  return 30 + (L - 1) * 12 + (L - 1) * (L - 1) * 2;
}

export function applyXp(totalXp, gainedXp) {
  const currentLevel = levelFromXp(totalXp).level;
  const nextTotal = Math.max(0, Math.floor(totalXp) + Math.max(0, Math.floor(gainedXp)));
  const newLevelInfo = levelFromXp(nextTotal);

  // Calculate EP gained from leveling up
  let epGained = 0;
  if (newLevelInfo.level > currentLevel) {
    // Grant EP for each level gained
    for (let level = currentLevel + 1; level <= newLevelInfo.level; level++) {
      epGained += epRewardForLevel(level);
    }
  }

  return {
    totalXp: nextTotal,
    epGained,
    leveledUp: newLevelInfo.level > currentLevel,
    ...newLevelInfo,
  };
}

// EP rewards for leveling up - increases with level for progression feel
export function epRewardForLevel(level) {
  // Base EP per level, with bonus scaling
  const baseEP = 5;
  const levelBonus = Math.floor((level - 1) / 10); // Bonus every 10 levels
  return baseEP + levelBonus;
}

// Get total EP cost for evolving to a specific animal
export function epCostForEvolution(evolvedAnimalKey) {
  const evolutionCosts = {
    // Mythical animals - very expensive
    'dragon': 500,
    'phoenix': 450,
    'unicorn': 400,
    'griffin': 350,
    'leviathan': 300,

    // Ancient animals - expensive
    't_rex': 250,
    'mammoth': 200,
    'saber_tooth': 180,
    'triceratops': 160,
    'stegosaurus': 150,

    // Legendary animals - moderately expensive
    'wolf': 100,
    'bear': 80,
    'eagle': 70,
    'shark': 60,
    'lion': 50,
  };

  return evolutionCosts[evolvedAnimalKey] || 100; // Default cost
}
