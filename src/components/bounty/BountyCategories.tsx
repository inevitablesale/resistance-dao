
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PiggyBank, Code, MessageSquare, FileText, GalleryVertical, Briefcase } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useNavigate } from "react-router-dom";

export type BountyCategory = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  baseReward: string;
  path: string;
  active: boolean;
};

export const BOUNTY_CATEGORIES: BountyCategory[] = [
  {
    id: "nft-referrals",
    title: "NFT Referrals",
    description: "Earn $25 for each person you refer who purchases a membership NFT",
    icon: <PiggyBank className="h-6 w-6 text-toxic-neon" />,
    baseReward: "$25 per sale",
    path: "/referrals",
    active: true,
  },
  {
    id: "talent-acquisition",
    title: "Talent Acquisition",
    description: "Find qualified professionals for open roles and earn placement commissions",
    icon: <Users className="h-6 w-6 text-toxic-neon" />,
    baseReward: "10-20% of placement fee",
    path: "/hunt",
    active: true,
  },
  {
    id: "protocol-development",
    title: "Protocol Development",
    description: "Smart contract work, auditing, testing and feature development",
    icon: <Code className="h-6 w-6 text-toxic-neon" />,
    baseReward: "Based on project scope",
    path: "/hunt?category=protocol-development",
    active: false,
  },
  {
    id: "community-growth",
    title: "Community Growth",
    description: "Discord moderation, social media engagement, and event organization",
    icon: <MessageSquare className="h-6 w-6 text-toxic-neon" />,
    baseReward: "$10-50 per task",
    path: "/hunt?category=community",
    active: false,
  },
  {
    id: "content-creation",
    title: "Content Creation",
    description: "Articles, videos, graphics, and educational materials",
    icon: <FileText className="h-6 w-6 text-toxic-neon" />,
    baseReward: "$50-200 per piece",
    path: "/hunt?category=content",
    active: false,
  },
  {
    id: "governance-support",
    title: "Governance Support",
    description: "Proposal drafting, voting analysis, and community discussions",
    icon: <GalleryVertical className="h-6 w-6 text-toxic-neon" />,
    baseReward: "DAO tokens + fixed fee",
    path: "/hunt?category=governance",
    active: false,
  },
  {
    id: "business-development",
    title: "Business Development",
    description: "Partnerships, integrations, and client acquisition",
    icon: <Briefcase className="h-6 w-6 text-toxic-neon" />,
    baseReward: "Commission based",
    path: "/hunt?category=business",
    active: false,
  }
];

interface BountyCategoriesProps {
  showActive?: boolean;
}

export const BountyCategories: React.FC<BountyCategoriesProps> = ({ showActive = false }) => {
  const navigate = useNavigate();
  
  const filteredCategories = showActive 
    ? BOUNTY_CATEGORIES.filter(cat => cat.active)
    : BOUNTY_CATEGORIES;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredCategories.map((category) => (
        <Card 
          key={category.id}
          className={`border border-gray-800 bg-gray-900/80 backdrop-blur-sm hover:border-toxic-neon/50 transition-all ${!category.active ? 'opacity-70' : ''}`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              {category.icon}
              <span className="text-sm font-mono text-toxic-neon">{category.baseReward}</span>
            </div>
            <CardTitle className="text-lg text-white mt-2">{category.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">{category.description}</p>
            <div className="flex justify-end">
              <ToxicButton 
                onClick={() => navigate(category.path)} 
                variant={category.active ? "primary" : "outline"}
                disabled={!category.active}
                size="sm"
              >
                {category.active ? 'Browse Bounties' : 'Coming Soon'}
              </ToxicButton>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
