
import { useState, useEffect } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from '@/hooks/use-toast';

export const useWalletConnection = () => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isPendingInitialization, setIsPendingInitialization] = useState(true);
  const { primaryWallet, user, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();

  useEffect(() => {
    const initWallet = async () => {
      try {
        if (primaryWallet) {
          const walletClient = await primaryWallet.getWalletClient();
          if (walletClient) {
            const addr = await walletClient.getAddress();
            setAddress(addr);
            
            // Check for referrer in URL and store it
            checkAndStoreReferrer();
          }
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
      } finally {
        setIsPendingInitialization(false);
      }
    };

    initWallet();
  }, [primaryWallet]);
  
  // Check URL for referrer and store it
  const checkAndStoreReferrer = () => {
    try {
      // Extract referrer from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const referrer = urlParams.get('ref') || urlParams.get('referrer');
      
      // Alternatively check if we're in a /r/{referrerAddress} route
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length >= 3 && pathParts[1] === 'r') {
        // If format is /r/{bountyId}/{referrerAddress}
        if (pathParts.length >= 4) {
          const bountyId = pathParts[2];
          const pathReferrer = pathParts[3];
          
          localStorage.setItem("referrer_address", pathReferrer);
          localStorage.setItem("referrer_bounty", bountyId);
          console.log("Stored referrer info from path:", { bountyId, referrer: pathReferrer });
        } 
        // If format is /r/{referrerAddress}
        else {
          const pathReferrer = pathParts[2];
          localStorage.setItem("referrer_address", pathReferrer);
          console.log("Stored referrer from path:", pathReferrer);
        }
      } 
      // Store from query parameter if found
      else if (referrer) {
        localStorage.setItem("referrer_address", referrer);
        console.log("Stored referrer from query:", referrer);
      }
    } catch (error) {
      console.error("Error handling referrer:", error);
    }
  };

  const connect = async () => {
    try {
      setShowAuthFlow(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnect = async () => {
    try {
      if (primaryWallet?.disconnect) {
        await primaryWallet.disconnect();
      }
      setAddress(undefined);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getReferrer = () => {
    return localStorage.getItem("referrer_address") || undefined;
  };
  
  const getReferrerBounty = () => {
    return localStorage.getItem("referrer_bounty") || undefined;
  };

  return {
    isConnected: !!address,
    address,
    connect,
    disconnect,
    primaryWallet,
    user,
    isPendingInitialization,
    setShowAuthFlow,
    getReferrer,
    getReferrerBounty,
    checkAndStoreReferrer
  };
};
