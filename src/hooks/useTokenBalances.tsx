
import { useEffect, useState } from "react";
import { ethers } from "ethers";

interface TokenBalance {
  balance: ethers.BigNumber;
  formatted: string;
}

interface TokenBalancesConfig {
  networkId: number;
  accountAddress?: string;
  includeFiat: boolean;
  includeNativeBalance: boolean;
  tokenAddresses: string[];
}

export const useTokenBalances = (config: TokenBalancesConfig) => {
  const [tokenBalances, setTokenBalances] = useState<Record<string, TokenBalance>>({});

  useEffect(() => {
    const fetchBalances = async () => {
      if (!config.accountAddress) return;
      
      try {
        // Initialize with empty balances
        const balances: Record<string, TokenBalance> = {};
        config.tokenAddresses.forEach(address => {
          balances[address] = {
            balance: ethers.BigNumber.from(0),
            formatted: "0"
          };
        });
        
        setTokenBalances(balances);
      } catch (error) {
        console.error("Error fetching token balances:", error);
      }
    };

    fetchBalances();
  }, [config.accountAddress, config.tokenAddresses]);

  return { tokenBalances };
};
