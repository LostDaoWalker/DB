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

// Get total EP cost for evolving to a specific animal - PROPER TIERED COSTS
export function epCostForEvolution(evolvedAnimalKey) {
  const evolutionCosts = {
    // Mythical animals (supernatural creatures - THOUSANDS of EP)
    'dragon': 8000,
    'phoenix': 7500,
    'unicorn': 7000,
    'griffin': 6500,
    'leviathan': 6000,

    // Ancient animals (prehistoric creatures - mid-tier)
    't_rex': 600,
    'mammoth': 500,
    'saber_tooth': 450,
    'triceratops': 400,
    'stegosaurus': 380,

    // Legendary animals (enhanced real animals - entry-tier)
    'wolf': 200,
    'bear': 320,
    'eagle': 280,
    'shark': 240,
    'lion': 200,
  };

  return evolutionCosts[evolvedAnimalKey] || 400; // Default high cost
}
