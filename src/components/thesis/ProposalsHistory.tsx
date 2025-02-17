
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StoredProposal } from "@/types/proposals";

export const ProposalsHistory = () => {
  const [proposals, setProposals] = useState<StoredProposal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProposals = localStorage.getItem('userProposals');
    if (storedProposals) {
      setProposals(JSON.parse(storedProposals));
    }
  }, []);

  if (proposals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Your Submitted Proposals</h2>
      <div className="grid gap-4">
        {proposals.map((proposal, index) => (
          <motion.div
            key={proposal.hash}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-polygon-primary/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-polygon-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-polygon-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{proposal.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(proposal.timestamp), 'PPP')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  proposal.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
                  proposal.status === 'completed' && "bg-green-500/10 text-green-500",
                  proposal.status === 'failed' && "bg-red-500/10 text-red-500"
                )}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                  onClick={() => navigate(`/proposals/${proposal.hash}`)}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
