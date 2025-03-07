
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, AlertTriangle, Check, X, ChevronRight, Terminal, Radiation } from 'lucide-react';
import { ToxicButton } from '@/components/ui/toxic-button';
import { cn } from '@/lib/utils';

type Question = {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    bountyHunterPoints: number;
    survivorPoints: number;
  }[];
};

type UserRole = 'bounty-hunter' | 'survivor' | null;

interface WastelandQuestionnaireProps {
  onComplete: (role: 'bounty-hunter' | 'survivor') => void;
  className?: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "When exploring abandoned ruins, what's your primary focus?",
    options: [
      { id: '1a', text: "Finding weapons and tactical gear", bountyHunterPoints: 3, survivorPoints: 0 },
      { id: '1b', text: "Gathering resources for the community", bountyHunterPoints: 0, survivorPoints: 3 },
      { id: '1c', text: "Securing the area from hostiles", bountyHunterPoints: 2, survivorPoints: 1 }
    ]
  },
  {
    id: 2,
    text: "How do you prefer to deal with threats in the wasteland?",
    options: [
      { id: '2a', text: "Eliminating them before they become problems", bountyHunterPoints: 3, survivorPoints: 0 },
      { id: '2b', text: "Negotiating when possible, fighting when necessary", bountyHunterPoints: 1, survivorPoints: 2 },
      { id: '2c', text: "Building defenses and avoiding confrontation", bountyHunterPoints: 0, survivorPoints: 3 }
    ]
  },
  {
    id: 3,
    text: "Which skill set do you most value in the post-apocalyptic world?",
    options: [
      { id: '3a', text: "Combat training and weapon proficiency", bountyHunterPoints: 3, survivorPoints: 0 },
      { id: '3b', text: "Medical knowledge and healing abilities", bountyHunterPoints: 0, survivorPoints: 3 },
      { id: '3c', text: "Tactical planning and leadership", bountyHunterPoints: 2, survivorPoints: 1 }
    ]
  },
  {
    id: 4,
    text: "When you find a stash of resources, what's your first thought?",
    options: [
      { id: '4a', text: "How can I use this to improve my gear?", bountyHunterPoints: 3, survivorPoints: 0 },
      { id: '4b', text: "How should we distribute this to the group?", bountyHunterPoints: 0, survivorPoints: 3 },
      { id: '4c', text: "Is this a trap? Let me check for ambushes.", bountyHunterPoints: 2, survivorPoints: 1 }
    ]
  },
  {
    id: 5,
    text: "What's your ideal role in a survivor community?",
    options: [
      { id: '5a', text: "Scout/Hunter - protecting the perimeter", bountyHunterPoints: 3, survivorPoints: 0 },
      { id: '5b', text: "Builder/Farmer - creating sustainable systems", bountyHunterPoints: 0, survivorPoints: 3 },
      { id: '5c', text: "Trader/Diplomat - managing external relations", bountyHunterPoints: 1, survivorPoints: 2 }
    ]
  }
];

