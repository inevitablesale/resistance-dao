
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { Coins, ArrowLeft, Info, DollarSign } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { fetchPresaleMaticPrice, purchaseTokens, getWorkingProvider, getLgrTokenContract, getPresaleContract } from "@/services/presaleContractService";
import { ethers } from "ethers";

const BuyTokens = () => {
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const { setShowOnRamp, setShowAuthFlow } = useWalletConnection();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [maticPrice, setMaticPrice] = useState<string>("0");
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [purchasedTokens, setPurchasedTokens] = useState<string>("0");

  useEffect(() => {
    const fetchBalances = async () => {
      if (!primaryWallet?.address) return;

      try {
        const provider = await getWorkingProvider();
        const [lgrContract, presaleContract, maticBal] = await Promise.all([
          getLgrTokenContract(provider),
          getPresaleContract(provider),
          provider.getBalance(primaryWallet.address)
        ]);
        
        const [lgrBal, purchased] = await Promise.all([
          lgrContract.balanceOf(primaryWallet.address),
          presaleContract.purchasedTokens(primaryWallet.address)
        ]);
        
        setLgrBalance(ethers.utils.formatUnits(lgrBal, 18));
        setPurchasedTokens(ethers.utils.formatUnits(purchased, 18));
        setMaticBalance(ethers.utils.formatEther(maticBal));

        const currentMaticPrice = await fetchPresaleMaticPrice();
        setMaticPrice(currentMaticPrice);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [primaryWallet?.address]);

  const handleBuyPolygon = async () => {
    if (!primaryWallet?.address) {
      setShowAuthFlow?.(true);
      return;
    }

    try {
      setShowOnRamp?.(true);
    } catch (error: any) {
      console.error("Buy MATIC error:", error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to initiate MATIC purchase",
        variant: "destructive",
      });
    }
  };

  const handleConfirmPurchase = async () => {
    if (!primaryWallet?.address || !purchaseAmount) return;

    try {
      const walletClient = await primaryWallet.getWalletClient();
      if (!walletClient) {
        throw new Error("No wallet client available");
      }

      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();
      
      const result = await purchaseTokens(signer, purchaseAmount);
      
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${result.amount} LGR tokens`,
      });
      
      setIsConfirmOpen(false);
      setPurchaseAmount("");
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase tokens",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-yellow-500 hover:text-yellow-400 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Token Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300">
              Buy LGR Tokens
            </h1>
            
            <div className="space-y-4 text-white/80">
              <p className="text-lg">
                LGR tokens power the LedgerFren ecosystem, enabling you to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Submit Web3 project proposals</li>
                <li>Vote on community proposals</li>
                <li>Participate in governance decisions</li>
                <li>Access premium platform features</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <h3 className="text-yellow-500 font-semibold mb-2">Current Price</h3>
              <div className="flex items-center justify-between">
                <span className="text-white">1 LGR =</span>
                <span className="text-white font-bold">$0.10 USD</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white">≈</span>
                <span className="text-white/80">{maticPrice} MATIC</span>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Interface */}
          <div className="space-y-6">
            <div className="p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-yellow-500/20">
              <div className="space-y-4">
                {/* Balances */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="text-white">LGR Balance</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {Number(lgrBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                        alt="Polygon"
                        className="w-5 h-5"
                      />
                      <span className="text-white">MATIC Balance</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {Number(maticBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4
                      })}
                    </div>
                  </div>
                </div>

                {/* Purchase Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-12"
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={!primaryWallet?.address || Number(maticBalance) <= 0}
                  >
                    <Coins className="w-5 h-5 mr-2" />
                    Buy LGR Tokens
                  </Button>

                  <Button
                    onClick={handleBuyPolygon}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold h-12"
                  >
                    <img 
                      src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                      alt="Polygon"
                      className="w-5 h-5 mr-2"
                    />
                    Buy MATIC
                  </Button>
                </div>

                {/* Info Box */}
                <div className="flex items-start gap-3 p-4 bg-black/50 rounded-lg border border-yellow-500/20">
                  <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div className="text-sm text-white/80">
                    New to crypto? You'll need MATIC (Polygon) tokens to purchase LGR. 
                    Click "Buy MATIC" above to get started.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-black/95 border border-yellow-500/20">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Confirm LGR Purchase</DialogTitle>
            <DialogDescription>
              Enter the amount of MATIC you want to spend
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount in MATIC</label>
              <Input
                type="number"
                placeholder="Enter MATIC amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="bg-black/50 border border-yellow-500/20 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-400">You will receive approximately:</p>
              <p className="text-lg font-bold text-yellow-500">
                {(Number(purchaseAmount) / Number(maticPrice)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} LGR
              </p>
            </div>

            <div className="text-sm text-gray-400">
              Your MATIC Balance: {Number(maticBalance).toLocaleString()} MATIC
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
              disabled={!purchaseAmount || Number(purchaseAmount) <= 0 || Number(purchaseAmount) > Number(maticBalance)}
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyTokens;
