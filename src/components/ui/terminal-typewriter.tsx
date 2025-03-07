
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
  
  const firstPartOfMessage = "EMERGENCY BROADCAST: SURVIVORS DETECTED... IF YOU CAN READ THIS, YOU'RE STILL ALIVE. WE'VE BEEN SEARCHING FOR OTHERS SINCE THE COLLAPSE. ";
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

  // Function to parse the displayed text and render the ENTER button inline
  const renderDisplayedText = () => {
    const enterButtonIndex = displayedText.indexOf('[ENTER]');
    
    if (enterButtonIndex === -1) {
      return <span>{displayedText}</span>;
    }
    
    return (
      <>
        <span>{displayedText.substring(0, enterButtonIndex)}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEnterClick}
          className="px-2 py-0 h-auto text-xs font-mono bg-apocalypse-red/30 hover:bg-apocalypse-red/50 text-apocalypse-red mx-1 border border-apocalypse-red/50"
        >
          ENTER
        </Button>
        <span>{displayedText.substring(enterButtonIndex + 7)}</span>
      </>
    );
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
                  <div className="animate-flicker bg-black/80 px-3 py-1 rounded-full border border-apocalypse-red/30 inline-flex w-auto mb-1">
                    <div className="w-2 h-2 rounded-full bg-apocalypse-red mr-2"></div>
                    <span className="text-toxic-green">Network Status:</span> 
                    <span className="text-apocalypse-red font-bold ml-2">Critical</span>
                  </div>
                  <div className="flex">
                    {renderDisplayedText()}
                    <span className={`cursor h-4 w-2 bg-apocalypse-red ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                  </div>
                  <div className="mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onConnect}
                      className="text-apocalypse-red hover:text-white hover:bg-apocalypse-red/20 px-3 py-1 h-auto text-xs font-mono border border-apocalypse-red/50 animate-pulse"
                    >
                      CONNECT WALLET FOR SECURE TRANSMISSION
                    </Button>
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
                <div className="animate-flicker bg-black/80 px-3 py-1 rounded-full border border-apocalypse-red/30 inline-flex w-auto mb-1">
                  <div className="w-2 h-2 rounded-full bg-apocalypse-red mr-2"></div>
                  <span className="text-toxic-green">Network Status:</span> 
                  <span className="text-apocalypse-red font-bold ml-2">Critical</span>
                </div>
                <div className="flex">
                  {renderDisplayedText()}
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
