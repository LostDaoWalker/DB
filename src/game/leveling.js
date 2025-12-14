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
  const nextTotal = Math.max(0, Math.floor(totalXp) + Math.max(0, Math.floor(gainedXp)));
  return {
    totalXp: nextTotal,
    ...levelFromXp(nextTotal),
  };
}
