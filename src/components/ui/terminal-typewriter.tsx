
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, Target, Shield, Terminal, Check } from "lucide-react";
import { ToxicButton } from "./toxic-button";

interface TerminalTypewriterProps {
  textToType?: string;
  typeDelay?: number;
  className?: string;
  showBootSequence?: boolean;
  onTypingComplete?: () => void;
  showQuestionnaire?: boolean;
  onRoleSelect?: (role: "bounty-hunter" | "survivor") => void;
  selectedRole?: "bounty-hunter" | "survivor" | null;
}

type BootStage = 
  | "initializing" 
  | "connecting" 
  | "complete";

// Simplified boot messages with fewer stages
const BOOT_MESSAGES = {
  initializing: [
    "SYSTEM INITIALIZING...",
    "RADIATION LEVELS: HIGH BUT TOLERABLE",
    "LOADING CORE MODULES..."
  ],
  connecting: [
    "ESTABLISHING SECURE CONNECTION...",
    "SCANNING FOR SURVIVOR OUTPOSTS...",
    "SYNCHRONIZING WITH WASTELAND ECONOMY..."
  ],
  complete: [
    "SYSTEM RECOVERY COMPLETE",
    "WELCOME TO THE RESISTANCE NETWORK"
  ]
};

// Simplified assessment questions with fewer options
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "You discover an abandoned bunker with valuable supplies. What's your first action?",
    options: [
      { 
        text: "Methodically search for traps and security systems before proceeding", 
        bountyHunterScore: 8, 
        survivorScore: 4 
      },
      { 
        text: "Assess what resources could benefit your community and retrieve them", 
        bountyHunterScore: 2, 
        survivorScore: 9 
      }
    ]
  },
  {
    id: 2,
    question: "How do you typically react when confronted with a dangerous situation?",
    options: [
      { 
        text: "Calculate risks rapidly and take decisive action, even if risky", 
        bountyHunterScore: 9, 
        survivorScore: 3 
      },
      { 
        text: "Find the safest approach for everyone involved, prioritizing group survival", 
        bountyHunterScore: 2, 
        survivorScore: 8 
      }
    ]
  },
  {
    id: 3,
    question: "What aspect of the post-apocalyptic world interests you most?",
    options: [
      { 
        text: "Rebuilding functional communities and sustainable resource networks", 
        bountyHunterScore: 2, 
        survivorScore: 9 
      },
      { 
        text: "Tracking down those responsible for the collapse and bringing justice", 
        bountyHunterScore: 10, 
        survivorScore: 1 
      }
    ]
  }
];

