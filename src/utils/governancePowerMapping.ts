// Maps governance power levels to their corresponding IPFS CIDs
export const governancePowerToCID = {
  1: "QmYZK1vcxPkiPy8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YD", // Low governance power image
  2: "QmX9Z2X7vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YE", // Medium governance power image
  3: "QmW8Y3X6vKqPe8C4KuBhpT5RpqPe2UcDxrXpqJGBBF3YF"  // High governance power image
};

export const getGovernanceImageCID = (powerLevel: number): string => {
  // Ensure power level is within bounds (1-3)
  const normalizedPower = Math.max(1, Math.min(3, Math.floor(powerLevel)));
  return governancePowerToCID[normalizedPower as keyof typeof governancePowerToCID];
};