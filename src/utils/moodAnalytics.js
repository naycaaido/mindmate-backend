const calculateMoodStability = (scores) => {
  if (!scores || scores.length < 2) return null;

  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const squaredDifferences = scores.map((score) => Math.pow(score - mean, 2));
  const variance =
    squaredDifferences.reduce((sum, diff) => sum + diff, 0) / scores.length;

  const standardDeviation = Math.sqrt(variance);
  const maxSD = 2.0;
  let stabilityPercentage = 100 - (standardDeviation / maxSD) * 100;

  return Math.max(0, Math.round(stabilityPercentage));
};

export { calculateMoodStability };
