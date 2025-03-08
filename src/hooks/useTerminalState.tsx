
import { useState, useEffect } from 'react';

export type TerminalState = 
  | 'locked'             // Initial locked state
  | 'initializing'       // Terminal boot sequence
  | 'auth-required'      // Showing password/connect options
  | 'breach-sequence'    // Running breach animation
  | 'authorized'         // Access granted, showing marketplace
  | 'error'              // Error state

interface UseTerminalStateProps {
  skipToMarketplace?: boolean;
  isConnected?: boolean;
}

export function useTerminalState({ 
  skipToMarketplace = false,
  isConnected = false
}: UseTerminalStateProps = {}) {
  const [terminalState, setTerminalState] = useState<TerminalState>(
    skipToMarketplace ? 'authorized' : 'locked'
  );
  
  // Listen for wallet connection state
  useEffect(() => {
    if (isConnected && terminalState === 'auth-required') {
      // When wallet connects, trigger breach sequence
      setTerminalState('breach-sequence');
    }
  }, [isConnected, terminalState]);
  
  // Start initialization sequence when terminal loads
  useEffect(() => {
    if (terminalState === 'locked') {
      // Start initialization after a short delay
      const timer = setTimeout(() => {
        setTerminalState('initializing');
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (terminalState === 'initializing') {
      // Move to auth required state after initialization completes
      const timer = setTimeout(() => {
        setTerminalState('auth-required');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [terminalState]);
  
  const handlePasswordSuccess = () => {
    // Password correct - trigger breach sequence
    setTerminalState('breach-sequence');
  };
  
  const handleBreachComplete = () => {
    // Breach animation complete - show marketplace
    setTerminalState('authorized');
  };
  
  return {
    terminalState,
    setTerminalState,
    handlePasswordSuccess,
    handleBreachComplete
  };
}
