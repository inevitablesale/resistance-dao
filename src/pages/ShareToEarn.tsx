
import { useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletConnectModal } from "@/components/wallet/WalletConnectModal";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Linkedin, ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";

const ShareToEarn = () => {
  const { isConnected } = useWalletConnection();
  const [email, setEmail] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const { toast } = useToast();

  const handleLinkedInConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your LinkedIn email address",
        variant: "destructive"
      });
      return;
    }

    setIsLinking(true);
    try {
      // Here we'll later add the LinkedIn verification
      toast({
        title: "LinkedIn Connection Initiated",
        description: "Check your email for verification.",
      });
    } catch (error) {
      console.error("LinkedIn connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect LinkedIn account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400">
              Share LedgerFund, Earn $LGR
            </h1>
            <p className="text-lg text-gray-400">
              Connect your LinkedIn account and share LedgerFund updates to earn $LGR tokens
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 p-6">
            {!isConnected ? (
              <div className="text-center space-y-4">
                <p className="text-gray-400">Connect your wallet to start earning</p>
                <WalletConnectModal />
              </div>
            ) : (
              <form onSubmit={handleLinkedInConnect} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    LinkedIn Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your LinkedIn email"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isLinking}
                  className="w-full bg-gradient-to-r from-yellow-500 via-teal-400 to-yellow-400 text-black font-semibold"
                >
                  {isLinking ? (
                    "Connecting..."
                  ) : (
                    <>
                      <Linkedin className="w-5 h-5 mr-2" />
                      Connect LinkedIn
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>

          <div className="text-center text-sm text-gray-500">
            By connecting, you agree to the LedgerFund terms of service and our social sharing guidelines
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareToEarn;
