import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radiation, Shield, Target, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToxicButton } from './toxic-button';

interface TerminalTypewriterProps {
  showBootSequence?: boolean;
  showQuestionnaire?: boolean;
  onTypingComplete?: () => void;
  onRoleSelect?: (role: "bounty-hunter" | "survivor") => void;
  selectedRole?: "bounty-hunter" | "survivor" | null;
}

export function TerminalTypewriter({
  showBootSequence = false,
  showQuestionnaire = false,
  onTypingComplete,
  onRoleSelect,
  selectedRole
}: TerminalTypewriterProps) {
  const [text, setText] = useState<string>('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showSurveyQuestions, setShowSurveyQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Boot sequence text
  const bootSequenceLines = [
    ">> INITIALIZING RESISTANCE NETWORK TERMINAL v2.3",
    ">> ESTABLISHING SECURE CONNECTION...",
    ">> SCANNING FOR HOSTILE ENTITIES...",
    ">> RADIATION LEVELS: CRITICAL",
    ">> MUTANT ACTIVITY DETECTED IN SECTORS 7, 12, 19",
    ">> SETTLEMENT DEFENSE SYSTEMS: ONLINE",
    ">> RESOURCE ALLOCATION: OPTIMIZED",
    ">> BOUNTY HUNTER NETWORK: ACTIVE",
    ">> SURVIVOR REGISTRY: OPERATIONAL",
    ">> EMERGENCY PROTOCOLS: STANDBY",
    ">> TERMINAL READY",
    ">> WELCOME TO THE RESISTANCE NETWORK",
    ">> AWAITING AUTHENTICATION..."
  ];

  // Survey questions
  const surveyQuestions = [
    "INITIALIZING PERSONALITY ASSESSMENT...",
    "In the wasteland, do you prefer to work alone or with others?",
    "When faced with danger, do you confront it head-on or find a strategic approach?",
    "What's more important to you: justice or survival?",
    "Do you believe in second chances for those who've wronged others?",
    "Would you risk your life to save a stranger?",
    "ANALYSIS COMPLETE. PLEASE SELECT YOUR ROLE:"
  ];

  // Typing effect
  useEffect(() => {
    if (!isTyping) return;

    let lines: string[] = [];
    if (showBootSequence) {
      lines = bootSequenceLines;
    } else if (showQuestionnaire && showSurveyQuestions) {
      lines = [surveyQuestions[currentQuestionIndex]];
    }

    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      if (showBootSequence && onTypingComplete) {
        onTypingComplete();
      }
      if (showQuestionnaire && currentQuestionIndex === 0) {
        setTimeout(() => {
          setCurrentQuestionIndex(1);
          setIsTyping(true);
        }, 500);
      }
      if (showQuestionnaire && currentQuestionIndex === surveyQuestions.length - 1) {
        setShowRoleSelection(true);
      }
      return;
    }

    const currentLine = lines[currentLineIndex];
    const timer = setTimeout(() => {
      if (text.length < currentLine.length) {
        setText(currentLine.substring(0, text.length + 1));
      } else {
        setText('');
        setCurrentLineIndex(prevIndex => prevIndex + 1);
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [
    text, 
    currentLineIndex, 
    isTyping, 
    showBootSequence, 
    showQuestionnaire, 
    showSurveyQuestions, 
    currentQuestionIndex, 
    onTypingComplete
  ]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text, currentLineIndex, showRoleSelection]);

  // Show questionnaire after boot sequence
  useEffect(() => {
    if (showQuestionnaire && !showBootSequence) {
      setShowSurveyQuestions(true);
    }
  }, [showQuestionnaire, showBootSequence]);

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < surveyQuestions.length - 2) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsTyping(true);
      setText('');
    } else {
      setCurrentQuestionIndex(surveyQuestions.length - 1);
      setIsTyping(true);
      setText('');
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: "bounty-hunter" | "survivor") => {
    if (onRoleSelect) {
      onRoleSelect(role);
    }
  };

  return (
    <div className="terminal-typewriter h-full flex flex-col">
      <div 
        ref={containerRef}
        className="terminal-output flex-grow overflow-y-auto p-2 font-mono text-sm text-toxic-neon/90 space-y-1"
      >
        {/* Display boot sequence */}
        {showBootSequence && bootSequenceLines.slice(0, currentLineIndex).map((line, index) => (
          <div key={index} className="mb-1">{line}</div>
        ))}
        
        {/* Display current typing text */}
        {isTyping && (
          <div>
            {text}
            {showCursor && <span className="cursor">_</span>}
          </div>
        )}
        
        {/* Display survey questions and answers */}
        {showQuestionnaire && showSurveyQuestions && !showBootSequence && (
          <>
            {surveyQuestions.slice(0, Math.min(currentQuestionIndex, surveyQuestions.length - 1)).map((question, index) => (
              <div key={index} className="mb-3">
                <div className="text-toxic-neon mb-1">{question}</div>
                {index > 0 && answers[index - 1] && (
                  <div className="text-white/70 pl-4">
                    <span className="text-toxic-neon/70">{'>'}</span> {answers[index - 1]}
                  </div>
                )}
              </div>
            ))}
            
            {/* Current question */}
            {currentQuestionIndex > 0 && currentQuestionIndex < surveyQuestions.length - 1 && (
              <div className="mb-4">
                <div className="text-toxic-neon mb-2">{surveyQuestions[currentQuestionIndex]}</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {currentQuestionIndex === 1 && (
                    <>
                      <button 
                        onClick={() => handleAnswerSelect("Alone")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">A:</span> Alone
                      </button>
                      <button 
                        onClick={() => handleAnswerSelect("With others")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">B:</span> With others
                      </button>
                    </>
                  )}
                  
                  {currentQuestionIndex === 2 && (
                    <>
                      <button 
                        onClick={() => handleAnswerSelect("Head-on")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">A:</span> Head-on
                      </button>
                      <button 
                        onClick={() => handleAnswerSelect("Strategic approach")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">B:</span> Strategic approach
                      </button>
                    </>
                  )}
                  
                  {currentQuestionIndex === 3 && (
                    <>
                      <button 
                        onClick={() => handleAnswerSelect("Justice")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">A:</span> Justice
                      </button>
                      <button 
                        onClick={() => handleAnswerSelect("Survival")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">B:</span> Survival
                      </button>
                    </>
                  )}
                  
                  {currentQuestionIndex === 4 && (
                    <>
                      <button 
                        onClick={() => handleAnswerSelect("Yes")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">A:</span> Yes
                      </button>
                      <button 
                        onClick={() => handleAnswerSelect("No")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">B:</span> No
                      </button>
                    </>
                  )}
                  
                  {currentQuestionIndex === 5 && (
                    <>
                      <button 
                        onClick={() => handleAnswerSelect("Yes")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">A:</span> Yes
                      </button>
                      <button 
                        onClick={() => handleAnswerSelect("No")}
                        className="p-2 border border-toxic-neon/30 rounded bg-black/50 text-white hover:bg-toxic-neon/20 transition-colors text-left"
                      >
                        <span className="text-toxic-neon/70">B:</span> No
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Role selection */}
        {showRoleSelection && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <div className="text-toxic-neon mb-4">{surveyQuestions[surveyQuestions.length - 1]}</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={cn(
                    "border rounded-md overflow-hidden",
                    selectedRole === "bounty-hunter" 
                      ? "border-toxic-neon shadow-[0_0_10px_rgba(57,255,20,0.3)]" 
                      : "border-toxic-neon/30 hover:border-toxic-neon/60"
                  )}
                >
                  <div className="bg-black/60 p-4">
                    <div className="w-12 h-12 rounded-full bg-black/80 border border-toxic-neon/50 flex items-center justify-center mb-3">
                      <Target className="w-6 h-6 text-toxic-neon" />
                    </div>
                    
                    <h3 className="text-toxic-neon text-lg font-mono mb-2 flex items-center">
                      BOUNTY HUNTER
                      {selectedRole === "bounty-hunter" && (
                        <ChevronRight className="ml-1 w-5 h-5" />
                      )}
                    </h3>
                    
                    <p className="text-white/70 text-sm mb-4">
                      Track down crypto criminals and mutants for rewards. Protect settlements and recover stolen assets.
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Combat Focus</span>
                        <span className="text-toxic-neon">High</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Resource Rewards</span>
                        <span className="text-toxic-neon">High</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Community Building</span>
                        <span className="text-white/60">Low</span>
                      </div>
                    </div>
                    
                    <ToxicButton 
                      onClick={() => handleRoleSelect("bounty-hunter")}
                      className="w-full"
                      variant={selectedRole === "bounty-hunter" ? "default" : "outline"}
                    >
                      {selectedRole === "bounty-hunter" ? "SELECTED" : "SELECT ROLE"}
                    </ToxicButton>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={cn(
                    "border rounded-md overflow-hidden",
                    selectedRole === "survivor" 
                      ? "border-toxic-neon shadow-[0_0_10px_rgba(57,255,20,0.3)]" 
                      : "border-toxic-neon/30 hover:border-toxic-neon/60"
                  )}
                >
                  <div className="bg-black/60 p-4">
                    <div className="w-12 h-12 rounded-full bg-black/80 border border-toxic-neon/50 flex items-center justify-center mb-3">
                      <Shield className="w-6 h-6 text-toxic-neon" />
                    </div>
                    
                    <h3 className="text-toxic-neon text-lg font-mono mb-2 flex items-center">
                      SURVIVOR
                      {selectedRole === "survivor" && (
                        <ChevronRight className="ml-1 w-5 h-5" />
                      )}
                    </h3>
                    
                    <p className="text-white/70 text-sm mb-4">
                      Build and strengthen settlements. Develop infrastructure and support the resistance network.
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Combat Focus</span>
                        <span className="text-white/60">Low</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Resource Gathering</span>
                        <span className="text-toxic-neon">Medium</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Community Building</span>
                        <span className="text-toxic-neon">High</span>
                      </div>
                    </div>
                    
                    <ToxicButton 
                      onClick={() => handleRoleSelect("survivor")}
                      className="w-full"
                      variant={selectedRole === "survivor" ? "default" : "outline"}
                    >
                      {selectedRole === "survivor" ? "SELECTED" : "SELECT ROLE"}
                    </ToxicButton>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      
      <style>
        {`
        .terminal-output::-webkit-scrollbar {
          width: 8px;
        }
        
        .terminal-output::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .terminal-output::-webkit-scrollbar-thumb {
          background: rgba(57, 255, 20, 0.3);
          border-radius: 4px;
        }
        
        .terminal-output::-webkit-scrollbar-thumb:hover {
          background: rgba(57, 255, 20, 0.5);
        }
        
        .cursor {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        `}
      </style>
    </div>
  );
}
