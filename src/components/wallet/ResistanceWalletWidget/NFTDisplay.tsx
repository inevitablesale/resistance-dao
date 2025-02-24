
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface NFTDisplayProps {
  balance: number;
  className?: string;
}

export const NFTDisplay = ({ balance, className = "" }: NFTDisplayProps) => {
  if (!balance) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-purple-400" />
        </div>
        <span className="text-white">Resistance NFT</span>
      </div>
      <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
        {balance}x Member
      </Badge>
    </div>
  );
};