export function WastelandQuestionnaire({ onComplete, className }: WastelandQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [bountyHunterScore, setBountyHunterScore] = useState(0);
  const [survivorScore, setSurvivorScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestionIndex, showResults]);
  
  const handleSelectOption = (questionId: number, optionId: string, bountyPoints: number, survivorPoints: number) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    
    setBountyHunterScore(prev => prev + bountyPoints);
    setSurvivorScore(prev => prev + survivorPoints);
    
    // Play sound effect
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    
    // Move to next question or show results
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        const determinedRole = bountyHunterScore + bountyPoints > survivorScore + survivorPoints 
          ? 'bounty-hunter' 
          : 'survivor';
        setRole(determinedRole);
        setShowResults(true);
        setIsCalculating(false);
      }, 2000);
    }
  };
  
  const handleComplete = () => {
    if (role) {
      onComplete(role);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "questionnaire-container bg-black/90 border border-toxic-neon/30 rounded-lg p-6 relative",
        className
      )}
    >
      {/* Sound effect */}
      <audio ref={audioRef} src="/sounds/terminal-beep.mp3" />
      
      {/* Terminal header */}
      <div className="flex items-center justify-between mb-6 border-b border-toxic-neon/20 pb-2">
        <div className="flex items-center">
          <Terminal className="h-5 w-5 mr-2 text-toxic-neon" />
          <span className="text-toxic-neon/90 font-bold">WASTELAND ADAPTATION ASSESSMENT</span>
        </div>
        <div className="text-white/70 text-xs font-mono">
          SUBJECT_ID: #WL-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
        </div>
      </div>
      
      {!showResults ? (
        <>
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-toxic-neon/80 text-sm font-mono">
                ASSESSMENT PROGRESS
              </div>
              <div className="text-white/70 text-sm">
                {currentQuestionIndex + 1} / {QUESTIONS.length}
              </div>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-toxic-neon/30">
              <div 
                className="h-full bg-toxic-neon transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {isCalculating ? (
            <div className="text-center py-12">
              <div className="inline-block mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-toxic-neon border-r-transparent"></div>
              <h3 className="text-toxic-neon text-xl mb-2">Analyzing Psychological Profile</h3>
              <p className="text-white/70">Processing your responses to determine optimal wasteland role...</p>
            </div>
          ) : (
            <div className="question-container">
              <h3 className="text-xl text-white mb-6">{currentQuestion.text}</h3>
              
              <div className="options-container space-y-4">
                {currentQuestion.options.map(option => (
                  <motion.button
                    key={option.id}
                    className={cn(
                      "w-full text-left rounded-lg border p-4 transition-all",
                      answers[currentQuestion.id] === option.id
                        ? "bg-toxic-neon/20 border-toxic-neon text-toxic-neon"
                        : "bg-black/50 border-toxic-neon/20 text-white/80 hover:bg-black/70 hover:border-toxic-neon/40"
                    )}
                    onClick={() => handleSelectOption(
                      currentQuestion.id, 
                      option.id, 
                      option.bountyHunterPoints, 
                      option.survivorPoints
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 border",
                          answers[currentQuestion.id] === option.id 
                            ? "border-toxic-neon" 
                            : "border-toxic-neon/30"
                        )}
                      >
                        {answers[currentQuestion.id] === option.id && (
                          <div className="w-3 h-3 rounded-full bg-toxic-neon"></div>
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="results-container">
          <div className="text-center mb-8">
            <h2 className="text-2xl text-toxic-neon mb-4">Assessment Complete</h2>
            <p className="text-white/70 max-w-md mx-auto">
              Based on your responses to the wasteland adaptation assessment, we've determined your optimal role in the Resistance.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div 
              className={cn(
                "p-6 rounded-lg border w-full md:w-auto text-center",
                role === 'bounty-hunter' 
                  ? "border-apocalypse-red bg-apocalypse-red/10" 
                  : "border-white/10 bg-black/50 opacity-50"
              )}
            >
              <Target 
                className={cn(
                  "h-16 w-16 mx-auto mb-4",
                  role === 'bounty-hunter' ? "text-apocalypse-red" : "text-white/30"
                )} 
              />
              <h3 className={cn(
                "text-xl font-bold mb-1",
                role === 'bounty-hunter' ? "text-apocalypse-red" : "text-white/40"
              )}>
                Bounty Hunter
              </h3>
              <div className="text-sm text-white/70 mb-3">
                {Math.round((bountyHunterScore / (bountyHunterScore + survivorScore)) * 100)}% Match
              </div>
              {role === 'bounty-hunter' && (
                <div className="mt-2 text-white/80 text-sm">
                  You are naturally drawn to tracking targets, administering justice, and operating independently in hostile territory.
                </div>
              )}
            </div>
            
            <div 
              className={cn(
                "p-6 rounded-lg border w-full md:w-auto text-center",
                role === 'survivor' 
                  ? "border-toxic-neon bg-toxic-neon/10" 
                  : "border-white/10 bg-black/50 opacity-50"
              )}
            >
              <Shield 
                className={cn(
                  "h-16 w-16 mx-auto mb-4",
                  role === 'survivor' ? "text-toxic-neon" : "text-white/30"
                )} 
              />
              <h3 className={cn(
                "text-xl font-bold mb-1",
                role === 'survivor' ? "text-toxic-neon" : "text-white/40"
              )}>
                Survivor
              </h3>
              <div className="text-sm text-white/70 mb-3">
                {Math.round((survivorScore / (bountyHunterScore + survivorScore)) * 100)}% Match
              </div>
              {role === 'survivor' && (
                <div className="mt-2 text-white/80 text-sm">
                  You excel at building communities, sharing resources, and creating sustainable systems that benefit the collective.
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-black/40 border border-toxic-neon/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Radiation className="h-5 w-5 text-toxic-neon" />
              <h3 className="text-lg text-toxic-neon">Role Analysis</h3>
            </div>
            
            <p className="text-white/80 text-sm mb-3">
              {role === 'bounty-hunter' 
                ? "Your psychological profile indicates a strong aptitude for justice-seeking and independent operations. The Resistance needs skilled hunters to track down those who corrupted the old system."
                : "Your psychological profile shows a natural inclination toward community-building and collaborative efforts. The settlements need visionaries like you to rebuild our civilization from the ashes."
              }
            </p>
            
            <div className="text-sm text-white/70">
              <div className="flex items-start gap-2 mb-1">
                <Check className="h-4 w-4 text-toxic-neon flex-shrink-0 mt-0.5" />
                <span>
                  {role === 'bounty-hunter'
                    ? "You will excel at tracking down crypto criminals and securing stolen assets."
                    : "You will thrive establishing sustainable economic systems in wasteland settlements."
                  }
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-toxic-neon flex-shrink-0 mt-0.5" />
                <span>
                  {role === 'bounty-hunter'
                    ? "Key strengths: tactical planning, target acquisition, independent action."
                    : "Key strengths: resource management, community building, long-term planning."
                  }
                </span>
              </div>
            </div>
          </div>
          
          <ToxicButton
            onClick={handleComplete}
            className="w-full bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
            size="lg"
          >
            <Radiation className="w-5 h-5 mr-2 text-toxic-neon" />
            <span className="flash-beacon">
              {role === 'bounty-hunter' 
                ? "INITIALIZE BOUNTY HUNTER PROTOCOL" 
                : "INITIALIZE SURVIVOR PROTOCOL"
              }
            </span>
          </ToxicButton>
        </div>
      )}
    </div>
  );
}
