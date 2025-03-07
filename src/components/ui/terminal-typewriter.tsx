
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
  const [isTyping, setIsTyping] = useState(true); // Start typing immediately
  const [showFullMessage, setShowFullMessage] = useState(false);
  
  const firstPartOfMessage = "SURVIVORS DETECTED... IF YOU CAN READ THIS, YOU'RE STILL ALIVE. WE'VE BEEN SEARCHING FOR OTHERS SINCE THE COLLAPSE. THE CRYPTO NUCLEAR WINTER KILLED 90% OF PROTOCOLS. THOSE WHO REMAIN HAVE ADAPTED TO THE HARSH NEW REALITY. WE'VE BUILT SHELTERS FROM THE FALLOUT, PRESERVING WHAT'S LEFT OF DECENTRALIZED TECHNOLOGY. OUR COMMUNITY HAS GROWN STRONGER THROUGH ADVERSITY. ";
  const pressEnterMessage = "PRESS [ENTER] TO CONTINUE...";
  const remainingMessage = "THE RESISTANCE NEEDS YOUR HELP. THE OLD WORLD IS GONE. WE ARE BUILDING FROM THE ASHES. SHALL WE PLAY A GAME?";

  // Handle cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  // Handle text typing effect
  useEffect(() => {
    if (!isTyping) return;
    
    // Determine what text to show based on current state
    const textToShow = showFullMessage ? 
      (firstPartOfMessage + remainingMessage) : 
      (currentIndex >= firstPartOfMessage.length ? 
        firstPartOfMessage + pressEnterMessage :
        firstPartOfMessage.substring(0, currentIndex));
    
    const typeNextChar = () => {
      if (currentIndex < (showFullMessage ? (firstPartOfMessage + remainingMessage).length : firstPartOfMessage.length)) {
        setDisplayedText(textToShow.substring(0, currentIndex + 1));
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else if (!showFullMessage && currentIndex >= firstPartOfMessage.length) {
        // We've reached the point to show PRESS ENTER
        setDisplayedText(firstPartOfMessage + pressEnterMessage);
        setIsTyping(false);
      } else {
        setIsTyping(false);
      }
    };
    
    const typingInterval = setInterval(typeNextChar, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [currentIndex, typingSpeed, isTyping, showFullMessage, firstPartOfMessage, remainingMessage, pressEnterMessage]);

  const handleEnterClick = () => {
    if (!isTyping && !showFullMessage && currentIndex >= firstPartOfMessage.length) {
      setShowFullMessage(true);
      setCurrentIndex(0); // Reset to start typing the full message
      setIsTyping(true); // Allow the typing effect to restart
    }
  };

  return (
    <div className={`terminal-container ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 bg-black/90 border border-apocalypse-red/50 rounded-md overflow-hidden font-mono">
        <AlertTriangle className="h-5 w-5 text-apocalypse-red animate-pulse" />
        <div className="overflow-hidden w-full">
          {!isConnected ? (
            <div className="typing-text text-apocalypse-red">
              <div className="flex items-start">
                <Lock className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <div className="flex items-center font-bold mb-1">
                    <span className="mr-2 tracking-wider">EMERGENCY TRANSMISSION:</span>
                    <span className="text-xs text-apocalypse-red/70 animate-pulse">[SIGNAL WEAK]</span>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <span>{displayedText}</span>
                      {!isTyping && !showFullMessage && (
                        <span className={`cursor h-4 w-2 bg-apocalypse-red ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                      )}
                      {(isTyping || showFullMessage) && (
                        <span className={`cursor h-4 w-2 bg-apocalypse-red ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                      )}
                    </div>
                    {!isTyping && !showFullMessage && (
                      <div className="mt-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleEnterClick}
                          className="text-apocalypse-red hover:text-white hover:bg-apocalypse-red/20 px-4 py-2 h-auto text-xs font-mono border border-apocalypse-red/50 animate-pulse"
                        >
                          ENTER
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="typing-text flex items-start text-apocalypse-red">
              <Unlock className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center font-bold mb-1">
                  <span className="mr-2 tracking-wider">EMERGENCY TRANSMISSION:</span>
                  <span className="text-xs text-apocalypse-red/70">[SIGNAL SECURE]</span>
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
