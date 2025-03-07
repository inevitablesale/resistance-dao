
import React, { useState, useEffect } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { Shield, Target, ArrowRight, Check, Radiation, AlertTriangle } from 'lucide-react';
import { ToxicButton } from '@/components/ui/toxic-button';

interface WastelandQuestionnaireProps {
  onComplete: (role: "bounty-hunter" | "survivor") => void;
  className?: string;
}

type Question = {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    bountyHunterScore: number;
    survivorScore: number;
  }[];
};

export function WastelandQuestionnaire({ onComplete, className }: WastelandQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [bountyHunterScore, setBountyHunterScore] = useState(0);
  const [survivorScore, setSurvivorScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"bounty-hunter" | "survivor" | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  const beepRef = useRef<HTMLAudioElement>(null);
  const successRef = useRef<HTMLAudioElement>(null);
  
  const questions: Question[] = [
    {
      id: 1,
      text: "How do you approach resource scarcity in the wasteland?",
      options: [
        {
          id: "1a",
          text: "Track down those hoarding resources and liberate them for the people",
          bountyHunterScore: 8,
          survivorScore: 3
        },
        {
          id: "1b",
          text: "Develop sustainable systems to create more for everyone",
          bountyHunterScore: 2,
          survivorScore: 9
        },
        {
          id: "1c",
          text: "Protect what you have at all costs - survival is personal",
          bountyHunterScore: 6,
          survivorScore: 4
        }
      ]
    },
    {
      id: 2,
      text: "What was your role in the old world before the collapse?",
      options: [
        {
          id: "2a",
          text: "Security or law enforcement - protecting order",
          bountyHunterScore: 9,
          survivorScore: 3
        },
        {
          id: "2b",
          text: "Builder, engineer, or scientist - creating value",
          bountyHunterScore: 2,
          survivorScore: 8
        },
        {
          id: "2c",
          text: "Trader or negotiator - facilitating exchange",
          bountyHunterScore: 5,
          survivorScore: 6
        }
      ]
    },
    {
      id: 3,
      text: "When faced with a corrupt settlement leader stealing community funds, you would:",
      options: [
        {
          id: "3a",
          text: "Gather evidence and bring them to justice publicly as an example",
          bountyHunterScore: 9,
          survivorScore: 3
        },
        {
          id: "3b",
          text: "Work with community members to build a new governance system",
          bountyHunterScore: 2,
          survivorScore: 9
        },
        {
          id: "3c",
          text: "Avoid the conflict altogether and find a safer settlement",
          bountyHunterScore: 4,
          survivorScore: 3
        }
      ]
    },
    {
      id: 4,
      text: "You discover technology that could help many people. Do you:",
      options: [
        {
          id: "4a",
          text: "Use it to enhance your own capabilities as a hunter",
          bountyHunterScore: 8,
          survivorScore: 2
        },
        {
          id: "4b",
          text: "Share it with your settlement to strengthen collective survival",
          bountyHunterScore: 2,
          survivorScore: 9
        },
        {
          id: "4c",
          text: "Study it carefully to understand all potential applications",
          bountyHunterScore: 5,
          survivorScore: 5
        }
      ]
    },
    {
      id: 5,
      text: "The wasteland is full of dangers. Which statement best describes you?",
      options: [
        {
          id: "5a",
          text: "I am the danger. Those who threaten others should fear me.",
          bountyHunterScore: 10,
          survivorScore: 1
        },
        {
          id: "5b",
          text: "Safety comes through community. Together we're stronger.",
          bountyHunterScore: 1,
          survivorScore: 10
        },
        {
          id: "5c",
          text: "Adaptation and intelligence are key to navigating threats.",
          bountyHunterScore: 5,
          survivorScore: 7
        }
      ]
    }
  ];
  
  const currentQuestion = questions[currentQuestionIndex];
  
  useEffect(() => {
    // Calculate scores whenever answers change
    let bScore = 0;
    let sScore = 0;
    
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (!question) return;
      
      const option = question.options.find(o => o.id === answerId);
      if (!option) return;
      
      bScore += option.bountyHunterScore;
      sScore += option.survivorScore;
    });
    
    setBountyHunterScore(bScore);
    setSurvivorScore(sScore);
    
    // Determine role once all questions are answered
    if (Object.keys(answers).length === questions.length) {
      setSelectedRole(bScore > sScore ? "bounty-hunter" : "survivor");
    }
  }, [answers]);
  
  const handleSelectOption = (optionId: string) => {
    // Play select sound
    if (audioEnabled && beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play().catch(() => {});
    }
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
    
    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setShowResults(true);
        
        // Play success sound
        if (audioEnabled && successRef.current) {
          successRef.current.currentTime = 0;
          successRef.current.play().catch(() => {});
        }
      }, 800);
    }
  };
  
  const handleComplete = () => {
    if (selectedRole) {
      onComplete(selectedRole);
    }
  };
  
  // Initialize AudioContext when enabling audio
  const handleEnableAudio = () => {
    // Create AudioContext
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);
    setAudioEnabled(true);
  };
  
  return (
    <div className={`wasteland-questionnaire ${className || ''}`}>
      {/* Audio elements */}
      <audio ref={beepRef} src="/sounds/terminal-beep.mp3" />
      <audio ref={successRef} src="/sounds/success.mp3" />
      
      <ToxicCard className="bg-black/80 border-toxic-neon/30">
        <div className="p-6">
          {!showResults ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-toxic-neon text-lg flex items-center">
                  <Radiation className="h-5 w-5 mr-2" />
                  Wasteland Role Assessment
                </h3>
                
                {!audioEnabled && (
                  <button 
                    onClick={handleEnableAudio} 
                    className="text-toxic-neon/60 hover:text-toxic-neon text-xs flex items-center"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Enable Audio
                  </button>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="text-toxic-neon">
                    {Math.floor(((currentQuestionIndex) / questions.length) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-toxic-neon rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-white text-xl mb-4">{currentQuestion.text}</h4>
                
                <div className="space-y-4">
                  {currentQuestion.options.map(option => (
                    <button
                      key={option.id}
                      className={`w-full text-left p-4 rounded border transition-all ${
                        answers[currentQuestion.id] === option.id 
                          ? 'bg-toxic-neon/20 border-toxic-neon text-toxic-neon' 
                          : 'bg-black/40 border-toxic-neon/30 text-white/80 hover:bg-black/60 hover:border-toxic-neon/60'
                      }`}
                      onClick={() => handleSelectOption(option.id)}
                      disabled={!!answers[currentQuestion.id]}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mt-0.5 ${
                          answers[currentQuestion.id] === option.id 
                            ? 'border-toxic-neon bg-toxic-neon/20' 
                            : 'border-toxic-neon/30'
                        }`}>
                          {answers[currentQuestion.id] === option.id && (
                            <Check className="w-3 h-3 text-toxic-neon" />
                          )}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className={`p-3 rounded border ${
                  answers[currentQuestion.id] && bountyHunterScore > survivorScore
                    ? 'border-apocalypse-red/60 bg-apocalypse-red/10'
                    : 'border-apocalypse-red/20 bg-black/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className={`h-5 w-5 ${
                      answers[currentQuestion.id] && bountyHunterScore > survivorScore
                        ? 'text-apocalypse-red'
                        : 'text-apocalypse-red/50'
                    }`} />
                    <span className={`${
                      answers[currentQuestion.id] && bountyHunterScore > survivorScore
                        ? 'text-apocalypse-red'
                        : 'text-white/50'
                    }`}>
                      Bounty Hunter
                    </span>
                  </div>
                  
                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-apocalypse-red/70 rounded-full transition-all duration-700"
                      style={{ 
                        width: `${Math.min(100, (bountyHunterScore / (questions.length * 10)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className={`p-3 rounded border ${
                  answers[currentQuestion.id] && survivorScore >= bountyHunterScore
                    ? 'border-toxic-neon/60 bg-toxic-neon/10'
                    : 'border-toxic-neon/20 bg-black/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className={`h-5 w-5 ${
                      answers[currentQuestion.id] && survivorScore >= bountyHunterScore
                        ? 'text-toxic-neon'
                        : 'text-toxic-neon/50'
                    }`} />
                    <span className={`${
                      answers[currentQuestion.id] && survivorScore >= bountyHunterScore
                        ? 'text-toxic-neon'
                        : 'text-white/50'
                    }`}>
                      Survivor
                    </span>
                  </div>
                  
                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-toxic-neon/70 rounded-full transition-all duration-700"
                      style={{ 
                        width: `${Math.min(100, (survivorScore / (questions.length * 10)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl text-toxic-neon mb-6">Assessment Complete</h3>
              
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className={`p-6 rounded-lg border ${selectedRole === 'bounty-hunter' ? 'border-apocalypse-red bg-apocalypse-red/10' : 'border-white/10 bg-black/30'}`}>
                  <Target className={`h-16 w-16 mx-auto mb-3 ${selectedRole === 'bounty-hunter' ? 'text-apocalypse-red' : 'text-white/30'}`} />
                  <div className={`text-center ${selectedRole === 'bounty-hunter' ? 'text-apocalypse-red' : 'text-white/50'}`}>
                    <div className="text-lg font-bold mb-1">Bounty Hunter</div>
                    <div className="text-sm">{Math.round((bountyHunterScore / (bountyHunterScore + survivorScore)) * 100)}%</div>
                  </div>
                </div>
                
                <div className={`p-6 rounded-lg border ${selectedRole === 'survivor' ? 'border-toxic-neon bg-toxic-neon/10' : 'border-white/10 bg-black/30'}`}>
                  <Shield className={`h-16 w-16 mx-auto mb-3 ${selectedRole === 'survivor' ? 'text-toxic-neon' : 'text-white/30'}`} />
                  <div className={`text-center ${selectedRole === 'survivor' ? 'text-toxic-neon' : 'text-white/50'}`}>
                    <div className="text-lg font-bold mb-1">Survivor</div>
                    <div className="text-sm">{Math.round((survivorScore / (bountyHunterScore + survivorScore)) * 100)}%</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 p-4 rounded-lg border border-toxic-neon/30 bg-black/40 text-left">
                <h4 className="font-bold text-toxic-neon mb-3">
                  {selectedRole === 'bounty-hunter' ? 'You are a BOUNTY HUNTER' : 'You are a SURVIVOR'}
                </h4>
                
                <p className="text-white/80 mb-4">
                  {selectedRole === 'bounty-hunter' 
                    ? 'Your answers reveal a strong sense of justice and exceptional tracking instincts. The wasteland needs hunters like you to bring order to chaos by tracking down those who continue to exploit the system.'
                    : 'Your responses indicate a natural talent for community building and resource management. The wasteland needs visionaries like you to rebuild society from the ashes of the old world.'}
                </p>
                
                <div className="text-white/70 text-sm">
                  <div className="mb-2">
                    <span className="text-toxic-neon">Key Attributes:</span> {selectedRole === 'bounty-hunter' 
                      ? 'Strategic thinking, independence, decisive action' 
                      : 'Cooperation, long-term planning, innovation'}
                  </div>
                  <div>
                    <span className="text-toxic-neon">Role in Economy:</span> {selectedRole === 'bounty-hunter' 
                      ? 'Asset recovery, security enforcement, threat elimination' 
                      : 'Resource management, community governance, infrastructure development'}
                  </div>
                </div>
              </div>
              
              <ToxicButton
                onClick={handleComplete}
                className="w-full bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
                size="lg"
              >
                <Radiation className="w-5 h-5 mr-2 text-toxic-neon" />
                <span className="flash-beacon">JOIN THE RESISTANCE AS A {selectedRole?.toUpperCase()}</span>
              </ToxicButton>
            </div>
          )}
        </div>
      </ToxicCard>
    </div>
  );
}
