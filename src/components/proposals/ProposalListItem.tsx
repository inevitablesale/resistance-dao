
import { motion } from "framer-motion";
import { FileText, Calendar, Users, Target, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ProposalMetadata } from "@/types/proposals";

interface ProposalListItemProps {
  index: number;
  tokenId: string;
  metadata?: ProposalMetadata;
  pledgedAmount?: string;
  blockNumber: number;
  formatUSDAmount: (amount: string) => string;
}

export const ProposalListItem = ({ 
  index, 
  tokenId, 
  metadata, 
  pledgedAmount, 
  blockNumber,
  formatUSDAmount 
}: ProposalListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Navigating to proposal:', tokenId);
    navigate(`/proposals/${tokenId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleClick}
      className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/20 transition-all duration-200 cursor-pointer group relative"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">
                  {metadata?.title || `Proposal #${tokenId}`}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(metadata?.submissionTimestamp || new Date(blockNumber * 1000), 'PPP')}</span>
                </div>
                {metadata?.investment?.targetCapital && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>
                      {metadata.investment.targetCapital} LGR Target
                      <span className="text-white/40 ml-1">
                        ({formatUSDAmount(metadata.investment.targetCapital)})
                      </span>
                    </span>
                  </div>
                )}
                {pledgedAmount && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {pledgedAmount} LGR Pledged
                      <span className="text-white/40 ml-1">
                        ({formatUSDAmount(pledgedAmount)})
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
        {metadata?.investment?.drivers && (
          <p className="text-sm text-white/60 mt-2">{metadata.investment.drivers}</p>
        )}
      </div>
    </motion.div>
  );
};
