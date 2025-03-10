
import React, { useState } from "react";
import { Target, BadgeDollarSign, TrendingUp, Users, ArrowRight, Clock, Award, BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface BountyCategory {
  title: string;
  description: string;
  reward: string;
  icon: React.ReactNode;
  partyType: string;
  features: string[];
  action: string;
  requiredLevel: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  successRate: number;
}

export const BountyHunterHub: React.FC = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('reward');
  
  // Mock hunter stats
  const hunterStats = {
    level: 2,
    reputation: 78,
    totalEarned: "$325",
    successRate: 87,
    completedBounties: 8,
    activeBounties: 2
  };
  
  const bountyCategories: BountyCategory[] = [
    {
      title: "NFT Referrals",
      description: "Earn rewards for referring new NFT holders to the platform",
      reward: "$25 per sale",
      icon: <Target className="h-6 w-6 text-toxic-neon" />,
      partyType: "Reward Party Pool",
      features: ["Fixed rewards", "Automatic distribution", "Provable attribution"],
      action: "/referral",
      requiredLevel: 1,
      difficulty: 'easy',
      estimatedTime: "1-2 hours",
      successRate: 92
    },
    {
      title: "Talent Acquisition",
      description: "Help match talent with settlement opportunities",
      reward: "10-20% of placement fee",
      icon: <Users className="h-6 w-6 text-toxic-neon" />,
      partyType: "Reward Party Pool",
      features: ["Commission-based", "Performance tracking", "Long-term relationships"],
      action: "settlements/0x1234...",
      requiredLevel: 2,
      difficulty: 'medium',
      estimatedTime: "2-5 days",
      successRate: 65
    },
    {
      title: "Community Growth",
      description: "Help grow and engage our community",
      reward: "Task-based rewards",
      icon: <Users className="h-6 w-6 text-toxic-neon" />,
      partyType: "Participation Party Pool",
      features: ["Activity rewards", "Governance rights", "Staking mechanisms"],
      action: "settlements/0x3456...",
      requiredLevel: 1,
      difficulty: 'easy',
      estimatedTime: "3-4 hours",
      successRate: 88
    },
    {
      title: "Content Creation",
      description: "Create engaging content for the community",
      reward: "$50-200 per piece",
      icon: <FileText className="h-6 w-6 text-toxic-neon" />,
      partyType: "Task Party Pool",
      features: ["Quality voting", "Deliverable verification", "Token incentives"],
      action: "settlements/0x4567...",
      requiredLevel: 3,
      difficulty: 'medium',
      estimatedTime: "1-3 days",
      successRate: 75
    },
    {
      title: "Business Development",
      description: "Expand our network and partnerships",
      reward: "Commission-based",
      icon: <BadgeDollarSign className="h-6 w-6 text-toxic-neon" />,
      partyType: "Revenue Share Party Pool",
      features: ["Revenue sharing", "Performance rewards", "Partnership rights"],
      action: "settlements/0x6789...",
      requiredLevel: 4,
      difficulty: 'hard',
      estimatedTime: "1-2 weeks",
      successRate: 45
    }
  ];
  
  // Filter bounties based on selected difficulty
  const filteredBounties = filterDifficulty === 'all' 
    ? bountyCategories 
    : bountyCategories.filter(b => b.difficulty === filterDifficulty);
    
  // Sort bounties based on selected criteria
  const sortedBounties = [...filteredBounties].sort((a, b) => {
    if (sortBy === 'reward') {
      // Simple sorting, would need more complex logic for actual implementation
      return b.reward.length - a.reward.length;
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    } else if (sortBy === 'successRate') {
      return b.successRate - a.successRate;
    }
    return 0;
  });
  
  // Handler for bounty selection
  const handleViewOpportunities = (category: BountyCategory) => {
    if (hunterStats.level < category.requiredLevel) {
      // Cannot proceed due to level requirement
      return;
    }
    
    if (category.action.startsWith('/')) {
      navigate(category.action);
    } else if (category.action.startsWith('settlements/')) {
      navigate(`/${category.action}`);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Hunter Stats Dashboard */}
      <ToxicCard className="bg-gray-900/60 border border-toxic-neon/40">
        <ToxicCardHeader>
          <div className="flex justify-between items-center">
            <ToxicCardTitle>Bounty Hunter Dashboard</ToxicCardTitle>
            <span className="text-toxic-neon font-mono text-sm px-3 py-1 rounded-full bg-black/60 border border-toxic-neon/40">
              Level {hunterStats.level} Hunter
            </span>
          </div>
        </ToxicCardHeader>
        <ToxicCardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
              <div className="flex items-center gap-2 mb-2">
                <BadgeDollarSign className="h-5 w-5 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Total Earned</span>
              </div>
              <span className="text-2xl font-bold text-white block">{hunterStats.totalEarned}</span>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Reputation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{hunterStats.reputation}</span>
                <Progress value={hunterStats.reputation} className="h-2 w-16 mt-1" />
              </div>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Success Rate</span>
              </div>
              <span className="text-2xl font-bold text-white block">{hunterStats.successRate}%</span>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Bounties</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xl font-bold text-white">{hunterStats.completedBounties} <span className="text-xs text-gray-400">completed</span></span>
                <span className="text-xl font-bold text-toxic-neon">{hunterStats.activeBounties} <span className="text-xs text-gray-400">active</span></span>
              </div>
            </div>
          </div>
        </ToxicCardContent>
      </ToxicCard>
      
      {/* Bounty Filtering and Sorting */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-900/30 p-4 rounded-lg border border-gray-800">
        <div className="space-x-2">
          <span className="text-gray-400">Filter:</span>
          <ToxicButton 
            variant={filterDifficulty === 'all' ? 'outline' : 'ghost'} 
            size="sm"
            onClick={() => setFilterDifficulty('all')}
          >
            All
          </ToxicButton>
          <ToxicButton 
            variant={filterDifficulty === 'easy' ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setFilterDifficulty('easy')}
          >
            Easy
          </ToxicButton>
          <ToxicButton 
            variant={filterDifficulty === 'medium' ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setFilterDifficulty('medium')}
          >
            Medium
          </ToxicButton>
          <ToxicButton 
            variant={filterDifficulty === 'hard' ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setFilterDifficulty('hard')}
          >
            Hard
          </ToxicButton>
        </div>
        
        <div className="space-x-2">
          <span className="text-gray-400">Sort by:</span>
          <ToxicButton 
            variant={sortBy === 'reward' ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('reward')}
          >
            Reward
          </ToxicButton>
          <ToxicButton 
            variant={sortBy === 'difficulty' ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('difficulty')}
          >
            Difficulty
          </ToxicButton>
          <ToxicButton 
            variant={sortBy === 'successRate' ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('successRate')}
          >
            Success Rate
          </ToxicButton>
        </div>
      </div>
      
      {/* Bounty Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedBounties.map((category, index) => (
          <Card 
            key={index} 
            className={`bg-gray-900/50 border-toxic-neon/30 hover:border-toxic-neon/60 transition-all duration-300 ${hunterStats.level < category.requiredLevel ? 'opacity-50' : ''}`}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {category.icon}
                <CardTitle className="text-xl text-white">{category.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-black/30 p-3 rounded-lg border border-toxic-neon/20">
                  <p className="text-toxic-neon font-mono flex items-center gap-2 mb-1">
                    <BadgeDollarSign className="h-4 w-4" />
                    {category.reward}
                  </p>
                  <p className="text-sm text-gray-400">{category.partyType}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-300">
                    <BarChart className="h-3 w-3 text-toxic-neon/80" />
                    {category.difficulty.charAt(0).toUpperCase() + category.difficulty.slice(1)} difficulty
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <Clock className="h-3 w-3 text-toxic-neon/80" />
                    {category.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <Award className="h-3 w-3 text-toxic-neon/80" />
                    Level {category.requiredLevel}+ required
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <TrendingUp className="h-3 w-3 text-toxic-neon/80" />
                    {category.successRate}% success rate
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {category.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                      <div className="w-1 h-1 bg-toxic-neon rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <ToxicButton 
                className="w-full justify-between"
                variant="outline"
                onClick={() => handleViewOpportunities(category)}
                disabled={hunterStats.level < category.requiredLevel}
              >
                {hunterStats.level < category.requiredLevel ? 
                  `Requires Level ${category.requiredLevel}` : 
                  "View Opportunities"}
                <ArrowRight className="h-4 w-4" />
              </ToxicButton>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
