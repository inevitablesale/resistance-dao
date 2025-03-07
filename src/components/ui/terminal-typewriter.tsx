
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, Target, Shield, Terminal, Zap, AlertTriangle, RotateCw, Check, Skull, Binary } from "lucide-react";
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
  | "diagnosing" 
  | "connecting" 
  | "complete";

type AssessmentQuestion = {
  id: number;
  question: string;
  options: {
    text: string;
    bountyHunterScore: number;
    survivorScore: number;
  }[];
};

// Enhanced boot messages with better narrative
const BOOT_MESSAGES = {
  initializing: [
    "RESISTANCE OS v3.2.1 INITIALIZING...",
    "CHECKING BLOCKCHAIN INTEGRITY...",
    "DETECTING SURVIVING PROTOCOLS...",
    "RADIATION LEVELS: HIGH BUT TOLERABLE",
    "LOADING DECENTRALIZED CORE MODULES..."
  ],
  diagnosing: [
    "SCANNING FOR HOSTILE ENTITIES...",
    "NEURAL NETWORK STATUS: DEGRADED BUT FUNCTIONAL",
    "CHECKING QUANTUM ENCRYPTION CELLS...",
    "BLOCKCHAIN INTEGRITY: 62% CORRUPTED",
    "INITIATING WASTELAND SURVIVAL PROTOCOLS..."
  ],
  connecting: [
    "ESTABLISHING SECURE P2P CONNECTION...",
    "SCANNING FOR SURVIVOR OUTPOSTS...",
    "ACCESSING BOUNTY HUNTER DATABASE...",
    "VALIDATING RESISTANCE DAO MEMBERSHIP...",
    "SYNCHRONIZING WITH WASTELAND ECONOMY..."
  ],
  complete: [
    "SYSTEM RECOVERY COMPLETE",
    "WELCOME TO THE RESISTANCE NETWORK",
    "THE OLD FINANCIAL WORLD DIED. WE SURVIVE AMONG ITS RUINS.",
    "JOIN US TO REBUILD FROM THE ASHES."
  ]
};

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
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
      },
      { 
        text: "Secure the perimeter first to ensure no hostile entities are nearby", 
        bountyHunterScore: 9, 
        survivorScore: 3 
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
      },
      { 
        text: "Analyze patterns to predict outcomes before choosing my path", 
        bountyHunterScore: 6, 
        survivorScore: 6 
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
      },
      { 
        text: "Exploring forgotten technology and salvaging valuable artifacts", 
        bountyHunterScore: 6, 
        survivorScore: 6 
      }
    ]
  },
  {
    id: 4,
    question: "What's your approach to encountering strangers in the wasteland?",
    options: [
      { 
        text: "Observe from distance, assess threat level, approach with caution", 
        bountyHunterScore: 8, 
        survivorScore: 4 
      },
      { 
        text: "Evaluate what skills they might bring to strengthen our settlement", 
        bountyHunterScore: 1, 
        survivorScore: 10 
      },
      { 
        text: "Keep my distance unless they have information I need", 
        bountyHunterScore: 7, 
        survivorScore: 2 
      }
    ]
  },
  {
    id: 5,
    question: "When making difficult decisions, what factors most influence your choice?",
    options: [
      { 
        text: "Maximum benefit for the collective group over time", 
        bountyHunterScore: 3, 
        survivorScore: 9 
      },
      { 
        text: "Tactical advantage and strategic positioning", 
        bountyHunterScore: 9, 
        survivorScore: 3 
      },
      { 
        text: "Risk vs. reward calculation with emphasis on survival", 
        bountyHunterScore: 5, 
        survivorScore: 7 
      }
    ]
  }
];

