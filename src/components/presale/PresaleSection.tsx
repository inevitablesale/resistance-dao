
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Wallet } from "lucide-react";
import { TokenPurchaseForm } from "@/components/TokenPurchaseForm";
import { PRESALE_END_TIME, TOTAL_PRESALE_SUPPLY, fetchTotalLGRSold, fetchPresaleMaticPrice } from "@/services/presaleContractService";

export const PresaleSection = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [presaleSupply] = useState<string>(TOTAL_PRESALE_SUPPLY.toString());
  const [totalSold, setTotalSold] = useState<string>('0');
  const [presaleEndTime] = useState<number>(PRESALE_END_TIME * 1000);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [myPurchased, setMyPurchased] = useState<string>('0');
  const [maticPrice, setMaticPrice] = useState<string>('Loading...');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  const handleBuyClick = () => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to purchase tokens.",
        duration: 5000,
      });
    } else {
      setShowPurchaseForm(true);
    }
  };

  const fetchPresaleData = async () => {
    try {
      const sold = await fetchTotalLGRSold();
      setTotalSold(sold);

      const price = await fetchPresaleMaticPrice();
      setMaticPrice(price === "0" ? "Loading..." : `${price} MATIC`);
      
      if (primaryWallet?.address) {
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
        const presaleContract = await getPresaleContract(provider);
        const purchased = await (await presaleContract).purchasedTokens(primaryWallet.address);
        setMyPurchased(ethers.utils.formatEther(purchased));
      }
    } catch (error) {
      console.error('Error fetching presale data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch presale data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = presaleEndTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [presaleEndTime]);

  useEffect(() => {
    fetchPresaleData();
    const interval = setInterval(fetchPresaleData, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculatePercentage = () => {
    return ((Number(totalSold) / Number(presaleSupply)) * 100).toFixed(2);
  };

  const formatLargeNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ea384c] text-white py-2 px-4 font-bold text-lg shadow-lg transform rotate-[-35deg] w-[150%] text-center"
        >
          SALE STARTS 2/10/2025
        </div>
      </div>
      
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 blur-xl animate-pulse" />
            <h2 className="relative text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-2 text-center">
              Presale
            </h2>
          </div>
        </div>

        <div className="text-center text-white/80 font-medium mb-4">
          UNTIL PRICE INCREASE
        </div>

        <div className="grid grid-cols-4 gap-8 mb-8">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds }
          ].map(({ label, value }) => (
            <div 
              key={label} 
              className="relative group perspective-3000"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-teal-500/30 rounded-lg blur-md transform group-hover:scale-110 transition-transform duration-300" />
              <div className="relative bg-black/80 p-4 rounded-lg border border-yellow-500/30 transform transition-all duration-300 group-hover:translate-y-[-2px]">
                <div className="text-4xl font-bold text-white mb-2 text-center animate-[pulse_2s_ease-in-out_infinite]">
                  {value}
                </div>
                <div className="text-sm text-gray-400 text-center">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-teal-500/10 blur-lg" />
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <div className="text-white text-lg">
                <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-300">
                  {formatLargeNumber(totalSold)}
                </span>
                <span className="text-gray-400"> / </span> 
                <span className="text-gray-300">5M</span>
                <span className="text-gray-400 ml-2">LGR Tokens Sold</span>
              </div>
              <div className="text-teal-400 font-bold">
                {calculatePercentage()}%
              </div>
            </div>
            
            <div className="relative h-4 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 animate-pulse blur-sm"
              />
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-teal-500 transition-all duration-1000 relative"
                style={{ 
                  width: `${Math.min(100, (Number(totalSold) / Number(presaleSupply)) * 100)}%` 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/50 to-teal-500/50 animate-pulse" />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-center text-white/80 font-medium">
                90% DISCOUNT ACTIVE
              </div>
              <div className="text-center text-teal-400 font-medium">
                Current Price: {maticPrice} / $0.10 USD
              </div>
            </div>
          </div>
        </div>

        {showPurchaseForm ? (
          <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Purchase LGR Tokens</h2>
              <button
                onClick={() => setShowPurchaseForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
            <TokenPurchaseForm />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={handleBuyClick}
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="relative flex items-center justify-center gap-3 text-white font-medium text-lg">
                <Trophy className="w-5 h-5" />
                <span>Buy with Card</span>
              </div>
            </button>
            
            <button 
              onClick={handleBuyClick}
              className="group relative px-8 py-4 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="relative flex items-center justify-center gap-3 text-white font-medium text-lg">
                <Wallet className="w-5 h-5" />
                <span>Buy with Crypto</span>
              </div>
            </button>
          </div>
        )}

        <button 
          onClick={() => window.open('https://docs.ledgerfund.finance/guides/buying-lgr', '_blank')}
          className="mt-4 text-gray-400 hover:text-white transition-colors text-sm w-full text-center"
        >
          New to crypto? Get started here
        </button>
      </div>
    </div>
  );
};
