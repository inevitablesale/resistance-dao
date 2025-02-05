
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Users, Book, Award, CircuitBoard } from "lucide-react";
import { useState } from "react";
import { ProfileSection } from "./nft-card/ProfileSection";
import { AttributeBox } from "./nft-card/AttributeBox";
import { ExperienceSection } from "./nft-card/ExperienceSection";
import { VotingSection } from "./nft-card/VotingSection";

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
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  const governancePower = metadata.attributes?.find(
    attr => attr.trait_type === "Governance Power"
  )?.value?.replace("Governance-Power-", "") || "Unknown";

  const getAttribute = (traitType: string) => 
    metadata.attributes?.find(attr => attr.trait_type === traitType)?.value || "N/A";

  if (!metadata) {
    console.error('No metadata provided for NFT:', tokenId);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto perspective-1000"
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-700",
        "bg-[#0a0a0a]",
        "border-0",
        "hover:transform hover:rotate-y-5 hover:scale-105",
        "group"
      )}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#000000] to-[#1a1a1a]">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(130, 71, 229, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 100% 100%, rgba(163, 121, 255, 0.1) 0%, transparent 50%)`
            }} />
          </div>
        </div>
        
        {/* Glowing Edge Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-polygon-primary/20 via-transparent to-polygon-secondary/20 blur-xl" />
        </div>
        
        <div className="relative">
          {/* Circuit Board Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <CircuitBoard className="w-full h-full text-polygon-primary" />
          </div>
          
          {/* Main Content */}
          <div className="relative flex flex-col p-8 gap-8">
            <ProfileSection
              image={metadata.image}
              name={metadata.name}
              governancePower={governancePower}
              Award={Award}
            />

            {/* Attributes Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <AttributeBox
                icon={GraduationCap}
                label="Experience Level"
                value={getAttribute("Experience Level")}
              />
              <AttributeBox
                icon={Calendar}
                label="Years in Practice"
                value={getAttribute("Years in Practice")}
              />
              <AttributeBox
                icon={Book}
                label="Specialty"
                value={getAttribute("Specialty")}
              />
              <AttributeBox
                icon={Users}
                label="Client Base"
                value={getAttribute("Client Base")}
              />
            </motion.div>

            {/* Service Line Expertise */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <AttributeBox
                icon={Award}
                label="Service Line Expertise"
                value={getAttribute("Service Line Expertise")}
              />
            </motion.div>

            {/* Experience Section */}
            {metadata.experiences && metadata.experiences.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <ExperienceSection
                  experiences={metadata.experiences}
                  isOpen={isExperienceOpen}
                  onOpenChange={setIsExperienceOpen}
                />
              </motion.div>
            )}

            {/* Voting Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <VotingSection tokenId={tokenId} owner={owner} />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NFTCollectionCard;
