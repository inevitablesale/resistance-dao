
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useState, useEffect } from "react";
import { getTokenBalance } from "@/services/tokenService";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { useNavigate } from "react-router-dom";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const REQUIRED_LGR_BALANCE = "250";

export const WalletConnectionOverlay = () => {
  const { isConnected, connect, address, setShowOnRamp } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [hasRequiredBalance, setHasRequiredBalance] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBalance = async () => {
      if (!isConnected || !address) return;
      
      setIsCheckingBalance(true);
      try {
        const provider = await getProvider();
        const balance = await getTokenBalance(
          provider.provider,
          LGR_TOKEN_ADDRESS,
          address
        );
        
        const hasBalance = parseFloat(balance) >= parseFloat(REQUIRED_LGR_BALANCE);
        setHasRequiredBalance(hasBalance);
        
        if (!hasBalance) {
          setShowOnRamp(true);
        }
      } catch (error) {
        console.error("Error checking LGR balance:", error);
      } finally {
        setIsCheckingBalance(false);
      }
    };

    checkBalance();
  }, [isConnected, address, getProvider, setShowOnRamp]);

  if (!isConnected) {
    return (
      <Dialog open={true} onOpenChange={() => navigate('/')}>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-black p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
              <p className="text-white/60">Please connect your wallet to continue creating your proposal.</p>
              
              <Button 
                onClick={connect}
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>

              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  if (isCheckingBalance) {
    return (
      <Dialog open={true}>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-black p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <p className="text-white">Checking LGR Balance...</p>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  if (!hasRequiredBalance) {
    return (
      <Dialog open={true}>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-black p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold text-white">Insufficient LGR Balance</h2>
              <p className="text-white/60">
                You need at least {REQUIRED_LGR_BALANCE} LGR tokens to create a proposal. 
                Buy LGR tokens to continue.
              </p>
              
              <Button 
                onClick={() => setShowOnRamp(true)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
              >
                Buy LGR Tokens
              </Button>

              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  return null;
};