export function TerminalTypewriter({
  textToType = "SURVIVORS DETECTED... IF YOU CAN READ THIS, YOU'RE STILL ALIVE. THE CRYPTO NUCLEAR WINTER KILLED 90% OF PROTOCOLS. THOSE WHO REMAIN HAVE ADAPTED TO THE HARSH NEW REALITY.",
  typeDelay = 30,
  className,
  showBootSequence = true,
  onTypingComplete,
  showQuestionnaire = false,
  onRoleSelect,
  selectedRole
}: TerminalTypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [bootStage, setBootStage] = useState<BootStage>("initializing");
  const [bootMessages, setBootMessages] = useState<string[]>([]);
  const [currentBootMessage, setCurrentBootMessage] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootGlitch, setBootGlitch] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [bountyHunterScore, setBountyHunterScore] = useState(0);
  const [survivorScore, setSurvivorScore] = useState(0);
  const [calculatingResult, setCalculatingResult] = useState(false);
  const [questionnaireStarted, setQuestionnaireStarted] = useState(false);
  const [typingStarted, setTypingStarted] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);

  // Setup boot sequence
  useEffect(() => {
    if (!showBootSequence) {
      setBootStage("complete");
      setIsComplete(true);
      return;
    }
    
    setBootMessages(BOOT_MESSAGES[bootStage]);
    setCurrentBootMessage(0);
    
    if (bootStage !== "complete") {
      setBootProgress(0);
    }
    
    const bootInterval = setInterval(() => {
      setBootProgress(prev => {
        const newProgress = prev + (Math.random() * 5 + 1);
        
        // Reduced glitch frequency
        if (Math.random() < 0.05) {
          setBootGlitch(true);
          setTimeout(() => setBootGlitch(false), 100);
        }
        
        if (newProgress >= 100) {
          clearInterval(bootInterval);
          
          setTimeout(() => {
            if (bootStage === "initializing") setBootStage("connecting");
            else if (bootStage === "connecting") {
              setBootStage("complete");
              setIsComplete(true);
            }
          }, 800);
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 120);
    
    const messageInterval = setInterval(() => {
      if (currentBootMessage < bootMessages.length - 1) {
        setCurrentBootMessage(prev => prev + 1);
      } else {
        clearInterval(messageInterval);
      }
    }, 1000);
    
    return () => {
      clearInterval(bootInterval);
      clearInterval(messageInterval);
    };
  }, [bootStage, showBootSequence]);
  
  // Setup cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Setup typing animation
  useEffect(() => {
    if (!isComplete || bootStage !== "complete" || typingStarted) {
      return;
    }
    
    setTypingStarted(true);
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= textToType.length) {
        setDisplayText(textToType.substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
        
        if (onTypingComplete) {
          onTypingComplete();
        }
      }
    }, typeDelay);
    
    const forceCompletionTimeout = setTimeout(() => {
      if (!typingComplete) {
        clearInterval(typingInterval);
        setDisplayText(textToType);
        setTypingComplete(true);
        
        if (onTypingComplete) {
          onTypingComplete();
        }
      }
    }, textToType.length * typeDelay + 5000);
    
    return () => {
      clearInterval(typingInterval);
      clearTimeout(forceCompletionTimeout);
    };
  }, [textToType, typeDelay, bootStage, isComplete, onTypingComplete, typingStarted, typingComplete]);
  
  // Auto-start questionnaire if showQuestionnaire is true
  useEffect(() => {
    if (showQuestionnaire && !questionnaireStarted && !selectedRole) {
      setQuestionnaireStarted(true);
    }
  }, [showQuestionnaire, questionnaireStarted, selectedRole]);
  
  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    const question = ASSESSMENT_QUESTIONS[questionIndex];
    const answer = question.options[answerIndex];
    
    setBountyHunterScore(prev => prev + answer.bountyHunterScore);
    setSurvivorScore(prev => prev + answer.survivorScore);
    
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
    
    if (questionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(questionIndex + 1);
      }, 500);
    } else {
      setCalculatingResult(true);
      
      setTimeout(() => {
        setCalculatingResult(false);
        const role = bountyHunterScore > survivorScore ? "bounty-hunter" : "survivor";
        
        if (onRoleSelect) {
          onRoleSelect(role);
        }
      }, 2000);
    }
  };

  return (
    <div className={cn("terminal-container relative", className)}>
      <div 
        ref={terminalRef} 
        className={cn(
          "terminal-output bg-black/90 text-toxic-neon p-4 font-mono border border-toxic-neon/30 rounded-md relative overflow-hidden",
          bootGlitch && "glitch-effect"
        )}
      >
        {/* Simplified scanline - reduced opacity */}
        <div className="scanline absolute inset-0 pointer-events-none opacity-30"></div>
        
        {showBootSequence && (bootStage === "initializing" || bootStage === "connecting") && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/70 flex items-center">
                <Terminal className={`h-4 w-4 mr-2 ${bootProgress < 100 ? 'animate-spin' : ''}`} />
                <span>
                  {bootStage === "initializing" && "SYSTEM INITIALIZATION"}
                  {bootStage === "connecting" && "NETWORK CONNECTION"}
                </span>
              </div>
              <div className="text-toxic-neon font-mono text-sm">
                {Math.floor(bootProgress)}%
              </div>
            </div>
            
            {/* Simplified progress bar */}
            <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-toxic-neon/30">
              <div 
                className="h-full bg-toxic-neon/70 rounded-full transition-all duration-100"
                style={{ width: `${bootProgress}%` }}
              ></div>
            </div>
            
            {/* Simplified boot messages */}
            <div className="mt-4 space-y-1">
              {bootMessages.slice(0, currentBootMessage + 1).map((message, index) => (
                <div key={index} className="text-white/80 flex">
                  <span className="text-toxic-neon mr-2">&gt;</span>
                  <span className={index === currentBootMessage ? "typing-text" : ""}>
                    {message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {bootStage === "complete" && (
          <>
            <div className="terminal-line flex items-center h-6 min-h-6">
              <span className="block text-toxic-neon">
                {displayText}
                {cursorVisible && <span className="cursor text-toxic-neon">_</span>}
              </span>
            </div>
          </>
        )}
        
        {showQuestionnaire && !selectedRole && (
          <div className="assessment-container mt-4">
            {calculatingResult ? (
              <div className="text-center py-6">
                <div className="inline-block rounded-full h-12 w-12 border-2 border-toxic-neon/30 border-t-toxic-neon animate-spin mb-4"></div>
                <h3 className="text-toxic-neon text-lg mb-2">Processing...</h3>
              </div>
            ) : (
              <div className="assessment-content">
                <div className="text-center mb-4">
                  <h3 className="text-lg text-toxic-neon mb-2">Wasteland Role Assessment</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</span>
                  </div>
                  <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-toxic-neon rounded-full transition-all"
                      style={{ width: `${((currentQuestion) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-4 pb-3 border-b border-toxic-neon/20">
                  <h4 className="text-white font-bold mb-3">{ASSESSMENT_QUESTIONS[currentQuestion].question}</h4>
                  
                  <div className="space-y-3">
                    {ASSESSMENT_QUESTIONS[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full text-left p-3 rounded border transition-all ${
                          answers[currentQuestion] === index 
                            ? 'bg-toxic-neon/20 border-toxic-neon text-toxic-neon' 
                            : 'bg-black/40 border-toxic-neon/30 text-white/80 hover:bg-black/60 hover:border-toxic-neon/60'
                        }`}
                        onClick={() => handleSelectAnswer(currentQuestion, index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                            answers[currentQuestion] === index 
                              ? 'border-toxic-neon bg-toxic-neon/20' 
                              : 'border-toxic-neon/30'
                          }`}>
                            {answers[currentQuestion] === index && (
                              <div className="w-2 h-2 rounded-full bg-toxic-neon"></div>
                            )}
                          </div>
                          <span>{option.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {selectedRole && (
          <div className="results-container text-center">
            <h3 className="text-xl text-toxic-neon mb-4">Assessment Complete</h3>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className={`p-3 rounded-lg border ${selectedRole === 'bounty-hunter' ? 'border-apocalypse-red bg-apocalypse-red/10' : 'border-white/10 bg-black/30'}`}>
                <Target className={`h-10 w-10 mx-auto mb-2 ${selectedRole === 'bounty-hunter' ? 'text-apocalypse-red' : 'text-white/30'}`} />
                <div className={`text-center ${selectedRole === 'bounty-hunter' ? 'text-apocalypse-red' : 'text-white/50'}`}>
                  <div className="font-bold">Bounty Hunter</div>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg border ${selectedRole === 'survivor' ? 'border-toxic-neon bg-toxic-neon/10' : 'border-white/10 bg-black/30'}`}>
                <Shield className={`h-10 w-10 mx-auto mb-2 ${selectedRole === 'survivor' ? 'text-toxic-neon' : 'text-white/30'}`} />
                <div className={`text-center ${selectedRole === 'survivor' ? 'text-toxic-neon' : 'text-white/50'}`}>
                  <div className="font-bold">Survivor</div>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-toxic-neon/30 bg-black/40 text-left mb-4">
              <p className="text-white/80 mb-2">
                {selectedRole === 'bounty-hunter' 
                  ? 'You are naturally skilled at tracking, strategic thinking, and independent operations.'
                  : 'You possess the cooperative mindset and community-building skills vital for rebuilding.'}
              </p>
            </div>
            
            <ToxicButton variant="default">
              <Check className="w-4 h-4 mr-2" />
              Continue
            </ToxicButton>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .scanline::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.05) 51%
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 1;
        }
        
        .typing-text {
          border-right: 2px solid rgba(80, 250, 123, 0.7);
          animation: blink-caret 1s step-end infinite;
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: rgba(80, 250, 123, 0.7) }
        }
      `}</style>
    </div>
  );
}
