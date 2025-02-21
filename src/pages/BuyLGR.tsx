
import { useEffect, useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from '@dynamic-labs/sdk-api-core';
import { ethers } from "ethers";
import { 
  fetchTotalLGRSold, 
  fetchRemainingPresaleSupply,
  fetchPresaleMaticPrice,
  purchaseTokens 
} from "@/services/presaleContractService";
import { 
  Coins,
  DollarSign,
  Info,
  CheckCircle2,
  Wallet,
  ArrowRight
} from "lucide-react";

export default function BuyLGR() {
  const { address } = useCustomWallet();
  const { setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { enabled: onrampEnabled, open: openOnramp } = useOnramp();
  const [totalSold, setTotalSold] = useState<string>("0");
  const [remainingSupply, setRemainingSupply] = useState<string>("0");
  const [maticPrice, setMaticPrice] = useState<string>("0");
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sold, remaining, matic] = await Promise.all([
          fetchTotalLGRSold(),
          fetchRemainingPresaleSupply(),
          fetchPresaleMaticPrice()
        ]);
        
        setTotalSold(sold);
        setRemainingSupply(remaining);
        setMaticPrice(matic);
      } catch (error) {
        console.error("Error fetching presale data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyPolygon = async () => {
    if (!primaryWallet?.address) {
      setShowAuthFlow?.(true);
      return;
    }

    if (!onrampEnabled) {
      toast({
        title: "Onramp Not Available",
        description: "The onramp service is currently not available",
        variant: "destructive"
      });
      return;
    }

    try {
      await openOnramp({
        onrampProvider: OnrampProviders.Banxa,
        token: 'MATIC',
        address: primaryWallet.address,
      });
      
      toast({
        title: "Purchase Initiated",
        description: "Your MATIC purchase has been initiated successfully"
      });
    } catch (error) {
      console.error("Onramp error:", error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to initiate purchase",
        variant: "destructive"
      });
    }
  };

  const handleBuyLGR = async () => {
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

  const expectedLGRAmount = (Number(purchaseAmount) / Number(maticPrice)).toFixed(2);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
            Buy LGR Tokens
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Join the LGR community and get access to exclusive benefits including proposal voting, NFT minting, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Presale Stats */}
          <Card className="bg-black/30 border-white/10">
            <CardHeader>
              <CardTitle>Presale Statistics</CardTitle>
              <CardDescription className="text-white/70">
                Current presale progress and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-white/70">Price per LGR</span>
                  <span className="text-xl font-semibold text-yellow-500">$0.10 USD</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-white/70">MATIC per LGR</span>
                  <span className="text-xl font-semibold text-yellow-500">{maticPrice} MATIC</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-white/70">Total Sold</span>
                  <span className="text-xl font-semibold text-teal-500">{totalSold} LGR</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-white/70">Remaining Supply</span>
                  <span className="text-xl font-semibold text-teal-500">{Number(remainingSupply).toLocaleString()} LGR</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Purchase Interface */}
          <div className="space-y-6">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle>Purchase LGR</CardTitle>
                <CardDescription className="text-white/70">
                  Complete your purchase in two simple steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="buy-matic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy-matic">1. Get MATIC</TabsTrigger>
                    <TabsTrigger value="buy-lgr">2. Buy LGR</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="buy-matic" className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Get MATIC (Polygon)
                      </h3>
                      <p className="text-white/70">
                        You need MATIC tokens to purchase LGR. Buy MATIC directly through our platform.
                      </p>
                      <Button
                        onClick={handleBuyPolygon}
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        Buy MATIC Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="buy-lgr" className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Coins className="w-5 h-5" />
                        Buy LGR Tokens
                      </h3>
                      <div className="space-y-3">
                        <Input
                          type="number"
                          placeholder="Enter MATIC amount"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(e.target.value)}
                          className="bg-black/50 border-white/10"
                        />
                        <div className="text-sm text-white/70">
                          You will receive approximately: 
                          <span className="text-yellow-500 font-semibold ml-2">
                            {expectedLGRAmount} LGR
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={handleBuyLGR}
                        disabled={!purchaseAmount || Number(purchaseAmount) <= 0}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
                      >
                        Buy LGR Tokens
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-500" />
                  LGR Token Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Priority access to mint proposal NFTs at discounted rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Voting power on community-driven Web3 proposals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>Share in the success of funded Web3 projects</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
