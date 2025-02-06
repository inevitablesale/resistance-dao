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
        // Get ethers provider from Dynamic wallet
        const ethersProvider = new ethers.providers.Web3Provider(await primaryWallet.getWalletClient());
        const contract = getPresaleContract(ethersProvider);
        
        // Get token price in MATIC
        const price = await contract.getLGRPrice();
        setTokenPrice(ethers.utils.formatEther(price));

        // Get max tokens per wallet
        const maxTokens = await contract.MAX_PER_WALLET();
        setMaxPerWallet(ethers.utils.formatEther(maxTokens));

        // Get already purchased amount
        const purchased = await contract.purchasedTokens(primaryWallet.address);
        setAlreadyPurchased(ethers.utils.formatEther(purchased));

        // Calculate remaining allowance
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

    // Check if purchase would exceed allowance
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

      // Calculate minimum expected tokens with 1% slippage tolerance
      const minExpectedTokens = ethers.utils.parseEther(
        (parseFloat(expectedTokens) * 0.99).toString()
      );

      // Dynamic will automatically show the transaction confirmation UI
      const tx = await contract.buyTokens(minExpectedTokens, {
        value: ethers.utils.parseEther(maticAmount)
      });

      // Let Dynamic handle the transaction UI, no need for our own toast here
      await tx.wait();

      // Reset form and update purchased amount after confirmation
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
    <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
      <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
        Join LedgerFund Presale
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
        You're about to participate in shaping the future of decentralized accounting. Follow the steps below to purchase LGR tokens.
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
          <div className="flex justify-center mb-8">
            <button className="w-full py-3 px-4 rounded-lg bg-[#8247E5] hover:bg-[#6f3cc7] text-white font-medium transition-colors">
              <DynamicWidget />
            </button>
          </div>
          
          <div className="space-y-8 text-white">
            {/* Token Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-[#8247E5]">{parseFloat(maxPerWallet).toLocaleString()}</p>
                <p className="text-sm text-gray-400">Max Tokens Per Wallet</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-[#8247E5]">$0.10</p>
                <p className="text-sm text-gray-400">Price Per Token</p>
              </div>
            </div>

            {user && (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Your Purchase Info</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>Already purchased: {parseFloat(alreadyPurchased).toLocaleString()} LGR</p>
                    <p>Remaining allowance: {parseFloat(remainingAllowance).toLocaleString()} LGR</p>
                  </AlertDescription>
                </Alert>

                <div className="p-6 rounded-lg bg-white/5 space-y-4">
                  <h4 className="text-lg font-medium text-[#8247E5]">Buy LGR Tokens</h4>
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
                        className="w-full bg-white/10 border-white/20"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Expected LGR: {expectedTokens}
                      </p>
                    </div>
                    <Button
                      onClick={handleBuyTokens}
                      disabled={!maticAmount || isLoading || !user || parseFloat(expectedTokens) > parseFloat(remainingAllowance)}
                      className="w-full bg-[#8247E5] hover:bg-[#6f3cc7]"
                    >
                      {isLoading ? "Processing..." : "Buy Tokens"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Network Info */}
            <div className="p-4 rounded-lg bg-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <Wallet2 className="w-5 h-5 text-[#8247E5]" />
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
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)', opacity: 0.98 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)', animation: 'quantumField 30s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent), radial-gradient(2px 2px at 20% 20%, rgba(0, 255, 255, 0.7) 100%, transparent), radial-gradient(1.5px 1.5px at 30% 30%, rgba(147, 51, 255, 0.8) 100%, transparent), radial-gradient(2px 2px at 40% 40%, rgba(64, 156, 255, 0.6) 100%, transparent), radial-gradient(1.5px 1.5px at 50% 50%, rgba(255, 255, 255, 0.7) 100%, transparent)', backgroundSize: '400% 400%', animation: 'temporalWake 240s ease-in-out infinite' }} />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 relative z-10">
        <TokenPresaleContent />
      </div>
    </div>
  );
};

export default TokenPresale;
