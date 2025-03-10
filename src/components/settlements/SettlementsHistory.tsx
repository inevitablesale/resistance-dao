
import { useEffect, useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, RD_PRICE_USD } from "@/lib/constants";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata, ProposalEvent } from "@/types/proposals";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loadingStates } from "@/components/proposals/LoadingStates";
import { ProposalLoadingCard } from "@/components/proposals/ProposalLoadingCard";
import { SettlementsGrid } from "./SettlementsGrid";
import { convertProposalsToSettlements } from "@/utils/settlementConversion";

const formatUSDAmount = (rdAmount: string): string => {
  const amount = parseFloat(rdAmount);
  if (isNaN(amount)) return "$0.00";
  const usdAmount = amount * RD_PRICE_USD;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(usdAmount);
};

export const SettlementsHistory = () => {
  const [settlementEvents, setSettlementEvents] = useState<ProposalEvent[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingStateIndex, setLoadingStateIndex] = useState(0);
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();

  const updateSettlementData = (tokenId: string, updates: Partial<ProposalEvent>) => {
    setSettlementEvents(current =>
      current.map(event =>
        event.tokenId === tokenId
          ? { ...event, ...updates }
          : event
      )
    );
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isInitialLoading) {
      const cycleLoadingStates = () => {
        setLoadingStateIndex(prev => {
          if (prev < loadingStates.length - 1) {
            timeoutId = setTimeout(cycleLoadingStates, 1000);
            return prev + 1;
          }
          return prev;
        });
      };

      timeoutId = setTimeout(cycleLoadingStates, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInitialLoading]);

  useEffect(() => {
    const fetchSettlementMetadata = async (settlement: ProposalEvent, contract: ethers.Contract) => {
      try {
        console.log(`\n=== Fetching metadata for settlement #${settlement.tokenId} ===`);
        
        updateSettlementData(settlement.tokenId, { isLoading: true });

        // Get token URI and pledged amount in parallel
        const [tokenUri, settlementData, voteEvents] = await Promise.all([
          contract.tokenURI(settlement.tokenId),
          contract.proposals(settlement.tokenId),
          contract.queryFilter(contract.filters.ProposalVoted(settlement.tokenId))
        ]);

        console.log('Token URI:', tokenUri);
        console.log('Pledged resources:', ethers.utils.formatEther(settlementData.totalPledged), 'RD');
        console.log('Support events:', voteEvents.length);

        if (tokenUri) {
          console.log('Fetching IPFS data...');
          try {
            const metadata = await getFromIPFS<ProposalMetadata>(
              tokenUri.replace('ipfs://', ''),
              'proposal'
            );
            console.log('IPFS metadata retrieved:', metadata);

            // Calculate total pledged from events
            const totalPledged = voteEvents.reduce((sum, event) => {
              return sum.add(event.args?.pledgeAmount || 0);
            }, ethers.BigNumber.from(0));

            updateSettlementData(settlement.tokenId, {
              metadata,
              pledgedAmount: ethers.utils.formatEther(totalPledged),
              isLoading: false,
              voteCount: voteEvents.length
            });
          } catch (ipfsError) {
            console.error('IPFS fetch error:', ipfsError);
            updateSettlementData(settlement.tokenId, {
              isLoading: false,
              error: `IPFS fetch failed: ${ipfsError.message}`
            });
          }
        }
      } catch (error: any) {
        console.error(`Error processing settlement #${settlement.tokenId}:`, error);
        updateSettlementData(settlement.tokenId, {
          isLoading: false,
          error: error.message
        });
      }
    };

    const fetchSettlementData = async () => {
      if (!isConnected) return;

      try {
        setIsInitialLoading(true);
        const walletProvider = await getProvider();
        console.log('\n=== Scanning for Settlements ===');
        console.log('Using Factory Address:', FACTORY_ADDRESS);
        
        const contract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          walletProvider.provider
        );

        // Get latest block for reference
        const latestBlock = await walletProvider.provider.getBlockNumber();
        console.log('Current block:', latestBlock);

        // Fetch ALL historical events from block 0
        console.log('Fetching events from genesis block');

        const filter = contract.filters.ProposalCreated();
        console.log('Scanning for settlement creation events...');
        const events = await contract.queryFilter(filter, 0, latestBlock);
        console.log('Found settlements:', events.length);
        
        console.log('Settlement details:', events.map(e => ({
          blockNumber: e.blockNumber,
          args: e.args ? {
            proposalId: e.args.proposalId?.toString(),
            creator: e.args.creator
          } : 'No args'
        })));

        const initialSettlements = events
          .map(event => {
            if (!event.args) {
              console.warn('Event missing args:', event);
              return null;
            }
            
            const settlement: ProposalEvent = {
              tokenId: event.args.proposalId.toString(),
              creator: event.args.creator,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash,
              isLoading: true
            };
            
            return settlement;
          })
          .filter((settlement): settlement is ProposalEvent => settlement !== null);

        console.log('Processed settlements:', initialSettlements);

        if (initialSettlements.length === 0) {
          console.log('No settlements found in events');
          setIsInitialLoading(false);
          return;
        }

        // Sort by block number (newest first)
        initialSettlements.sort((a, b) => b.blockNumber - a.blockNumber);
        setSettlementEvents(initialSettlements);
        setIsInitialLoading(false);

        // Fetch metadata for each settlement with delay to avoid rate limiting
        for (const settlement of initialSettlements) {
          try {
            await fetchSettlementMetadata(settlement, contract);
            // Add small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.error(`Error fetching metadata for settlement ${settlement.tokenId}:`, error);
          }
        }

      } catch (error: any) {
        console.error("Error scanning for settlements:", error);
        toast({
          title: "Scan Error",
          description: "Failed to scan for settlements. Please try again.",
          variant: "destructive",
        });
        setIsInitialLoading(false);
      }
    };

    fetchSettlementData();
  }, [isConnected, getProvider]);

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-6 text-center">
          <p className="text-white/60 mb-4">Connect your device to scan for settlements</p>
          <Button onClick={connect} className="bg-gradient-to-r from-toxic-neon/70 to-toxic-neon/50 hover:from-toxic-neon/80 hover:to-toxic-neon/60 text-black">
            Connect Device
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isInitialLoading) {
    return <ProposalLoadingCard loadingState={loadingStates[loadingStateIndex]} />;
  }

  return (
    <SettlementsGrid 
      settlements={settlementEvents}
      isLoading={isInitialLoading}
      formatUSDAmount={formatUSDAmount}
      title="Active Settlements"
    />
  );
};
