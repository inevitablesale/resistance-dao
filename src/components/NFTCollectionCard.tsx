
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

  const governancePower = metadata.attributes?.find(
    attr => attr.trait_type === "Governance Power"
  )?.value?.replace("Governance-Power-", "") || "Unknown";

  const getAttribute = (traitType: string) => 
    metadata.attributes?.find(attr => attr.trait_type === traitType)?.value || "N/A";

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

  if (!metadata) {
    console.error('No metadata provided for NFT:', tokenId);
    return null;
  }

  const attributeBoxStyle = cn(
    "bg-black/40 backdrop-blur-xl rounded-xl p-4",
    "h-full flex flex-col",
    "transform hover:scale-105 transition-all duration-300",
    "border border-white/5 hover:border-polygon-primary/20"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500",
        "bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]",
        "border border-polygon-primary/20 shadow-xl",
        "hover:border-polygon-primary/40",
        "group"
      )}>
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-polygon-primary/5 via-transparent to-polygon-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex flex-col p-8 gap-6">
          {/* Profile Section */}
          <div className="w-full flex justify-center mb-4">
            <div className="relative w-32 aspect-square">
              <div className="absolute -inset-4 bg-polygon-primary/10 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute -inset-2 bg-polygon-secondary/15 rounded-full blur-2xl animate-pulse-slow delay-75" />
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-polygon-primary via-polygon-secondary to-polygon-primary rounded-full blur-xl animate-pulse-slow" />
                <img 
                  src={metadata.image} 
                  alt={metadata.name}
                  className="relative rounded-full aspect-square object-cover w-full border-4 border-white/10 shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-4 text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-polygon-primary to-polygon-secondary bg-clip-text text-transparent">
              {metadata.name}
            </h3>
            <p className="text-lg text-gray-300 flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-polygon-primary" />
              <span className="bg-gradient-to-r from-polygon-primary to-polygon-secondary bg-clip-text text-transparent">
                Governance Power: {governancePower}
              </span>
            </p>
          </div>

          {/* Professional Background Grid */}
          <div className="grid grid-cols-2 gap-3 auto-rows-fr">
            {[
              { icon: GraduationCap, label: "Experience Level", value: getAttribute("Experience Level") },
              { icon: Calendar, label: "Years in Practice", value: getAttribute("Years in Practice") },
              { icon: Book, label: "Specialty", value: getAttribute("Specialty"), colSpan: getAttribute("Specialty").length > 30 ? true : false },
              { icon: Users, label: "Client Base", value: getAttribute("Client Base") }
            ].map((item, index) => (
              <div 
                key={index}
                className={cn(
                  attributeBoxStyle,
                  item.colSpan && "col-span-2"
                )}
              >
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <item.icon className="w-4 h-4 text-polygon-primary flex-shrink-0" />
                  {item.label}
                </div>
                <div className="flex-grow">
                  <p className="text-base font-medium text-white break-words">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Service Line Expertise - Full Width */}
          <div className={cn(attributeBoxStyle)}>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Award className="w-4 h-4 text-polygon-primary flex-shrink-0" />
              Service Line Expertise
            </div>
            <div className="flex-grow">
              <p className="text-base font-medium text-white break-words">
                {getAttribute("Service Line Expertise")}
              </p>
            </div>
          </div>

          {/* Professional Experience Section */}
          {metadata.experiences && metadata.experiences.length > 0 && (
            <Collapsible open={isExperienceOpen} onOpenChange={setIsExperienceOpen}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl rounded-xl p-4 hover:bg-black/60 transition-colors border border-white/5 hover:border-polygon-primary/20">
                  <div className="flex items-center gap-2 text-base text-gray-300">
                    <Briefcase className="w-5 h-5 text-polygon-primary" />
                    Professional Experience
                  </div>
                  <div className="text-sm text-polygon-primary">
                    {isExperienceOpen ? "Hide" : "Show"}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                {metadata.experiences.map((exp, index) => (
                  <div 
                    key={index} 
                    className={attributeBoxStyle}
                  >
                    <p className="text-base font-semibold text-white mb-1">{exp.title}</p>
                    <p className="text-sm text-polygon-primary">{exp.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Network Information */}
          <div className="text-sm text-gray-400 space-y-1 bg-black/20 rounded-lg p-3 border border-white/5">
            <div>Token ID: {tokenId}</div>
            <div className="truncate">
              Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
            </div>
          </div>

          {/* Voting Buttons */}
          <div className="flex justify-center gap-4 mt-2">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-black/40 border-white/10 hover:bg-green-500/20 hover:border-green-500/40 transition-all duration-300"
              onClick={() => handleVote('up')}
            >
              <ThumbsUp className="w-5 h-5" />
              Vote Up
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-black/40 border-white/10 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300"
              onClick={() => handleVote('down')}
            >
              <ThumbsDown className="w-5 h-5" />
              Vote Down
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NFTCollectionCard;

