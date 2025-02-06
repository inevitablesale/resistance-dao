
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { useToast } from "@/hooks/use-toast";
import { Wallet2, AlertCircle } from "lucide-react";
import { ethers } from "ethers";
import { getPresaleContract, PRESALE_CONTRACT_ADDRESS } from "@/services/presaleContractService";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

const TokenPresaleContent = () => {
  const { user, setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [maticAmount, setMaticAmount] = useState("");
  const [expectedTokens, setExpectedTokens] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenPrice, setTokenPrice] = useState<string>("0");
  const [alreadyPurchased, setAlreadyPurchased] = useState<string>("0");
  const [maxPerWallet, setMaxPerWallet] = useState<string>("0");
  const [remainingAllowance, setRemainingAllowance] = useState<string>("0");

  useEffect(() => {
    if (!user) {
      setShowAuthFlow?.(true);
    }
  }, [user, setShowAuthFlow]);

  useEffect(() => {
    const fetchContractData = async () => {
      if (!primaryWallet?.address) return;

      try {
        const ethersProvider = new ethers.providers.Web3Provider(await primaryWallet.getWalletClient());
        const contract = getPresaleContract(ethersProvider);
        
        const price = await contract.getLGRPrice();
        setTokenPrice(ethers.utils.formatEther(price));

        const maxTokens = await contract.MAX_PER_WALLET();
        setMaxPerWallet(ethers.utils.formatEther(maxTokens));

        const purchased = await contract.purchasedTokens(primaryWallet.address);
        setAlreadyPurchased(ethers.utils.formatEther(purchased));

        const remaining = maxTokens.sub(purchased);
        setRemainingAllowance(ethers.utils.formatEther(remaining));
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    };

    fetchContractData();
  }, [primaryWallet?.address]);

  useEffect(() => {
    if (maticAmount && tokenPrice) {
      const tokens = parseFloat(maticAmount) / parseFloat(tokenPrice);
      setExpectedTokens(tokens.toFixed(2));
    } else {
      setExpectedTokens("0");
    }
  }, [maticAmount, tokenPrice]);

  const handleBuyTokens = async () => {
    if (!primaryWallet?.address || !maticAmount) return;

    if (parseFloat(expectedTokens) > parseFloat(remainingAllowance)) {
      toast({
        title: "Exceeds Limit",
        description: `You can only purchase ${remainingAllowance} more tokens.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const ethersProvider = new ethers.providers.Web3Provider(await primaryWallet.getWalletClient());
      const signer = ethersProvider.getSigner();
      const contract = getPresaleContract(signer);

      const minExpectedTokens = ethers.utils.parseEther(
        (parseFloat(expectedTokens) * 0.99).toString()
      );

      const tx = await contract.buyTokens(minExpectedTokens, {
        value: ethers.utils.parseEther(maticAmount)
      });

      await tx.wait();

      setMaticAmount("");
      setExpectedTokens("0");

      const purchased = await contract.purchasedTokens(primaryWallet.address);
      setAlreadyPurchased(ethers.utils.formatEther(purchased));
      
      const maxTokens = await contract.MAX_PER_WALLET();
      const remaining = maxTokens.sub(purchased);
      setRemainingAllowance(ethers.utils.formatEther(remaining));

      toast({
        title: "Purchase Successful!",
        description: `You've successfully purchased ${expectedTokens} LGR tokens.`,
      });
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: error?.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center mb-8 max-w-5xl mx-auto pt-32 relative z-10">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 animate-parallax-slow"
          style={{
            background: `
              radial-gradient(2px 2px at 20% 20%, rgba(234, 179, 8, 0.95) 100%, transparent),
              radial-gradient(2px 2px at 40% 40%, rgba(234, 179, 8, 0.92) 100%, transparent),
              radial-gradient(3px 3px at 60% 60%, rgba(234, 179, 8, 0.90) 100%, transparent)
            `,
            backgroundSize: "240px 240px",
            opacity: 0.1
          }}
        />
      </div>

      <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 leading-tight">
        Join LedgerFund Presale
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
        You're about to participate in shaping the future of decentralized accounting. Follow the steps below to purchase LGR tokens.
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
          <div className="flex justify-center mb-8">
            <DynamicWidget />
          </div>
          
          <div className="space-y-8 text-white">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20">
                <p className="text-2xl font-bold text-yellow-400">{parseFloat(maxPerWallet).toLocaleString()}</p>
                <p className="text-sm text-gray-400">Max Tokens Per Wallet</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
                <p className="text-2xl font-bold text-teal-400">$0.10</p>
                <p className="text-sm text-gray-400">Price Per Token</p>
              </div>
            </div>

            {user && (
              <div className="space-y-4">
                <Alert className="bg-black/30 border-yellow-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Your Purchase Info</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>Already purchased: {parseFloat(alreadyPurchased).toLocaleString()} LGR</p>
                    <p>Remaining allowance: {parseFloat(remainingAllowance).toLocaleString()} LGR</p>
                  </AlertDescription>
                </Alert>

                <div className="p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20 space-y-4">
                  <h4 className="text-lg font-medium text-teal-400">Buy LGR Tokens</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Amount in MATIC
                      </label>
                      <Input
                        type="number"
                        value={maticAmount}
                        onChange={(e) => setMaticAmount(e.target.value)}
                        placeholder="Enter MATIC amount"
                        className="w-full bg-black/30 border-white/20"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Expected LGR: {expectedTokens}
                      </p>
                    </div>
                    <Button
                      onClick={handleBuyTokens}
                      disabled={!maticAmount || isLoading || !user || parseFloat(expectedTokens) > parseFloat(remainingAllowance)}
                      className="w-full bg-gradient-to-r from-yellow-600 to-teal-500 hover:from-yellow-500 hover:to-teal-400"
                    >
                      {isLoading ? "Processing..." : "Buy Tokens"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <Wallet2 className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Network: Polygon (MATIC)</span>
              </div>
              <p className="text-xs text-gray-400">Contract: {PRESALE_CONTRACT_ADDRESS}</p>
              <p className="text-xs text-gray-400">Make sure you have enough MATIC for gas fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TokenPresale = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at center, #eab308 0%, #000000 100%)',
            opacity: 0.98 
          }} 
        />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 relative z-10">
        <TokenPresaleContent />
      </div>
    </div>
  );
};

export default TokenPresale;

