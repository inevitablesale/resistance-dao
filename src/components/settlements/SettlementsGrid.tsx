
import { ProposalEvent } from "@/types/proposals";
import { Link } from "react-router-dom";
import { Shield, Users } from "lucide-react";

interface SettlementsGridProps {
  settlements: ProposalEvent[];
  isLoading: boolean;
  formatUSDAmount: (amount: string) => string;
  title: string;
  className?: string; // Added className prop to support Hunt.tsx
}

export const SettlementsGrid = ({ settlements, isLoading, formatUSDAmount, title, className }: SettlementsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (settlements.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-400">No settlements found. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settlements.map((settlement) => {
          const metadata = settlement.metadata || {
            title: "Loading...",
            description: "Settlement details loading...",
            category: "Unknown"
          };
          
          // Calculate progress percentage - safely access investment props
          const targetCapital = metadata.investment?.targetCapital || "0";
          const pledgedAmount = settlement.pledgedAmount || "0";
          const progress = parseFloat(targetCapital) > 0 
            ? Math.min(100, (parseFloat(pledgedAmount) / parseFloat(targetCapital)) * 100) 
            : 0;
          
          // Determine status
          let status = 'active';
          if (progress >= 100) status = 'completed';
          else if (settlement.error) status = 'failed';
          
          return (
            <Link 
              key={settlement.tokenId} 
              to={`/settlements/${settlement.tokenId}`}
              className="bg-[#111] rounded-xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-colors"
            >
              <div 
                className="h-48 bg-center bg-cover bg-gradient-to-r from-blue-900/30 to-purple-900/30" 
                style={{ backgroundImage: metadata.image ? `url(${metadata.image})` : '' }}
              />
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{metadata.title}</h2>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : status === 'completed'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {status === 'active' 
                      ? 'Active' 
                      : status === 'completed' 
                        ? 'Funded' 
                        : 'Failed'}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm line-clamp-2">{metadata.description}</p>
                
                <div className="bg-black/50 h-2 w-full rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{pledgedAmount} ETH</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{settlement.voteCount || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Join</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
