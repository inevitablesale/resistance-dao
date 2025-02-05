
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Users, Book, Award } from "lucide-react";
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
          <ProfileSection
            image={metadata.image}
            name={metadata.name}
            governancePower={governancePower}
            Award={Award}
          />

          {/* Professional Background Grid */}
          <div className="grid grid-cols-2 gap-3">
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
          </div>

          {/* Service Line Expertise - Full Width */}
          <AttributeBox
            icon={Award}
            label="Service Line Expertise"
            value={getAttribute("Service Line Expertise")}
          />

          {/* Professional Experience Section */}
          {metadata.experiences && metadata.experiences.length > 0 && (
            <ExperienceSection
              experiences={metadata.experiences}
              isOpen={isExperienceOpen}
              onOpenChange={setIsExperienceOpen}
            />
          )}

          <VotingSection tokenId={tokenId} owner={owner} />
        </div>
      </Card>
    </motion.div>
  );
};

export default NFTCollectionCard;
