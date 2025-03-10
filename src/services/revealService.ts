
/**
 * Service to handle character reveal state management
 */

// Check if a character has been revealed by the current user
export const isCharacterRevealed = (ipfsCID: string): boolean => {
  const revealedStatus = localStorage.getItem(`revealed-${ipfsCID}`);
  return revealedStatus === 'true';
};

// Mark a character as revealed
export const markCharacterRevealed = (ipfsCID: string): void => {
  localStorage.setItem(`revealed-${ipfsCID}`, 'true');
};

// Get all revealed characters
export const getRevealedCharacters = (): string[] => {
  const revealedCharacters: string[] = [];
  
  // Find all revealed character entries in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('revealed-') && localStorage.getItem(key) === 'true') {
      const ipfsCID = key.replace('revealed-', '');
      revealedCharacters.push(ipfsCID);
    }
  }
  
  return revealedCharacters;
};

// Calculate radiation reduction based on revealed characters
export const calculateRadiationReduction = (totalRevealed: number): number => {
  // Each character reduces radiation by 0.1%
  return totalRevealed * 0.1;
};
