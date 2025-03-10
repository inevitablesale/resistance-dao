
import React, { useState } from "react";
import { Target, BadgeDollarSign, TrendingUp, Users, ArrowRight, Clock, Award, BarChart, FileText, Zap, Globe, Code, MessageSquare, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToxicBadge } from "@/components/ui/toxic-badge";

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
  gasEstimate: string;
  partyProtocolSteps: string[];
  category: 'community' | 'technical' | 'content' | 'business' | 'referral';
}

export const BountyHunterHub: React.FC = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('reward');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
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
      successRate: 92,
      gasEstimate: "Low (0.001 MATIC)",
      partyProtocolSteps: [
        "User signs referral link with wallet",
        "Referral is tracked on-chain",
        "Party contract distributes rewards when sale completes",
        "Claim rewards with single transaction"
      ],
      category: 'referral'
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
      successRate: 65,
      gasEstimate: "Medium (0.005 MATIC)",
      partyProtocolSteps: [
        "Join talent acquisition party pool",
        "Submit talent referrals through party governance",
        "Party members vote to approve placement",
        "Commission distributed via split contract"
      ],
      category: 'business'
    },
    {
      title: "Community Growth",
      description: "Help grow and engage our community",
      reward: "Task-based rewards",
      icon: <Globe className="h-6 w-6 text-toxic-neon" />,
      partyType: "Participation Party Pool",
      features: ["Activity rewards", "Governance rights", "Staking mechanisms"],
      action: "settlements/0x3456...",
      requiredLevel: 1,
      difficulty: 'easy',
      estimatedTime: "3-4 hours",
      successRate: 88,
      gasEstimate: "Low (0.001 MATIC)",
      partyProtocolSteps: [
        "Join community party with contribution",
        "Complete off-chain tasks and submit proof",
        "Party votes to approve contributions",
        "Rewards distributed via party governance"
      ],
      category: 'community'
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
      successRate: 75,
      gasEstimate: "Medium (0.003 MATIC)",
      partyProtocolSteps: [
        "Browse available content bounties in party",
        "Submit proposal to create content",
        "Deliver content and submit for review",
        "Party members vote on quality",
        "Receive payment through party treasurer contract"
      ],
      category: 'content'
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
      successRate: 45,
      gasEstimate: "High (0.01 MATIC)",
      partyProtocolSteps: [
        "Join business development party (requires staking)",
        "Submit partnership proposals via governance",
        "Execute deals with party multi-sig approval",
        "Receive commission through revenue sharing contract"
      ],
      category: 'business'
    },
    {
      title: "Technical Contribution",
      description: "Contribute code and technical solutions to the platform",
      reward: "$100-500 per task",
      icon: <Code className="h-6 w-6 text-toxic-neon" />,
      partyType: "Task Party Pool",
      features: ["Code reviews", "Milestone payments", "Technical governance"],
      action: "settlements/0x5678...",
      requiredLevel: 3,
      difficulty: 'hard',
      estimatedTime: "3-7 days",
      successRate: 62,
      gasEstimate: "Medium (0.005 MATIC)",
      partyProtocolSteps: [
        "Browse technical bounties in developer party",
        "Submit proposal to work on task",
        "Deliver code and documentation",
        "Code review through party governance",
        "Receive payment through milestone contract"
      ],
      category: 'technical'
    },
    {
      title: "Community Moderation",
      description: "Help moderate and maintain community spaces",
      reward: "Monthly stipend + bonus",
      icon: <MessageSquare className="h-6 w-6 text-toxic-neon" />,
      partyType: "Role Party Pool",
      features: ["Regular payments", "Role-based access", "Activity metrics"],
      action: "settlements/0x9012...",
      requiredLevel: 2,
      difficulty: 'medium',
      estimatedTime: "Ongoing",
      successRate: 82,
      gasEstimate: "Very Low (gas sponsored)",
      partyProtocolSteps: [
        "Apply for moderator role through party proposal",
        "Receive role-based NFT if approved",
        "Perform moderation duties and log activity",
        "Receive regular payments through streaming contract"
      ],
      category: 'community'
    },
    {
      title: "Protocol Testing",
      description: "Test new features and report bugs",
      reward: "$20-100 per valid bug",
      icon: <Zap className="h-6 w-6 text-toxic-neon" />,
      partyType: "Bounty Party Pool",
      features: ["Bug bounties", "Test coverage", "First-finder rewards"],
      action: "settlements/0xabcd...",
      requiredLevel: 1,
      difficulty: 'easy',
      estimatedTime: "Varies",
      successRate: 95,
      gasEstimate: "Low (0.002 MATIC)",
      partyProtocolSteps: [
        "Join tester party with small contribution",
        "Submit bug reports through party interface",
        "Party members vote to validate bugs",
        "Receive rewards based on severity and impact"
      ],
      category: 'technical'
    }
  ];
  
  // Filter bounties based on selected difficulty and category
  const filteredBounties = bountyCategories.filter(b => {
    const difficultyMatch = filterDifficulty === 'all' || b.difficulty === filterDifficulty;
    const categoryMatch = activeCategory === 'all' || b.category === activeCategory;
    return difficultyMatch && categoryMatch;
  });
    
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
      <div className="space-y-4">
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="bg-gray-900/30 p-1 border border-gray-800 mb-4">
            <TabsTrigger value="all">All Types</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="referral">Referral</TabsTrigger>
          </TabsList>
          
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
          <TabsContent value={activeCategory} className="mt-0">
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
                      
                      <div className="bg-black/30 p-3 rounded-lg border border-toxic-neon/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="h-4 w-4 text-toxic-neon" />
                          <p className="text-sm text-gray-300">Gas Estimate: <span className="text-toxic-neon">{category.gasEstimate}</span></p>
                        </div>
                        
                        <div className="space-y-1 mt-2">
                          <p className="text-xs text-gray-400 mb-1">Party Protocol Flow:</p>
                          {category.partyProtocolSteps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                              <div className="min-w-4 pt-0.5">
                                <div className="w-1 h-1 bg-toxic-neon rounded-full"></div>
                              </div>
                              <p>{step}</p>
                            </div>
                          ))}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
