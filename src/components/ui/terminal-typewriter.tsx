import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Radiation, Target, Shield, Terminal, Zap, AlertTriangle, RotateCw, Check, X, Skull } from "lucide-react";
import { ToxicButton } from "./toxic-button";

interface TerminalTypewriterProps {
  textToType?: string;
  typeDelay?: number;
  className?: string;
  isConnected?: boolean;
  onConnect?: () => void;
  onRoleSelect?: (role: "bounty-hunter" | "survivor") => void;
  selectedRole?: "bounty-hunter" | "survivor" | null;
  onAssessmentComplete?: (role: "bounty-hunter" | "survivor") => void;
}

type BootStage = 
  | "initializing" 
  | "diagnosing" 
  | "recovering" 
  | "connecting" 
  | "complete" 
  | "assessment" 
  | "results";

type AssessmentQuestion = {
  id: number;
  question: string;
  options: {
    text: string;
    bountyHunterScore: number;
    survivorScore: number;
  }[];
};

const BOOT_MESSAGES = {
  initializing: [
    "SYSTEM INITIALIZING...",
    "CHECKING MEMORY INTEGRITY...",
    "DETECTING HARDWARE COMPONENTS...",
    "RADIATION LEVELS: HIGH BUT TOLERABLE",
    "LOADING CORE MODULES..."
  ],
  diagnosing: [
    "DIAGNOSTIC CHECK INITIATED...",
    "NEURAL NETWORK STATUS: DEGRADED",
    "CHECKING QUANTUM ENCRYPTION CELLS...",
    "DATA STORAGE: 62% CORRUPTED",
    "ATTEMPTING AUTO-REPAIR SEQUENCES..."
  ],
  recovering: [
    "RECOVERY MODE ACTIVATED",
    "RESTORING CRITICAL SYSTEMS...",
    "REBUILDING PROTOCOL DATABASE...",
    "PURGING TOXIC DATA FRAGMENTS...",
    "RESISTANCE NETWORK PROTOCOLS RESTORED"
  ],
  connecting: [
    "ESTABLISHING SECURE CONNECTION...",
    "SCANNING FOR SURVIVOR OUTPOSTS...",
    "BOUNTY HUNTER DATABASE DETECTED...",
    "TRADING NETWORKS LOCATED...",
    "SYNCHRONIZING WITH WASTELAND ECONOMY..."
  ],
  complete: [
    "SYSTEM RECOVERY COMPLETE",
    "WELCOME TO THE RESISTANCE NETWORK",
    "THE OLD WORLD DIED. WE LIVE AMONG ITS RUINS.",
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
  isConnected = false,
  onConnect,
  onRoleSelect,
  selectedRole,
  onAssessmentComplete
}: TerminalTypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [bootStage, setBootStage] = useState<BootStage>("initializing");
  const [bootMessages, setBootMessages] = useState<string[]>([]);
  const [currentBootMessage, setCurrentBootMessage] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootGlitch, setBootGlitch] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [bountyHunterScore, setBountyHunterScore] = useState(0);
  const [survivorScore, setSurvivorScore] = useState(0);
  const [calculatingResult, setCalculatingResult] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const beepRef = useRef<HTMLAudioElement>(null);
  const glitchRef = useRef<HTMLAudioElement>(null);
  const successRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (bootStage !== "initializing" && bootStage !== "diagnosing" && bootStage !== "recovering" && bootStage !== "connecting" && bootStage !== "complete") return;
    
    setBootMessages(BOOT_MESSAGES[bootStage]);
    setCurrentBootMessage(0);
    setBootProgress(0);
    
    const bootInterval = setInterval(() => {
      setBootProgress(prev => {
        const newProgress = prev + (Math.random() * 3 + 1);
        
        if (Math.random() < 0.15) {
          setBootGlitch(true);
          setTimeout(() => setBootGlitch(false), 150);
          
          if (audioEnabled && glitchRef.current) {
            glitchRef.current.currentTime = 0;
            glitchRef.current.play().catch(() => {});
          }
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    if (bootProgress >= 100) {
      clearInterval(bootInterval);
      
      setTimeout(() => {
        if (bootStage === "initializing") setBootStage("diagnosing");
        else if (bootStage === "diagnosing") setBootStage("recovering");
        else if (bootStage === "recovering") setBootStage("connecting");
        else if (bootStage === "connecting") {
          setBootStage("complete");
          
          if (audioEnabled && successRef.current) {
            successRef.current.currentTime = 0;
            successRef.current.play().catch(() => {});
          }
          
          setTimeout(() => {
            setIsComplete(true);
          }, 3000);
        }
      }, 1000);
      
      return () => clearInterval(bootInterval);
    }
    
    const messageInterval = setInterval(() => {
      if (currentBootMessage < bootMessages.length - 1) {
        setCurrentBootMessage(prev => prev + 1);
        
        if (audioEnabled && beepRef.current) {
          beepRef.current.currentTime = 0;
          beepRef.current.play().catch(() => {});
        }
      } else {
        clearInterval(messageInterval);
      }
    }, 1200);
    
    return () => {
      clearInterval(bootInterval);
      clearInterval(messageInterval);
    };
  }, [bootStage, bootProgress, currentBootMessage, audioEnabled]);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  useEffect(() => {
    if (bootStage !== "complete" || !isComplete) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i <= textToType.length) {
        setDisplayText(textToType.substring(0, i));
        i++;
        
        if (audioEnabled && i % 3 === 0 && beepRef.current) {
          beepRef.current.volume = 0.2;
          beepRef.current.currentTime = 0;
          beepRef.current.play().catch(() => {});
        }
      } else {
        clearInterval(interval);
      }
    }, typeDelay);
    
    return () => clearInterval(interval);
  }, [textToType, typeDelay, bootStage, isComplete, audioEnabled]);
  
  const handleEnableAudio = () => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);
    setAudioEnabled(true);
    
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  };
  
  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    const question = ASSESSMENT_QUESTIONS[questionIndex];
    const answer = question.options[answerIndex];
    
    setBountyHunterScore(prev => prev + answer.bountyHunterScore);
    setSurvivorScore(prev => prev + answer.survivorScore);
    
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
    
    if (audioEnabled && beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play().catch(() => {});
    }
    
    if (questionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(questionIndex + 1);
      }, 500);
    } else {
      setCalculatingResult(true);
      
      if (audioEnabled && glitchRef.current) {
        glitchRef.current.currentTime = 0;
        glitchRef.current.play().catch(() => {});
      }
      
      setTimeout(() => {
        setBootStage("results");
        setCalculatingResult(false);
        
        if (audioEnabled && successRef.current) {
          successRef.current.currentTime = 0;
          successRef.current.play().catch(() => {});
        }
        
        const role = bountyHunterScore > survivorScore ? "bounty-hunter" : "survivor";
        onRoleSelect?.(role);
        
        if (onAssessmentComplete) {
          onAssessmentComplete(role);
        }
      }, 3000);
    }
  };
  
  const handleStartAssessment = () => {
    setBootStage("assessment");
    setCurrentQuestion(0);
    setAnswers([]);
    setBountyHunterScore(0);
    setSurvivorScore(0);
    
    if (audioEnabled && beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play().catch(() => {});
    }
  };
  
  return (
    <div className={cn("terminal-container relative", className)}>
      <audio ref={audioRef} src="/sounds/ambient-terminal.mp3" loop />
      <audio ref={beepRef} src="/sounds/terminal-beep.mp3" />
      <audio ref={glitchRef} src="/sounds/glitch.mp3" />
      <audio ref={successRef} src="/sounds/success.mp3" />
      
      <div 
        ref={terminalRef} 
        className={cn(
          "terminal-output bg-black/90 text-toxic-neon p-6 font-mono border border-toxic-neon/30 rounded-md relative overflow-hidden",
          bootGlitch && "glitch-effect",
          bootStage === "assessment" && "assessment-terminal"
        )}
      >
        <div className="scanline absolute inset-0 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-4 border-b border-toxic-neon/20 pb-2">
          <div className="flex items-center">
            <Terminal className="h-5 w-5 mr-2 text-toxic-neon" />
            <span className="text-toxic-neon/90 font-bold">RESISTANCE_OS v3.2.1</span>
          </div>
          
          <div className="flex items-center gap-3">
            {!audioEnabled && (
              <button 
                onClick={handleEnableAudio} 
                className="text-toxic-neon/70 hover:text-toxic-neon flex items-center text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                ENABLE AUDIO
              </button>
            )}
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-full bg-apocalypse-red animate-pulse"></div>
              <div className="h-3 w-3 rounded-full bg-toxic-neon/70"></div>
            </div>
          </div>
        </div>
        
        {(bootStage === "initializing" || bootStage === "diagnosing" || bootStage === "recovering" || bootStage === "connecting") && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/70 flex items-center">
                <RotateCw className={`h-4 w-4 mr-2 ${bootProgress < 100 ? 'animate-spin' : ''}`} />
                <span>
                  {bootStage === "initializing" && "SYSTEM INITIALIZATION"}
                  {bootStage === "diagnosing" && "SYSTEM DIAGNOSTICS"}
                  {bootStage === "recovering" && "RECOVERY PROTOCOL"}
                  {bootStage === "connecting" && "NETWORK CONNECTION"}
                </span>
              </div>
              <div className="text-toxic-neon font-mono text-sm">
                {Math.floor(bootProgress)}%
              </div>
            </div>
            
            <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-toxic-neon/30">
              <div 
                className="h-full bg-toxic-neon/70 rounded-full transition-all duration-100"
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
                  <span className="text-sm font-bold">WARNING: SYSTEM DEGRADED</span>
                </div>
                <p className="text-white/70 text-xs">
                  Multiple critical systems compromised. Running in emergency mode.
                  Protocol corruption detected. Full system recovery required.
                </p>
              </div>
            )}
          </div>
        )}
        
        {bootStage === "complete" && (
          <>
            <div className="mb-4">
              <div className="flex items-center text-toxic-neon mb-2">
                <Check className="h-4 w-4 mr-2" />
                <span className="font-bold">SYSTEM RECOVERY COMPLETE</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div className="bg-black/50 border border-toxic-neon/20 rounded p-2">
                  <div className="text-white/70 mb-1">Network Status</div>
                  <div className="text-toxic-neon flex items-center">
                    <div className="h-2 w-2 rounded-full bg-toxic-neon mr-2 animate-pulse"></div>
                    Connected
                  </div>
                </div>
                
                <div className="bg-black/50 border border-toxic-neon/20 rounded p-2">
                  <div className="text-white/70 mb-1">Protocol Integrity</div>
                  <div className="text-toxic-neon">78% Restored</div>
                </div>
                
                <div className="bg-black/50 border border-toxic-neon/20 rounded p-2">
                  <div className="text-white/70 mb-1">Security Level</div>
                  <div className="text-toxic-neon">Maximum</div>
                </div>
                
                <div className="bg-black/50 border border-toxic-neon/20 rounded p-2">
                  <div className="text-white/70 mb-1">Wasteland Radiation</div>
                  <div className="text-apocalypse-red flex items-center">
                    <div className="h-2 w-2 rounded-full bg-apocalypse-red mr-2 animate-pulse"></div>
                    High Risk
                  </div>
                </div>
              </div>
            </div>
            
            <div className="terminal-line flex items-center h-6 min-h-6 mb-4">
              <span className="block">
                {displayText}
                {cursorVisible && <span className="cursor">_</span>}
              </span>
            </div>
          </>
        )}
        
        {bootStage === "assessment" && (
          <div className="assessment-container">
            <div className="text-center mb-6">
              <h3 className="text-xl text-toxic-neon mb-2">Wasteland Adaptation Protocol</h3>
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
                  className="h-full bg-toxic-neon rounded-full transition-all"
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
                    className={`w-full text-left p-3 rounded border transition-all ${
                      answers[currentQuestion] === index 
                        ? 'bg-toxic-neon/20 border-toxic-neon text-toxic-neon' 
                        : 'bg-black/40 border-toxic-neon/30 text-white/80 hover:bg-black/60 hover:border-toxic-neon/60'
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
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {bootStage === "results" && (
          <div className="results-container">
            {calculatingResult ? (
              <div className="text-center py-8">
                <div className="inline-block rounded-full h-16 w-16 border-4 border-toxic-neon/30 border-t-toxic-neon animate-spin mb-4"></div>
                <h3 className="text-toxic-neon text-xl mb-2">Analyzing Survival Profile</h3>
                <p className="text-white/70">Calculating optimal wasteland role based on your responses...</p>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl text-toxic-neon mb-4">Wasteland Role Assessment Complete</h3>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className={`p-4 rounded-lg border ${selectedRole === 'bounty-hunter' ? 'border-apocalypse-red bg-apocalypse-red/10' : 'border-white/10 bg-black/30'}`}>
                    <Target className={`h-12 w-12 mx-auto mb-2 ${selectedRole === 'bounty-hunter' ? 'text-apocalypse-red' : 'text-white/30'}`} />
                    <div className={`text-center ${selectedRole === 'bounty-hunter' ? 'text-apocalypse-red' : 'text-white/50'}`}>
                      <div className="font-bold">Bounty Hunter</div>
                      <div className="text-sm">{Math.round((bountyHunterScore / (bountyHunterScore + survivorScore)) * 100)}%</div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${selectedRole === 'survivor' ? 'border-toxic-neon bg-toxic-neon/10' : 'border-white/10 bg-black/30'}`}>
                    <Shield className={`h-12 w-12 mx-auto mb-2 ${selectedRole === 'survivor' ? 'text-toxic-neon' : 'text-white/30'}`} />
                    <div className={`text-center ${selectedRole === 'survivor' ? 'text-toxic-neon' : 'text-white/50'}`}>
                      <div className="font-bold">Survivor</div>
                      <div className="text-sm">{Math.round((survivorScore / (bountyHunterScore + survivorScore)) * 100)}%</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 p-4 rounded-lg border border-toxic-neon/30 bg-black/40 text-left">
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
                
                <ToxicButton
                  onClick={onConnect}
                  className="w-full mt-2 bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                  size="lg"
                >
                  <Radiation className="w-5 h-5 mr-2 text-toxic-neon" />
                  <span className="flash-beacon">ACTIVATE {selectedRole?.toUpperCase()} PROTOCOL</span>
                </ToxicButton>
              </div>
            )}
          </div>
        )}
        
        {bootStage === "complete" && isComplete && !isConnected && selectedRole === null && (
          <div className="terminal-line mt-6">
            <div className="text-white/70 mb-4">BEFORE JOINING THE RESISTANCE, WE MUST DETERMINE YOUR ROLE IN THE NEW ECONOMY:</div>
            
            <ToxicButton
              onClick={handleStartAssessment}
              className="w-full mt-2 bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
              size="lg"
            >
              <Terminal className="w-5 h-5 mr-2 text-toxic-neon" />
              <span className="flash-beacon">BEGIN WASTELAND ROLE ASSESSMENT</span>
            </ToxicButton>
          </div>
        )}
        
        {isConnected && (
          <div className="terminal-line mt-4 text-toxic-neon">
            <span>[CONNECTED]</span> <span className="text-white/70">ECONOMY ACCESS GRANTED - WELCOME TO THE NEW FINANCIAL SYSTEM</span>
            {selectedRole && (
              <div className="mt-2 text-white/70">
                ROLE VERIFIED: <span className="text-toxic-neon">{selectedRole === "bounty-hunter" ? "BOUNTY HUNTER" : "SURVIVOR"}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
