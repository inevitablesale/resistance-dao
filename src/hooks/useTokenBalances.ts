
import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getTokenBalance } from '@/services/tokenService';

interface TokenContract {
  symbol: string;
  address?: string;
}

interface TokenBalance {
  symbol: string;
  balance: string;
}

export const useTokenBalances = (tokenContracts: TokenContract[]) => {
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address;

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) {
        setTokenBalances([]);
        return;
      }

      try {
        const balances = await Promise.all(
          tokenContracts.map(async (contract) => ({
            symbol: contract.symbol,
            balance: await getTokenBalance(
              contract.address || '0xf12145c01e4b252677a91bbf81fa8f36deb5ae00', // Default LGR token address
              address
            )
          }))
        );
        setTokenBalances(balances);
      } catch (error) {
        console.error('Error fetching token balances:', error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [address, tokenContracts]);

  return { tokenBalances };
};