export function TerminalTypewriter({
  textToType = "SURVIVORS DETECTED... IF YOU CAN READ THIS, YOU'RE STILL ALIVE. THE CRYPTO NUCLEAR WINTER KILLED 90% OF PROTOCOLS. THOSE WHO REMAIN HAVE ADAPTED TO THE HARSH NEW REALITY. RESILIENT COMMUNITIES HAVE ESTABLISHED NEW ECONOMIES FROM THE ASHES. OUR TRADERS REPORT THAT TOKEN EXCHANGE NETWORKS ARE FUNCTIONING AGAIN. WE ARE REBUILDING THE FINANCIAL SYSTEM. JOIN US.",
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
  const [progressFlicker, setProgressFlicker] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

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
    
    // Smoother progress bar with occasional flickers
    let lastProgress = 0;
    let progressIncrement = 1;
    const maxProgress = 100;
    const bootInterval = setInterval(() => {
      setBootProgress(prev => {
        // Ensure we reach exactly 100% by the end
        if (prev >= maxProgress) {
          clearInterval(bootInterval);
          
          setTimeout(() => {
            if (bootStage === "initializing") setBootStage("diagnosing");
            else if (bootStage === "diagnosing") setBootStage("connecting");
            else if (bootStage === "connecting") {
              setBootStage("complete");
              setIsComplete(true);
            }
          }, 500);
          
          return maxProgress;
        }
        
        // Smoother, more natural progress increments with gradual acceleration
        const remainingProgress = maxProgress - prev;
        const timeLeft = bootMessages.length - currentBootMessage;
        
        // Adjust increment based on remaining progress and time
        if (remainingProgress > 50 && timeLeft > 3) {
          progressIncrement = Math.sin(prev / 25) * 2 + Math.random() * 1.5 + 1;
        } else if (remainingProgress > 20 && timeLeft > 1) {
          progressIncrement = Math.sin(prev / 25) * 2.5 + Math.random() * 2 + 2;
        } else {
          // Final sprint to ensure we reach 100%
          progressIncrement = remainingProgress / (timeLeft + 1);
          if (progressIncrement < 3) progressIncrement = 3;
        }
        
        // Ensure we don't go over 100%
        const newProgress = Math.min(prev + progressIncrement, maxProgress);
        
        // Occasional progress bar glitch
        if (Math.random() < 0.1 && newProgress - lastProgress > 5) {
          setProgressFlicker(true);
          setTimeout(() => setProgressFlicker(false), 100);
        }
        lastProgress = newProgress;
        
        // Terminal glitch effect
        if (Math.random() < 0.15) {
          setBootGlitch(true);
          setTimeout(() => setBootGlitch(false), 150);
        }
        
        return newProgress;
      });
    }, 70);
    
    // Message typing effect 
    const messageInterval = setInterval(() => {
      if (currentBootMessage < bootMessages.length - 1) {
        setCurrentBootMessage(prev => prev + 1);
      } else {
        clearInterval(messageInterval);
        
        // Ensure we reach 100% if we're at the last message
        setBootProgress(maxProgress);
      }
    }, 600);
    
    return () => {
      clearInterval(bootInterval);
      clearInterval(messageInterval);
    };
  }, [bootStage, showBootSequence]);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
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
    }, 8000); // Give more time for the typing animation
    
    return () => {
      clearInterval(typingInterval);
      clearTimeout(forceCompletionTimeout);
    };
  }, [textToType, typeDelay, bootStage, isComplete, onTypingComplete, typingStarted, typingComplete]);
  
  useEffect(() => {
    if (showQuestionnaire && !questionnaireStarted && !selectedRole) {
      setQuestionnaireStarted(true);
    }
  }, [showQuestionnaire, questionnaireStarted, selectedRole]);
  
  const handleStartAssessment = () => {
    setQuestionnaireStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setBountyHunterScore(0);
    setSurvivorScore(0);
  };
  
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
      }, 3000);
    }
  };

  return (
    <div className={cn("terminal-container relative", className)}>
      <div 
        ref={terminalRef} 
        className={cn(
          "terminal-output bg-black/90 text-toxic-neon p-6 font-mono border border-toxic-neon/30 rounded-md relative overflow-hidden",
          bootGlitch && "glitch-effect"
        )}
      >
        <div className="scanline absolute inset-0 pointer-events-none"></div>
        <div className="crt-screen-effect absolute inset-0 pointer-events-none"></div>
        
        {showBootSequence && (bootStage === "initializing" || bootStage === "diagnosing" || bootStage === "connecting") && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/70 flex items-center">
                <RotateCw className={`h-4 w-4 mr-2 ${bootProgress < 100 ? 'animate-spin' : ''}`} />
                <span>
                  {bootStage === "initializing" && "SYSTEM INITIALIZATION"}
                  {bootStage === "diagnosing" && "WASTELAND DIAGNOSTICS"}
                  {bootStage === "connecting" && "RESISTANCE NETWORK CONNECTION"}
                </span>
              </div>
              <div className="text-toxic-neon font-mono text-sm">
                {Math.floor(bootProgress)}%
              </div>
            </div>
            
            <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-toxic-neon/30">
              <div 
                ref={progressRef}
                className={`h-full transition-all ${progressFlicker ? 'opacity-50' : 'opacity-100'} bg-toxic-neon/70 rounded-full`}
                style={{ width: `${bootProgress}%` }}
              ></div>
            </div>
            
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
            
            {bootStage === "initializing" && bootProgress > 50 && (
              <div className="mt-4 p-2 border border-apocalypse-red/40 bg-apocalypse-red/10 rounded">
                <div className="flex items-center text-apocalypse-red mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-bold">WARNING: DECENTRALIZED SYSTEMS COMPROMISED</span>
                </div>
                <p className="text-white/70 text-xs">
                  Multiple critical protocols corrupted. Running in emergency mode.
                  Token bridges down. Full consensus recovery required.
                </p>
              </div>
            )}
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
              <div className="text-center py-8">
                <div className="inline-block relative">
                  <div className="rounded-full h-16 w-16 border-4 border-toxic-neon/30 border-t-toxic-neon animate-spin mb-4"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Binary className="h-6 w-6 text-toxic-neon/50" />
                  </div>
                </div>
                <h3 className="text-toxic-neon text-xl mb-2">Analyzing Survival Profile</h3>
                <p className="text-white/70">Calculating optimal wasteland role based on your responses...</p>
                <div className="mt-4 flex justify-center gap-2">
                  <div className="px-3 py-1 bg-black/50 border border-toxic-neon/20 text-toxic-neon/60 text-xs">
                    <span className="font-mono">SCANNING NEURAL PATTERNS</span>
                  </div>
                  <div className="px-3 py-1 bg-black/50 border border-apocalypse-red/20 text-apocalypse-red/60 text-xs">
                    <span className="font-mono">EVALUATING SURVIVAL TRAITS</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="assessment-content">
                <div className="text-center mb-6">
                  <h3 className="text-xl text-toxic-neon mb-2 broken-glass inline-block px-2 py-1">Wasteland Adaptation Protocol</h3>
                  <p className="text-white/70">
                    To determine your optimal role in the Resistance, complete this wasteland survival assessment.
                  </p>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</span>
                    <span className="text-toxic-neon">
                      {Math.floor((currentQuestion / ASSESSMENT_QUESTIONS.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-toxic-neon rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((currentQuestion) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-6 pb-4 border-b border-toxic-neon/20">
                  <h4 className="text-white font-bold mb-3">{ASSESSMENT_QUESTIONS[currentQuestion].question}</h4>
                  
                  <div className="space-y-3">
                    {ASSESSMENT_QUESTIONS[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full text-left p-3 rounded transition-all relative ${
                          answers[currentQuestion] === index 
                            ? 'bg-toxic-neon/20 border-toxic-neon text-toxic-neon shadow-[0_0_10px_rgba(80,250,123,0.2)]' 
                            : 'bg-black/40 border border-toxic-neon/30 text-white/80 hover:bg-black/60 hover:border-toxic-neon/60'
                        }`}
                        onClick={() => handleSelectAnswer(currentQuestion, index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mt-0.5 ${
                            answers[currentQuestion] === index 
                              ? 'border-toxic-neon bg-toxic-neon/20' 
                              : 'border-toxic-neon/30'
                          }`}>
                            {answers[currentQuestion] === index && (
                              <div className="w-3 h-3 rounded-full bg-toxic-neon"></div>
                            )}
                          </div>
                          <span>{option.text}</span>
                        </div>
                        
                        {answers[currentQuestion] === index && (
                          <div className="absolute top-0 right-0 p-1">
                            <Check className="h-4 w-4 text-toxic-neon" />
                          </div>
                        )}
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
            <h3 className="text-2xl text-toxic-neon mb-4">Wasteland Role Assessment Complete</h3>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${selectedRole === 'bounty-hunter' ? 'border-apocalypse-red bg-apocalypse-red/10 shadow-[0_0_15px_rgba(234,56,76,0.2)]' : 'border-white/10 bg-black/30'}`}>
                <Target className={`h-12 w-12 mx-auto mb-2 ${selectedRole === 'bounty-hunter' ? 'text-apocalypse-red' : 'text-white/30'}`} />
                <div className={`text-center ${selectedRole === 'bounty-hunter' ? 'text-apocalypse-red' : 'text-white/50'}`}>
                  <div className="font-bold">Bounty Hunter</div>
                  <div className="text-sm">{selectedRole === 'bounty-hunter' ? '76%' : '24%'}</div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${selectedRole === 'survivor' ? 'border-toxic-neon bg-toxic-neon/10 shadow-[0_0_15px_rgba(80,250,123,0.2)]' : 'border-white/10 bg-black/30'}`}>
                <Shield className={`h-12 w-12 mx-auto mb-2 ${selectedRole === 'survivor' ? 'text-toxic-neon' : 'text-white/30'}`} />
                <div className={`text-center ${selectedRole === 'survivor' ? 'text-toxic-neon' : 'text-white/50'}`}>
                  <div className="font-bold">Survivor</div>
                  <div className="text-sm">{selectedRole === 'survivor' ? '82%' : '18%'}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 rounded-lg border border-toxic-neon/30 bg-black/40 text-left relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 rust-overlay pointer-events-none"></div>
              
              <h4 className="font-bold text-toxic-neon mb-2">
                {selectedRole === 'bounty-hunter' ? 'Your Bounty Hunter Profile' : 'Your Survivor Profile'}
              </h4>
              
              <p className="text-white/80 mb-3">
                {selectedRole === 'bounty-hunter' 
                  ? 'You are naturally skilled at tracking, strategic thinking, and independent operations. The wasteland needs justice-bringers like you to hunt down those who corrupted the old system.'
                  : 'You possess the cooperative mindset and community-building skills vital for rebuilding civilization. The settlements need visionaries like you to rebuild from the ashes.'}
              </p>
              
              <div className="text-white/70 text-sm">
                <div className="mb-1">
                  <span className="text-toxic-neon">Key Strengths:</span> {selectedRole === 'bounty-hunter' 
                    ? 'Tactical acumen, target acquisition, risk assessment' 
                    : 'Resource management, community building, long-term planning'}
                </div>
                <div>
                  <span className="text-toxic-neon">Recommended Focus:</span> {selectedRole === 'bounty-hunter' 
                    ? 'Hunting down crypto criminals and securing stolen assets' 
                    : 'Establishing sustainable economic systems in wasteland settlements'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
