
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, Mail, Key, Shield } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const WalletConnectModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connect, isConnecting, isConnected, setShowAuthFlow } = useWalletConnection();
  const [selectedTab, setSelectedTab] = useState<'standard' | 'smart'>('standard');

  const handleConnect = async (method: 'wallet' | 'email' | 'smart') => {
    if (method === 'smart') {
      // Configure smart wallet options before connecting
      setShowAuthFlow?.(true, {
        smartWallet: {
          enableHD: true,
          recoveryMethods: ['email', 'social', 'passkey'],
          separateGenerationStep: true
        }
      });
    } else {
      await connect();
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
      >
        {isConnecting ? (
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-black p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
              
              <Tabs value={selectedTab} onValueChange={(value: 'standard' | 'smart') => setSelectedTab(value)}>
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger value="standard" className="data-[state=active]:bg-white/10">
                    Standard
                  </TabsTrigger>
                  <TabsTrigger value="smart" className="data-[state=active]:bg-white/10">
                    Smart Wallet
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="standard" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="smart" className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg space-y-2">
                    <h3 className="font-medium text-white flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-purple-400" />
                      Smart Wallet Benefits
                    </h3>
                    <ul className="text-sm text-white/60 space-y-1">
                      <li>• Enhanced security with multiple recovery options</li>
                      <li>• Social recovery support</li>
                      <li>• Email and passkey backup</li>
                      <li>• Simpler transaction signing</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={() => handleConnect('smart')}
                    variant="outline"
                    className="w-full bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-white"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Create Smart Wallet
                  </Button>
                </TabsContent>
              </Tabs>

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
