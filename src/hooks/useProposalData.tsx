
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useToast } from "@/hooks/use-toast";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";
import { useWalletProvider } from "@/hooks/useWalletProvider";

interface ProposalData {
  proposalDetails: ProposalMetadata | null;
  pledgedAmount: string;
  backerCount: number;
  hasUserVoted: boolean;
  userVoteAmount: string;
  isLoading: boolean;
}

export const useProposalData = (tokenId?: string) => {
  const { isConnected, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  const [data, setData] = useState<ProposalData>({
    proposalDetails: null,
    pledgedAmount: "0",
    backerCount: 0,
    hasUserVoted: false,
    userVoteAmount: "0",
    isLoading: true
  });
  const hasLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchProposalData = async () => {
      if (!tokenId || !isConnected || hasLoadedRef.current) return;

      try {
        console.log('Getting wallet provider for proposal data...');
        const walletProvider = await getProvider();
        console.log('Initializing contract...');
        
        const factoryContract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          walletProvider.provider
        );

        console.log(`Getting tokenURI, pledged amount, and vote events for token #${tokenId}`);
        
        const [tokenUri, pledged] = await Promise.all([
          factoryContract.tokenURI(tokenId),
          factoryContract.pledgedAmount(tokenId)
        ]);

        console.log('Querying ProposalVoted events...');
        const filter = factoryContract.filters.ProposalVoted(tokenId, null);
        const events = await factoryContract.queryFilter(filter);
        
        let hasVoted = false;
        let votedAmount = "0";
        
        if (address) {
          const userFilter = factoryContract.filters.ProposalVoted(tokenId, address);
          const userVoteEvents = await factoryContract.queryFilter(userFilter);
          hasVoted = userVoteEvents.length > 0;
          
          if (hasVoted && userVoteEvents[0]) {
            const amount = userVoteEvents[0].args?.pledgeAmount;
            if (amount) {
              votedAmount = ethers.utils.formatEther(amount);
            }
          }
        }

        if (tokenUri) {
          console.log('Starting IPFS fetch for metadata');
          const ipfsHash = tokenUri.replace('ipfs://', '');
          console.log('IPFS hash:', ipfsHash);
          
          const metadata = await getFromIPFS<ProposalMetadata>(ipfsHash, 'proposal');
          console.log('Successfully fetched IPFS data:', metadata);

          setData({
            proposalDetails: metadata,
            pledgedAmount: ethers.utils.formatEther(pledged),
            backerCount: events.length,
            hasUserVoted: hasVoted,
            userVoteAmount: votedAmount,
            isLoading: false
          });
          
          hasLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error fetching proposal data:", error);
        toast({
          title: "Failed to Load Proposal",
          description: "Could not retrieve proposal details.",
          variant: "destructive",
        });
        setData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchProposalData();
  }, [tokenId, isConnected, getProvider, address, toast]);

  // Reset the cache when tokenId changes
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [tokenId]);

  return data;
};
