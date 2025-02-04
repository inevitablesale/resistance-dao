
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  };
}

export const NFTCollectionCard = ({ tokenId, owner, metadata }: NFTCollectionCardProps) => {
  const governancePower = metadata.attributes.find(
    attr => attr.trait_type === "Governance Power"
  )?.value.replace("Governance-Power-", "") || "Unknown";

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

          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-polygon-primary bg-clip-text text-transparent">
                {metadata.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{governancePower}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400 line-clamp-2">
                {metadata.description}
              </p>
              <div className="text-xs text-gray-500">
                <span>Token ID: {tokenId}</span>
                <div className="truncate">
                  Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NFTCollectionCard;
