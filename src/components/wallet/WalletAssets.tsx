import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getDynamicProvider, getLgrTokenContract, getPresaleContract, fetchPresaleMaticPrice, purchaseTokens } from "@/services/presaleContractService";
import { ethers } from "ethers";
import { Coins, Loader2 } from "lucide-react";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useToast } from "@/hooks/use-toast";
import { getTokenBalance } from "@/services/tokenService";

interface TokenInfo {
  symbol: string;
  address: string;
  balance: string;
  icon?: string;
  name: string;
}

const SUPPORTED_TOKENS: TokenInfo[] = [
  {
    symbol: 'MATIC',
    name: 'Polygon',
    address: 'native',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    balance: '0'
  },
  {
    symbol: 'LGR',
    name: 'LGR Token',
    address: '0xf12145c01e4b252677a91bbf81fa8f36deb5ae00',
    balance: '0'
  },
  // Add more tokens here as needed
];

export const WalletAssets = () => {
  const { address } = useCustomWallet();
  const [tokens, setTokens] = useState<TokenInfo[]>(SUPPORTED_TOKENS);
  const [isLoading, setIsLoading] = useState(true);
  const [maticPrice, setMaticPrice] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaticPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        const data = await response.json();
        setMaticPrice(data['matic-network'].usd);
      } catch (error) {
        console.error("Error fetching MATIC price:", error);
      }
    };

    fetchMaticPrice();
    const interval = setInterval(fetchMaticPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const provider = await getDynamicProvider();

        const updatedTokens = await Promise.all(
          tokens.map(async (token) => {
            let balance = '0';
            if (token.symbol === 'MATIC') {
              const maticBalance = await provider.getBalance(address);
              balance = ethers.utils.formatEther(maticBalance);
            } else {
              balance = await getTokenBalance(
                provider,
                token.address,
                address
              );
            }
            return { ...token, balance };
          })
        );

        setTokens(updatedTokens);
      } catch (error) {
        console.error("Error fetching token balances:", error);
        toast({
          title: "Error",
          description: "Failed to fetch token balances",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address, toast]);

  const calculateUsdValue = (maticAmount: string): string => {
    if (!maticPrice) return "0.00";
    return (Number(maticAmount) * maticPrice).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-polygon-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tokens.map((token, index) => (
        <div 
          key={token.symbol}
          className={`flex items-center justify-between py-2 ${
            index > 0 ? 'border-t border-white/10' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${
              token.symbol === 'MATIC' ? 'bg-polygon-primary' : 'bg-yellow-500/20'
            } flex items-center justify-center`}>
              {token.icon ? (
                <img 
                  src={token.icon}
                  alt={token.symbol}
                  className="w-6 h-6"
                />
              ) : (
                <Coins className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <span className="text-white">{token.name}</span>
          </div>
          <div className="text-right">
            {token.symbol === 'MATIC' && (
              <div className="text-white font-medium">
                ${calculateUsdValue(token.balance)}
              </div>
            )}
            <div className={`${
              token.symbol === 'MATIC' ? 'text-sm text-gray-400' : 'text-white font-medium'
            }`}>
              {Number(token.balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })} {token.symbol}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletAssets;
