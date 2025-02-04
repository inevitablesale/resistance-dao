
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Briefcase, GraduationCap, Calendar, MapPin, Users, Book, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface NFTCollectionCardProps {
  tokenId: string;
  owner: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
    experiences?: {
      title: string;
      company: string;
      duration: string;
      location: string;
    }[];
  };
}

export const NFTCollectionCard = ({ tokenId, owner, metadata }: NFTCollectionCardProps) => {
  const { toast } = useToast();
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  const governancePower = metadata.attributes.find(
    attr => attr.trait_type === "Governance Power"
  )?.value.replace("Governance-Power-", "") || "Unknown";

  const getAttribute = (traitType: string) => 
    metadata.attributes.find(attr => attr.trait_type === traitType)?.value || "N/A";

  const handleVote = async (voteType: 'up' | 'down') => {
    try {
      toast({
        title: "Coming Soon",
        description: `Voting ${voteType} will be implemented through smart contracts`,
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error Voting",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500",
        "bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]",
        "border border-polygon-primary/20",
        "hover:border-polygon-primary/40",
        "group"
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-polygon-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex flex-col p-6 gap-4">
          {/* Profile Section */}
          <div className="w-full flex justify-center">
            <div className="relative w-24 aspect-square">
              <div className="absolute inset-0 bg-polygon-primary/20 rounded-full blur-2xl animate-pulse-slow" />
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-polygon-primary to-polygon-secondary rounded-full blur animate-pulse-slow" />
                <img 
                  src={metadata.image} 
                  alt={metadata.name}
                  className="relative rounded-full aspect-square object-cover w-full border-4 border-white/10"
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-polygon-primary bg-clip-text text-transparent">
                {metadata.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                <Award className="inline-block w-4 h-4 mr-1" />
                Governance Power: {governancePower}
              </p>
            </div>

            {/* Professional Background */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <GraduationCap className="w-3 h-3" />
                  Experience Level
                </div>
                <p className="text-sm text-white">{getAttribute("Experience Level")}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  Years in Practice
                </div>
                <p className="text-sm text-white">{getAttribute("Years in Practice")}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Book className="w-3 h-3" />
                  Specialty
                </div>
                <p className="text-sm text-white">{getAttribute("Specialty")}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Users className="w-3 h-3" />
                  Client Base
                </div>
                <p className="text-sm text-white">{getAttribute("Client Base")}</p>
              </div>
            </div>

            {/* Service Line Expertise */}
            <div className="bg-white/5 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Award className="w-3 h-3" />
                Service Line Expertise
              </div>
              <p className="text-sm text-white">{getAttribute("Service Line Expertise")}</p>
            </div>

            {/* Professional Experience */}
            {metadata.experiences && metadata.experiences.length > 0 && (
              <Collapsible open={isExperienceOpen} onOpenChange={setIsExperienceOpen}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      Professional Experience
                    </div>
                    <div className="text-xs text-gray-500">
                      {isExperienceOpen ? "Hide" : "Show"}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                  {metadata.experiences.map((exp, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-2">
                      <p className="text-sm font-semibold text-white">{exp.title}</p>
                      <p className="text-xs text-gray-400">{exp.company}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exp.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Network Information */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>Token ID: {tokenId}</div>
              <div className="truncate">
                Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
              </div>
            </div>

            {/* Voting buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-green-500/20"
                onClick={() => handleVote('up')}
              >
                <ThumbsUp className="w-4 h-4" />
                Vote Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-red-500/20"
                onClick={() => handleVote('down')}
              >
                <ThumbsDown className="w-4 h-4" />
                Vote Down
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NFTCollectionCard;
