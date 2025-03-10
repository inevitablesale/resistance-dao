
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, ThumbsUp, ThumbsDown, Play, Calendar, User, CheckCircle, XCircle, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PartyProposal } from "@/types/proposals";

export const ProposalCard = ({
  proposal,
  onVote,
  onExecute,
  canExecute = false,
  showVoting = true
}: {
  proposal: PartyProposal;
  onVote: (proposalId: string, support: boolean) => void;
  onExecute: (proposalId: string, proposal: any) => void;
  canExecute?: boolean;
  showVoting?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-[#0a1020] p-4 rounded-xl border border-white/5">
      <div className="flex items-start gap-4">
        <div className="bg-blue-500/10 p-2 rounded-full">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{proposal.title}</h3>
            <div className={`px-2 py-1 rounded-full text-xs ${
              proposal.status === 'active' 
                ? 'bg-blue-500/20 text-blue-400' 
                : proposal.status === 'passed' || proposal.status === 'ready'
                  ? 'bg-green-500/20 text-green-400'
                  : proposal.status === 'executed'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-red-500/20 text-red-400'
            }`}>
              {proposal.status === 'ready' ? 'Ready to Execute' : proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <User className="w-3 h-3" />
            <span>{proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
            <span className="mx-1">•</span>
            <Calendar className="w-3 h-3" />
            <span>{formatDate(proposal.createdAt)}</span>
          </div>
          
          <div className="mt-3">
            <p className={`text-sm text-gray-300 ${!isExpanded && 'line-clamp-2'}`}>
              {proposal.description}
            </p>
            <button 
              className="text-xs text-blue-400 mt-1 hover:text-blue-300"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
          
          {isExpanded && (
            <>
              <Separator className="my-3 bg-white/10" />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Transaction Details</h4>
                
                {proposal.transactions.map((tx, index) => (
                  <div key={index} className="bg-black/30 p-2 rounded text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target:</span>
                      <span className="font-mono">{tx.target.slice(0, 10)}...{tx.target.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-400">Value:</span>
                      <span className="font-mono">{tx.value} ETH</span>
                    </div>
                    {tx.signature && (
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400">Function:</span>
                        <span className="font-mono">{tx.signature}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Voting Status:</span>
                  <span>{proposal.votesFor} for / {proposal.votesAgainst} against</span>
                </div>
                
                <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full" 
                    style={{ 
                      width: `${Math.min(
                        100, 
                        (proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) * 100
                      )}%` 
                    }}
                  />
                </div>
                
                {proposal.status === 'active' && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Voting ends in {proposal.timeRemaining}</span>
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="mt-4 flex gap-2 justify-end">
            {showVoting && proposal.status === 'active' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={() => onVote(proposal.id, false)}
                >
                  <ThumbsDown className="w-3 h-3" />
                  Against
                </Button>
                <Button 
                  size="sm"
                  className="gap-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => onVote(proposal.id, true)}
                >
                  <ThumbsUp className="w-3 h-3" />
                  Support
                </Button>
              </>
            )}
            
            {canExecute && (proposal.status === 'passed' || proposal.status === 'ready') && (
              <Button 
                size="sm"
                className="gap-1 bg-green-500 hover:bg-green-600"
                onClick={() => onExecute(proposal.id, {
                  title: proposal.title,
                  description: proposal.description,
                  transactions: proposal.transactions
                })}
              >
                <Play className="w-3 h-3" />
                Execute
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
