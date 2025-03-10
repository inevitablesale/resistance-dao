
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Check, X, Clock, FileText, ExternalLink, Shield, Play } from 'lucide-react';
import { PartyProposal } from '@/types/proposals';
import { GovernanceProposal } from '@/services/partyProtocolService';
import { ethers } from 'ethers';

interface ProposalCardProps {
  proposal: PartyProposal;
  onVote?: (proposalId: string, support: boolean) => Promise<void>;
  onExecute?: (proposalId: string, proposal: GovernanceProposal) => Promise<void>;
  canExecute?: boolean;
  showVoting?: boolean;
}

export const ProposalCard = ({
  proposal,
  onVote,
  onExecute,
  canExecute = false,
  showVoting = true
}: ProposalCardProps) => {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  
  // Format transaction value
  const formatValue = (value: string) => {
    try {
      const valueInEth = ethers.utils.formatEther(value);
      return `${parseFloat(valueInEth).toFixed(4)} ETH`;
    } catch (error) {
      return value;
    }
  };
  
  const statusIndicator = () => {
    switch (proposal.status) {
      case 'active':
        return (
          <div className="flex items-center gap-1.5 bg-yellow-500/20 px-2.5 py-1 rounded-full text-yellow-400 text-xs">
            <Clock className="w-3 h-3" />
            <span>Active</span>
          </div>
        );
      case 'passed':
        return (
          <div className="flex items-center gap-1.5 bg-green-500/20 px-2.5 py-1 rounded-full text-green-400 text-xs">
            <Check className="w-3 h-3" />
            <span>Passed</span>
          </div>
        );
      case 'ready':
        return (
          <div className="flex items-center gap-1.5 bg-blue-500/20 px-2.5 py-1 rounded-full text-blue-400 text-xs">
            <Play className="w-3 h-3" />
            <span>Ready</span>
          </div>
        );
      case 'executed':
        return (
          <div className="flex items-center gap-1.5 bg-purple-500/20 px-2.5 py-1 rounded-full text-purple-400 text-xs">
            <Shield className="w-3 h-3" />
            <span>Executed</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-1.5 bg-red-500/20 px-2.5 py-1 rounded-full text-red-400 text-xs">
            <X className="w-3 h-3" />
            <span>Failed</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Convert the proposal to the format expected by the execute function
  const formatForExecution = (): GovernanceProposal => {
    return {
      title: proposal.title,
      description: proposal.description,
      transactions: proposal.transactions.map(tx => ({
        target: tx.target,
        value: tx.value,
        calldata: tx.calldata,
        signature: tx.signature
      }))
    };
  };
  
  return (
    <Card className="bg-[#0a0a0a] border border-white/5 hover:border-blue-500/20 transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{proposal.title}</h3>
          {statusIndicator()}
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{proposal.description}</p>
        
        {showVoting && (
          <>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Votes For: {proposal.votesFor}</span>
              <span>Votes Against: {proposal.votesAgainst}</span>
            </div>
            
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div className="flex h-full">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${forPercentage}%` }} 
                />
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${100 - forPercentage}%` }} 
                />
              </div>
            </div>
          </>
        )}
        
        {proposal.transactions.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Transactions ({proposal.transactions.length})</span>
            </div>
            
            <div className="space-y-2">
              {proposal.transactions.map((tx, index) => (
                <div key={index} className="text-xs p-2 bg-black/30 rounded border border-white/5">
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Target:</span>
                    <span className="font-mono truncate max-w-[180px]">{tx.target.substring(0, 10)}...{tx.target.substring(tx.target.length - 6)}</span>
                  </div>
                  
                  {tx.value !== "0" && (
                    <div className="flex justify-between text-gray-400">
                      <span>Value:</span>
                      <span className="font-mono">{formatValue(tx.value)}</span>
                    </div>
                  )}
                  
                  {tx.signature && (
                    <div className="flex justify-between text-gray-400">
                      <span>Function:</span>
                      <span className="font-mono">{tx.signature}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {proposal.status === 'active' ? (
              <span>Ends in {proposal.timeRemaining}</span>
            ) : (
              <span>Created {new Date(proposal.createdAt * 1000).toLocaleDateString()}</span>
            )}
          </div>
          
          <a 
            href={`https://etherscan.io/address/${proposal.proposer}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 flex items-center gap-1 hover:underline"
          >
            <span>Proposer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
      
      {showVoting && proposal.status === 'active' && onVote && (
        <CardFooter className="border-t border-white/5 p-4 flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
            onClick={() => onVote(proposal.id, true)}
          >
            <Check className="w-4 h-4 mr-1" />
            Vote For
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={() => onVote(proposal.id, false)}
          >
            <X className="w-4 h-4 mr-1" />
            Vote Against
          </Button>
        </CardFooter>
      )}
      
      {(proposal.status === 'passed' || proposal.status === 'ready') && canExecute && onExecute && (
        <CardFooter className="border-t border-white/5 p-4">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={() => onExecute(proposal.id, formatForExecution())}
          >
            <Play className="w-4 h-4 mr-1" />
            Execute Proposal
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
