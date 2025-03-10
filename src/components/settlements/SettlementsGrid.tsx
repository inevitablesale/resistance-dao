
import React from 'react';
import { SettlementCard } from './SettlementCard';
import { ProposalEvent } from '@/types/proposals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Plus } from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from '@/hooks/use-toast';

interface SettlementsGridProps {
  settlements: ProposalEvent[];
  isLoading: boolean;
  formatUSDAmount: (amount: string) => string;
  title?: string;
  className?: string;
}

export const SettlementsGrid: React.FC<SettlementsGridProps> = ({ 
  settlements, 
  isLoading,
  formatUSDAmount,
  title = "Settlements",
  className = ""
}) => {
  const navigate = useNavigate();
  const { isConnected, connect } = useWalletConnection();
  const { toast } = useToast();
  
  const handleCreateSettlement = () => {
    if (!isConnected) {
      toast({
        title: "Wallet connection required",
        description: "Please connect your wallet to create a settlement.",
      });
      connect();
      return;
    }
    
    navigate('/thesis');
  };
  
  if (isLoading) {
    return (
      <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-[#0a0a0a] border border-white/5 rounded-lg h-[400px] animate-pulse">
            <div className="h-36 bg-gradient-to-b from-blue-900/20 to-blue-700/5" />
            <div className="p-4 space-y-4">
              <div className="h-6 bg-gray-800 rounded-md w-3/4" />
              <div className="h-4 bg-gray-800 rounded-md w-full" />
              <div className="h-4 bg-gray-800 rounded-md w-5/6" />
              <div className="h-2 bg-gray-800 rounded-md w-full mt-6" />
              <div className="h-16 bg-gray-800 rounded-md w-full mt-6" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (settlements.length === 0) {
    return (
      <div className={`bg-[#0a0a0a] border border-white/5 rounded-lg p-8 text-center ${className}`}>
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
        <h3 className="text-xl font-semibold mb-2">No settlements found</h3>
        <p className="text-gray-400 mb-6">There are currently no active settlements to display.</p>
        <Button 
          onClick={handleCreateSettlement}
          className="bg-blue-500 hover:bg-blue-600 gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Settlement
        </Button>
      </div>
    );
  }

  // Filter settlements by status
  const activeSettlements = settlements.filter(s => 
    s.metadata?.status === 'active' || 
    (!s.metadata?.status && !s.error));
  
  const fundedSettlements = settlements.filter(s => 
    s.metadata?.status === 'completed' || 
    s.metadata?.status === 'funded');
  
  const failedSettlements = settlements.filter(s => 
    s.metadata?.status === 'failed' || 
    s.error);

  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button 
            onClick={handleCreateSettlement}
            className="bg-blue-500 hover:bg-blue-600 gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Settlement
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="all">
        <TabsList className="bg-black/40 border border-white/10 mb-6">
          <TabsTrigger value="all">All ({settlements.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeSettlements.length})</TabsTrigger>
          <TabsTrigger value="funded">Funded ({fundedSettlements.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedSettlements.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {settlements.map((settlement) => (
            <SettlementCardWrapper
              key={settlement.tokenId}
              settlement={settlement}
              formatUSDAmount={formatUSDAmount}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="active" className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {activeSettlements.length > 0 ? (
            activeSettlements.map((settlement) => (
              <SettlementCardWrapper
                key={settlement.tokenId}
                settlement={settlement}
                formatUSDAmount={formatUSDAmount}
              />
            ))
          ) : (
            <div className="col-span-3 bg-[#0a0a0a] border border-white/5 rounded-lg p-8 text-center">
              <p className="text-gray-400">No active settlements found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="funded" className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {fundedSettlements.length > 0 ? (
            fundedSettlements.map((settlement) => (
              <SettlementCardWrapper
                key={settlement.tokenId}
                settlement={settlement}
                formatUSDAmount={formatUSDAmount}
              />
            ))
          ) : (
            <div className="col-span-3 bg-[#0a0a0a] border border-white/5 rounded-lg p-8 text-center">
              <p className="text-gray-400">No funded settlements found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="failed" className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {failedSettlements.length > 0 ? (
            failedSettlements.map((settlement) => (
              <SettlementCardWrapper
                key={settlement.tokenId}
                settlement={settlement}
                formatUSDAmount={formatUSDAmount}
              />
            ))
          ) : (
            <div className="col-span-3 bg-[#0a0a0a] border border-white/5 rounded-lg p-8 text-center">
              <p className="text-gray-400">No failed settlements found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component to format settlement data for the SettlementCard
const SettlementCardWrapper = ({ settlement, formatUSDAmount }: { 
  settlement: ProposalEvent, 
  formatUSDAmount: (amount: string) => string 
}) => {
  // Handle loading state
  if (settlement.isLoading) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-lg h-[400px] animate-pulse">
        <div className="h-36 bg-gradient-to-b from-blue-900/20 to-blue-700/5" />
        <div className="p-4 space-y-4">
          <div className="h-6 bg-gray-800 rounded-md w-3/4" />
          <div className="h-4 bg-gray-800 rounded-md w-full" />
          <div className="h-4 bg-gray-800 rounded-md w-5/6" />
          <div className="h-2 bg-gray-800 rounded-md w-full mt-6" />
          <div className="h-16 bg-gray-800 rounded-md w-full mt-6" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (settlement.error) {
    return (
      <div className="bg-[#0a0a0a] border border-red-500/20 rounded-lg p-4">
        <div className="text-red-400 mb-2 font-semibold">Error loading settlement</div>
        <p className="text-gray-400 text-sm">{settlement.error}</p>
      </div>
    );
  }

  // Format data for the settlement card
  const metadata = settlement.metadata;
  if (!metadata) {
    return null;
  }

  // Calculate remaining time (mock implementation)
  const currentTime = Math.floor(Date.now() / 1000);
  const endTime = metadata.submissionTimestamp 
    ? metadata.submissionTimestamp + metadata.votingDuration 
    : currentTime + 7 * 24 * 60 * 60; // Default 7 days
  const remainingSeconds = Math.max(0, endTime - currentTime);
  const remainingDays = Math.ceil(remainingSeconds / (24 * 60 * 60));
  
  // Determine status
  let status = metadata?.status || 'active';
  if (remainingSeconds <= 0 && status === 'active') {
    status = 'failed';
  }

  // Amount calculation
  const totalRaised = settlement.pledgedAmount || '0';
  const targetAmount = metadata.investment?.targetCapital || '1000'; // Default 1000 ETH

  return (
    <SettlementCard
      settlement={{
        id: settlement.tokenId,
        name: metadata.title || `Settlement #${settlement.tokenId}`,
        description: metadata.description || "No description available",
        totalRaised: totalRaised,
        targetAmount: targetAmount,
        remainingTime: `${remainingDays} days`,
        status: status,
        image: metadata.image
      }}
    />
  );
};
