
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getWorkingProvider, getLgrTokenContract, getPresaleContract, fetchPresaleMaticPrice, purchaseTokens } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Coins, Info, AlertCircle } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const POLYGON_CHAIN_ID = 137; // Polygon Mainnet

export const LGRFloatingWidget = () => {
  const { address } = useCustomWallet();
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const [purchasedTokens, setPurchasedTokens] = useState<string>("0");
  const [maticBalance, setMaticBalance] = useState<string>("0");
  const [maticPrice, setMaticPrice] = useState<string>("0");
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkNetwork = async () => {
    try {
      if (!primaryWallet?.isConnected?.()) {
        console.log("Wallet not connected");
        return false;
      }
      
      const walletClient = await primaryWallet.getWalletClient();
      if (!walletClient) {
        console.log("No wallet client available");
        return false;
      }

      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const network = await provider.getNetwork();
      
      if (network.chainId !== POLYGON_CHAIN_ID) {
        setNetworkError("Please connect to the Polygon network to use this feature.");
        return false;
      }
      
      setNetworkError(null);
      return true;
    } catch (error) {
      console.error("Network check error:", error);
      setNetworkError("Failed to verify network. Please ensure you're connected to Polygon.");
      return false;
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address || !primaryWallet?.isConnected?.()) {
        console.log("No address or wallet not connected");
        return;
      }

      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        console.log("Incorrect network");
        return;
      }

      try {
        console.log("Fetching provider...");
        const provider = await getWorkingProvider();
        console.log("Provider fetched, getting contracts...");
        
        const [lgrContract, presaleContract, maticBal] = await Promise.all([
          getLgrTokenContract(provider),
          getPresaleContract(provider),
          provider.getBalance(address)
        ]);
        
        console.log("Contracts obtained, fetching balances...");
        const [lgrBal, purchased] = await Promise.all([
          lgrContract.balanceOf(address),
          presaleContract.purchasedTokens(address)
        ]);
        
        setLgrBalance(ethers.utils.formatUnits(lgrBal, 18));
        setPurchasedTokens(ethers.utils.formatUnits(purchased, 18));
        setMaticBalance(ethers.utils.formatEther(maticBal));

        const currentMaticPrice = await fetchPresaleMaticPrice();
        setMaticPrice(currentMaticPrice);
        console.log("All balances fetched successfully");
      } catch (error) {
        console.error("Error fetching balances:", error);
        setNetworkError("Failed to get contract status. Please ensure you're connected to the Polygon network.");
      }
    };

    if (primaryWallet?.isConnected?.()) {
      console.log("Wallet connected, fetching balances...");
      fetchBalances();
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    } else {
      console.log("Wallet not connected");
    }
  }, [address, primaryWallet]);

  const handleBuyPolygon = () => {
    window.open('https://www.binance.com/en/price/polygon', '_blank');
  };

  const handleConfirmPurchase = async () => {
    if (!address || !purchaseAmount) return;

    const isCorrectNetwork = await checkNetwork();
    if (!isCorrectNetwork) {
      toast({
        title: "Network Error",
        description: "Please connect to the Polygon network to purchase tokens.",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = await getWorkingProvider();
      const signer = provider.getSigner(address);
      
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <div className="mb-2 px-3 py-1 bg-black/90 rounded-lg backdrop-blur-sm border border-white/10">
        <span className="text-yellow-500 text-sm font-medium">LGR Wallet</span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-12 h-12 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors flex items-center justify-center">
            <Coins className="w-6 h-6 text-yellow-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-black/90 backdrop-blur-lg border border-white/10">
          {networkError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {networkError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-white">LGR Token</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {Number(lgrBalance).toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })} LGR
                </div>
                <div className="text-sm text-gray-400">
                  Purchased: {Number(purchasedTokens).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} LGR
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <img 
                    src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                    alt="Polygon"
                    className="w-5 h-5"
                  />
                </div>
                <span className="text-white">POLYGON Balance</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">
                  {Number(maticBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                  })} POLYGON
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                Price: $0.10 USD per LGR
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={!address || Number(maticBalance) <= 0}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Buy LGR
                </Button>

                <Button
                  onClick={handleBuyPolygon}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <img 
                    src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                    alt="Polygon"
                    className="w-5 h-5"
                  />
                  Buy Polygon
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10"
                  onClick={() => setShowInstructions(true)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  How to Buy
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="bg-black/95 border border-yellow-500/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">How to Buy LGR Tokens</DialogTitle>
            <DialogDescription>
              Follow these steps to purchase LGR tokens
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="polygon">Get MATIC</TabsTrigger>
              <TabsTrigger value="lgr">Buy LGR</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-4 text-white">
                <h3 className="font-semibold text-lg">Quick Start Guide</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Connect your wallet using the button in the top right</li>
                  <li>Purchase MATIC (Polygon) tokens from popular exchanges</li>
                  <li>Use your MATIC to buy LGR tokens</li>
                  <li>Pay a small gas fee in MATIC to complete the transaction</li>
                </ol>
                <p className="text-sm text-gray-400 mt-4">
                  Note: Make sure to purchase enough MATIC to cover both your LGR purchase and the gas fees (approximately 0.001 MATIC)
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="polygon">
              <div className="space-y-4 text-white">
                <h3 className="font-semibold text-lg">Getting MATIC (Polygon)</h3>
                <div className="space-y-2">
                  <p>MATIC is the native token of the Polygon network. You need it to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Purchase LGR tokens</li>
                    <li>Pay for transaction fees (gas)</li>
                  </ul>
                  <p className="mt-4">Where to buy MATIC:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><a href="https://www.binance.com/en/trade/MATIC_USDT" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Binance</a></li>
                    <li><a href="https://www.coinbase.com/price/polygon" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Coinbase</a></li>
                    <li><a href="https://www.kraken.com/prices/matic-polygon-price-chart/usd-us-dollar" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Kraken</a></li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lgr">
              <div className="space-y-4 text-white">
                <h3 className="font-semibold text-lg">Buying LGR Tokens</h3>
                <div className="space-y-2">
                  <p>Once you have MATIC in your wallet:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Click the "Buy LGR" button</li>
                    <li>Enter the amount of MATIC you want to spend</li>
                    <li>Review the number of LGR tokens you'll receive</li>
                    <li>Confirm the transaction in your wallet</li>
                  </ol>
                  <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg">
                    <p className="text-yellow-500 font-semibold">Important:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>Current price: $0.10 USD per LGR</li>
                      <li>Minimum purchase: None</li>
                      <li>Transaction fee: ~0.001 MATIC</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              onClick={() => setShowInstructions(false)}
              className="w-full sm:w-auto"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-black/95 border border-yellow-500/20">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Confirm LGR Purchase</DialogTitle>
            <DialogDescription>
              Enter the amount of POLYGON you want to spend
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount in POLYGON</label>
              <Input
                type="number"
                placeholder="Enter POLYGON amount"
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
              Your POLYGON Balance: {Number(maticBalance).toLocaleString()} POLYGON
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

export default LGRFloatingWidget;
