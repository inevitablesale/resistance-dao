
import React from "react";
import { ReferralSystem } from "@/components/radiation/ReferralSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Code, UserPlus, FileText, GalleryVertical, BadgeDollarSign, ArrowRight } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface BountyCategory {
  title: string;
  description: string;
  reward: string;
  icon: React.ReactNode;
  partyType: string;
  features: string[];
  action: string; // URL or action identifier
}

export const Hunt = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const bountyCategories: BountyCategory[] = [
    {
      title: "NFT Referrals",
      description: "Earn rewards for referring new NFT holders to the platform",
      reward: "$25 per sale",
      icon: <Target className="h-6 w-6 text-toxic-neon" />,
      partyType: "Reward Party Pool",
      features: ["Fixed rewards", "Automatic distribution", "Provable attribution"],
      action: "/referral" // Redirect to referral system
    },
    {
      title: "Talent Acquisition",
      description: "Help match talent with settlement opportunities",
      reward: "10-20% of placement fee",
      icon: <Users className="h-6 w-6 text-toxic-neon" />,
      partyType: "Reward Party Pool",
      features: ["Commission-based", "Performance tracking", "Long-term relationships"],
      action: "settlements/0x1234..." // Example party address, should come from actual deployed contract
    },
    {
      title: "Protocol Development",
      description: "Contribute to building and improving our protocol",
      reward: "Project-based",
      icon: <Code className="h-6 w-6 text-toxic-neon" />,
      partyType: "Task Party Pool",
      features: ["Milestone payments", "Multi-sig approval", "Token distribution"],
      action: "settlements/0x2345..." // Example party address
    },
    {
      title: "Community Growth",
      description: "Help grow and engage our community",
      reward: "Task-based rewards",
      icon: <UserPlus className="h-6 w-6 text-toxic-neon" />,
      partyType: "Participation Party Pool",
      features: ["Activity rewards", "Governance rights", "Staking mechanisms"],
      action: "settlements/0x3456..." // Example party address
    },
    {
      title: "Content Creation",
      description: "Create engaging content for the community",
      reward: "$50-200 per piece",
      icon: <FileText className="h-6 w-6 text-toxic-neon" />,
      partyType: "Task Party Pool",
      features: ["Quality voting", "Deliverable verification", "Token incentives"],
      action: "settlements/0x4567..." // Example party address
    },
    {
      title: "Governance Support",
      description: "Help maintain and improve governance processes",
      reward: "DAO tokens + fixed fee",
      icon: <GalleryVertical className="h-6 w-6 text-toxic-neon" />,
      partyType: "Participation Party Pool",
      features: ["Token rewards", "Voting power", "Long-term alignment"],
      action: "settlements/0x5678..." // Example party address
    },
    {
      title: "Business Development",
      description: "Expand our network and partnerships",
      reward: "Commission-based",
      icon: <BadgeDollarSign className="h-6 w-6 text-toxic-neon" />,
      partyType: "Revenue Share Party Pool",
      features: ["Revenue sharing", "Performance rewards", "Partnership rights"],
      action: "settlements/0x6789..." // Example party address
    }
  ];

  // Handler for button clicks
  const handleViewOpportunities = (category: BountyCategory) => {
    if (category.action.startsWith('/')) {
      // Internal route
      navigate(category.action);
    } else if (category.action.startsWith('settlements/')) {
      // Party protocol settlement
      navigate(`/${category.action}`);
    } else {
      // For any other cases (e.g., when we don't have a deployment yet)
      toast({
        title: `${category.title} Opportunities`,
        description: "This feature is coming soon. Check back later!",
        variant: "default",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-r from-gray-900 to-black py-16 px-4 border-b border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-white flex items-center gap-3">
            <Target className="h-8 w-8 text-toxic-neon" />
            Bounty Hunter's Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Choose your path, complete bounties, and earn rewards in the wasteland
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Referral System - Left Side */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-20">
              <ReferralSystem />
            </div>
          </div>
          
          {/* Main Content - Bounty Categories */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bountyCategories.map((category, index) => (
                <Card key={index} className="bg-gray-900/50 border-toxic-neon/30 hover:border-toxic-neon/60 transition-all duration-300">
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
                      <ul className="space-y-2">
                        {category.features.map((feature, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-toxic-neon rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <ToxicButton 
                        className="w-full justify-between"
                        variant="outline"
                        onClick={() => handleViewOpportunities(category)}
                      >
                        View Opportunities
                        <ArrowRight className="h-4 w-4" />
                      </ToxicButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hunt;
