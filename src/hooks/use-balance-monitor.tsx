
import { useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { RPC_ENDPOINTS } from "@/services/presaleContractService";

const LGR_TOKEN_ADDRESS = "0xC0c47EE9300653ac9D333c16eC6A99C66b2cE72c";
const LGR_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Function to get a working provider
async function getWorkingProvider() {
  for (const rpc of RPC_ENDPOINTS) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      // Test the provider with a simple call
      await provider.getNetwork();
      return provider;
    } catch (error) {
      console.warn(`RPC ${rpc} failed, trying next one...`);
      continue;
    }
  }
  throw new Error("All RPC endpoints failed");
}

export const useBalanceMonitor = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!primaryWallet?.address) return;

    const setupBalanceMonitoring = async () => {
      try {
        const walletClient = await primaryWallet.getWalletClient();
        const provider = new ethers.providers.Web3Provider(walletClient);
        const fallbackProvider = await getWorkingProvider();
        
        const lgrContract = new ethers.Contract(LGR_TOKEN_ADDRESS, LGR_ABI, fallbackProvider);

        // Monitor LGR token transfers
        const filterTo = lgrContract.filters.Transfer(null, primaryWallet.address);
        lgrContract.on(filterTo, (from, to, value) => {
          const amount = ethers.utils.formatEther(value);
          toast({
            title: "LGR Tokens Received!",
            description: `You received ${Number(amount).toFixed(2)} LGR tokens`,
          });
        });

        // Monitor MATIC balance changes
        provider.on(primaryWallet.address, (balance) => {
          const amount = ethers.utils.formatEther(balance);
          toast({
            title: "MATIC Balance Updated",
            description: `Your new balance is ${Number(amount).toFixed(4)} MATIC`,
          });
        });

        return () => {
          lgrContract.removeAllListeners();
          provider.removeAllListeners();
        };
      } catch (error) {
        console.error("Error setting up balance monitoring:", error);
      }
    };

    setupBalanceMonitoring();
  }, [primaryWallet?.address, toast]);
};
