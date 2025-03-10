
import React from "react";
import { Target, Shield, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useNFTRoles } from "@/hooks/useNFTRoles";

interface RoleBasedHubProps {
  onSelectRole: (role: string) => void;
}

interface RoleCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  abilities: string[];
  unlocked: boolean;
}

export const RoleBasedHub: React.FC<RoleBasedHubProps> = ({ onSelectRole }) => {
  const { primaryRole, isSentinel, isSurvivor, isBountyHunter } = useNFTRoles();
  
  const roleCards: RoleCard[] = [
    {
      title: "Sentinel",
      description: "Create and manage bounties, fund projects, and oversee wasteland operations",
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      color: "from-blue-900/20 to-blue-600/10",
      abilities: [
        "Create bounty programs",
        "Fund survivor projects",
        "Deploy reward pools",
        "Monitor hunter performance"
      ],
      unlocked: isSentinel
    },
    {
      title: "Survivor",
      description: "Develop technical solutions, create content, and build community projects",
      icon: <Zap className="h-8 w-8 text-purple-400" />,
      color: "from-purple-900/20 to-purple-600/10",
      abilities: [
        "Create technical projects",
        "Request development funding",
        "Manage contributor tasks",
        "Deploy participation pools"
      ],
      unlocked: isSurvivor
    },
    {
      title: "Bounty Hunter",
      description: "Complete bounties, earn rewards, and build your reputation in the wasteland",
      icon: <Target className="h-8 w-8 text-toxic-neon" />,
      color: "from-green-900/20 to-green-600/10",
      abilities: [
        "Accept available bounties",
        "Track completion status",
        "Build hunter reputation",
        "Earn role-based rewards"
      ],
      unlocked: isBountyHunter
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-gradient-to-r from-gray-900 to-black border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Wasteland Role Hub</h2>
        <p className="text-gray-300 mb-4">
          Access role-specific interfaces for creating, managing, and completing bounties based on your NFT role.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleCards.map((role, index) => (
            <Card 
              key={index} 
              className={`bg-gradient-to-b ${role.color} border-gray-800 hover:border-gray-700 transition-all ${!role.unlocked && 'opacity-60'}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  {role.icon}
                  {role.unlocked ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-toxic-neon/20 text-toxic-neon">Unlocked</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">Locked</span>
                  )}
                </div>
                <CardTitle className="text-white mt-3">{role.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {role.abilities.map((ability, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1 h-1 rounded-full bg-toxic-neon/60"></div>
                      {ability}
                    </div>
                  ))}
                </div>
                <ToxicButton
                  variant={role.unlocked ? "outline" : "ghost"}
                  className="w-full justify-between mt-2"
                  disabled={!role.unlocked}
                  onClick={() => onSelectRole(role.title)}
                >
                  {role.unlocked ? "Access Interface" : "NFT Required"}
                  <ArrowRight className="h-4 w-4" />
                </ToxicButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
