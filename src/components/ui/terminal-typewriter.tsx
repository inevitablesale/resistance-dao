
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalTypewriterProps {
  textToType: string;
  isConnected: boolean;
  onConnect: () => void;
  typingSpeed?: number;
  className?: string;
}

export const TerminalTypewriter = ({
  textToType,
  isConnected,
  onConnect,
  typingSpeed = 50,
  className = '',
}: TerminalTypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Handle cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  // Handle text typing effect when connected
  useEffect(() => {
    if (!isConnected || isTyping) return;
    
    setIsTyping(true);
    
    const typeNextChar = () => {
      if (currentIndex < textToType.length) {
        setDisplayedText(prev => prev + textToType.charAt(currentIndex));
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        setIsTyping(false);
      }
    };
    
    const typingInterval = setInterval(typeNextChar, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [isConnected, currentIndex, textToType, typingSpeed, isTyping]);

  // Reset typing when disconnected
  useEffect(() => {
    if (!isConnected) {
      setDisplayedText('');
      setCurrentIndex(0);
      setIsTyping(false);
    }
  }, [isConnected]);

  return (
    <div className={`terminal-container ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 bg-black/90 border border-apocalypse-red/50 rounded-md overflow-hidden font-mono">
        <AlertTriangle className="h-5 w-5 text-apocalypse-red animate-pulse" />
        <div className="overflow-hidden w-full">
          {!isConnected ? (
            <div className="flex items-center justify-center">
              <Lock className="h-4 w-4 mr-2 text-apocalypse-red animate-pulse" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onConnect}
                className="text-apocalypse-red hover:text-white hover:bg-apocalypse-red/20 px-3 py-1 h-auto text-xs font-mono"
              >
                WOPR MAINFRAME: CONNECT WALLET TO DECRYPT EMERGENCY TRANSMISSION
              </Button>
              <Lock className="h-4 w-4 ml-2 text-apocalypse-red animate-pulse" />
            </div>
          ) : (
            <div className="typing-text flex items-start text-apocalypse-red">
              <Unlock className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center font-bold mb-1">
                  <span className="mr-2 tracking-wider">WOPR MAINFRAME:</span>
                  <span className="text-xs text-apocalypse-red/70">[DECRYPTION COMPLETE]</span>
                </div>
                <div className="flex">
                  <span>{displayedText}</span>
                  <span className={`cursor h-4 w-2 bg-apocalypse-red ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                </div>
              </div>
            </div>
          )}
        </div>
        <AlertTriangle className="h-5 w-5 text-apocalypse-red animate-pulse" />
      </div>
      <div className={`h-[2px] bg-gradient-to-r ${isConnected ? 'from-black via-apocalypse-red to-black animate-gradient' : 'from-black via-apocalypse-red/30 to-black'}`}></div>
    </div>
  );
};
