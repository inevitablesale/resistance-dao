
import { motion } from "framer-motion";
import { FileText, Calendar, Users, Target } from "lucide-react";
import { format } from "date-fns";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import type { ProposalData } from "@/hooks/useProposalData";

interface Props {
  proposal: ProposalData;
  index: number;
}

export const ProposalCard = ({ proposal, index }: Props) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/proposals/${proposal.tokenId}`)}
      className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/20 transition-colors cursor-pointer"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">
                  {proposal.title || `Proposal #${proposal.tokenId}`}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(proposal.blockNumber * 1000), 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{ethers.utils.formatEther(proposal.targetCapital)} LGR Target</span>
                </div>
                {proposal.pledgedAmount && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{proposal.pledgedAmount} LGR Pledged</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
