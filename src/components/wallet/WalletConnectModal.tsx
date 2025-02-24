
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, Mail } from "lucide-react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useLocation } from "react-router-dom";

export const WalletConnectModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connectWallet, isInitializing } = useDynamicUtils();
  const location = useLocation();

  // Don't auto-show on thesis page
  const shouldShowDialog = isOpen && location.pathname !== '/thesis';

  const handleConnect = async (method: 'wallet' | 'email') => {
    await connectWallet();
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
      >
        {isInitializing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>

      <Dialog open={shouldShowDialog} onOpenChange={setIsOpen}>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-black p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
              
              <div className="grid gap-4">
                <Button 
                  onClick={() => handleConnect('wallet')}
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect with Wallet
                </Button>
                
                <Button 
                  onClick={() => handleConnect('email')}
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Connect with Email
                </Button>
              </div>

              <Button 
                onClick={() => setIsOpen(false)}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
