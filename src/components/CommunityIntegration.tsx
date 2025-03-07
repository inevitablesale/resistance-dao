
import React, { useState, useEffect } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Users, MessageCircle, Target, Shield, Clock, Radiation, Zap, Trophy, ArrowRight } from 'lucide-react';

interface CommunityIntegrationProps {
  role: "bounty-hunter" | "survivor" | null;
  className?: string;
}

type Testimonial = {
  id: number;
  name: string;
  role: "bounty-hunter" | "survivor";
  avatarUrl?: string;
  content: string;
  achievement: string;
};

type Challenge = {
  id: number;
  title: string;
  description: string;
  reward: string;
  participants: number;
  timeRemaining: string;
  progress: number;
  forRole: "bounty-hunter" | "survivor" | "both";
};

export function CommunityIntegration({ role, className }: CommunityIntegrationProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  
  useEffect(() => {
    // Sample testimonials data
    const allTestimonials: Testimonial[] = [
      {
        id: 1,
        name: "ShadowTracker",
        role: "bounty-hunter",
        content: "Before joining the Resistance, I was hunting solo in the wasteland. Now I'm part of a network that shares intel on high-value targets. Last month, our coordinated effort recovered 50,000 RD tokens from a group of liquidity thieves.",
        achievement: "Recovered 120,000 RD from criminals"
      },
      {
        id: 2,
        name: "MedicUnit_7",
        role: "survivor",
        content: "When radiation levels spiked in Sector 9, our settlement was facing extinction. The Resistance funded our water purification project with 35,000 RD. Now we not only survived but supply clean water to three neighboring outposts.",
        achievement: "Established vital water trade route"
      },
      {
        id: 3,
        name: "Cryptosniper",
        role: "bounty-hunter",
        content: "I tracked the infamous 'Ghost Protocol' for months - a dev who injected backdoors into protocols before the winter. When I finally captured him, the bounty funded our security network for a year. Justice served.",
        achievement: "Captured #2 most wanted criminal"
      },
      {
        id: 4,
        name: "Builder_K12",
        role: "survivor",
        content: "Our settlement specialized in repurposing old-world tech. The Resistance economy allowed us to trade our innovations for essential supplies. We've grown from 12 survivors to a thriving community of 64.",
        achievement: "Developed solar power network"
      }
    ];
    
    // Filter testimonials by role if one is selected
    const filteredTestimonials = role 
      ? [...allTestimonials.filter(t => t.role === role), ...allTestimonials.filter(t => t.role !== role).slice(0, 1)]
      : allTestimonials;
    
    setTestimonials(filteredTestimonials);
    
    // Sample challenges data
    const allChallenges: Challenge[] = [
      {
        id: 1,
        title: "Radiation Zone Reconnaissance",
        description: "Map safe routes through the newly emerged toxic zones in Sector 7. Data will be vital for both hunter operations and settlement expansion.",
        reward: "7,500 RD + Status Boost",
        participants: 34,
        timeRemaining: "2d 7h",
        progress: 68,
        forRole: "both"
      },
      {
        id: 2,
        title: "Mutant Protocol Neutralization",
        description: "A dangerous self-replicating protocol is draining settlement resources. Track and neutralize all instances before it spreads beyond our defensive perimeter.",
        reward: "15,000 RD + Trophy NFT",
        participants: 27,
        timeRemaining: "16h 42m",
        progress: 43,
        forRole: "bounty-hunter"
      },
      {
        id: 3,
        title: "Resilient Infrastructure Initiative",
        description: "Our settlements need upgraded communication networks that can withstand radiation storms. Contribute to building and testing the new mesh system.",
        reward: "12,000 RD + Resource Access",
        participants: 51,
        timeRemaining: "4d 12h",
        progress: 29,
        forRole: "survivor"
      }
    ];
    
    // Filter challenges by role if one is selected
    const filteredChallenges = role
      ? allChallenges.filter(c => c.forRole === role || c.forRole === "both")
      : allChallenges;
    
    setChallenges(filteredChallenges);
    
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonialIndex(prev => 
        prev < filteredTestimonials.length - 1 ? prev + 1 : 0
      );
    }, 8000);
    
    return () => clearInterval(testimonialInterval);
  }, [role]);
  
  return (
    <div className={`community-integration ${className || ''}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-toxic-neon" />
            <h3 className="text-lg font-mono text-toxic-neon">Wasteland Communities</h3>
          </div>
          
          <ToxicButton
            variant="ghost"
            size="sm"
            className="text-toxic-neon/70 hover:text-toxic-neon hover:bg-toxic-neon/5"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </ToxicButton>
        </div>
        
        {/* Survivor Testimonials */}
        <div className="mb-8">
          <h4 className="text-white/80 font-semibold mb-3 flex items-center">
            <MessageCircle className="h-4 w-4 mr-2 text-toxic-neon" />
            Resistance Member Testimonials
          </h4>
          
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`testimonial-card transition-all duration-500 ${
                  index === activeTestimonialIndex 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 absolute top-0 left-0 translate-x-8'
                }`}
              >
                <ToxicCard className={`bg-black/70 ${
                  testimonial.role === "bounty-hunter" 
                    ? "border-apocalypse-red/30" 
                    : "border-toxic-neon/30"
                }`}>
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        testimonial.role === "bounty-hunter"
                          ? "bg-apocalypse-red/20"
                          : "bg-toxic-neon/20"
                      }`}>
                        {testimonial.role === "bounty-hunter" ? (
                          <Target className="h-6 w-6 text-apocalypse-red" />
                        ) : (
                          <Shield className="h-6 w-6 text-toxic-neon" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-white">{testimonial.name}</div>
                          <div className={`text-xs ${
                            testimonial.role === "bounty-hunter"
                              ? "text-apocalypse-red"
                              : "text-toxic-neon"
                          }`}>
                            {testimonial.role === "bounty-hunter" ? "BOUNTY HUNTER" : "SURVIVOR"}
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-sm mb-3">{testimonial.content}</p>
                        
                        <div className="flex items-center text-xs">
                          <Trophy className={`h-3.5 w-3.5 mr-1.5 ${
                            testimonial.role === "bounty-hunter"
                              ? "text-apocalypse-red"
                              : "text-toxic-neon"
                          }`} />
                          <span className="text-white/50">{testimonial.achievement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ToxicCard>
              </div>
            ))}
            
            <div className="flex justify-center gap-1 mt-3">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeTestimonialIndex 
                      ? 'bg-toxic-neon' 
                      : 'bg-toxic-neon/30'
                  }`}
                  onClick={() => setActiveTestimonialIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Community Challenges */}
        <div>
          <h4 className="text-white/80 font-semibold mb-3 flex items-center">
            <Radiation className="h-4 w-4 mr-2 text-toxic-neon" />
            Active Community Challenges
          </h4>
          
          <div className="space-y-4">
            {challenges.map(challenge => (
              <ToxicCard 
                key={challenge.id}
                className={`bg-black/70 hover:bg-black/60 transition-colors ${
                  challenge.forRole === "bounty-hunter" 
                    ? "border-apocalypse-red/30" 
                    : challenge.forRole === "survivor"
                      ? "border-toxic-neon/30"
                      : "border-toxic-neon/20"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-white flex items-center">
                      {challenge.forRole === "bounty-hunter" ? (
                        <Target className="h-4 w-4 mr-2 text-apocalypse-red" />
                      ) : challenge.forRole === "survivor" ? (
                        <Shield className="h-4 w-4 mr-2 text-toxic-neon" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2 text-toxic-neon" />
                      )}
                      {challenge.title}
                    </h5>
                    
                    <div className="flex items-center text-xs gap-1 text-white/50">
                      <Clock className="h-3.5 w-3.5 text-toxic-neon" />
                      <span>{challenge.timeRemaining}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3">{challenge.description}</p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                    <div className="bg-black/40 p-2 rounded border border-toxic-neon/10">
                      <div className="text-white/50 mb-1">Reward</div>
                      <div className="text-toxic-neon">{challenge.reward}</div>
                    </div>
                    
                    <div className="bg-black/40 p-2 rounded border border-toxic-neon/10">
                      <div className="text-white/50 mb-1">Participants</div>
                      <div className="text-toxic-neon">{challenge.participants}</div>
                    </div>
                    
                    <div className="bg-black/40 p-2 rounded border border-toxic-neon/10">
                      <div className="text-white/50 mb-1">Progress</div>
                      <div className="text-toxic-neon">{challenge.progress}%</div>
                    </div>
                  </div>
                  
                  <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-toxic-neon/70 rounded-full"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-end">
                    <ToxicButton
                      size="sm"
                      variant="outline"
                      className="border-toxic-neon/50 text-toxic-neon hover:bg-toxic-neon/10"
                    >
                      Join Challenge
                    </ToxicButton>
                  </div>
                </div>
              </ToxicCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
