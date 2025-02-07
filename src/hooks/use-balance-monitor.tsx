
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

export const useBalanceMonitor = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!primaryWallet?.address) return;

    const setupBalanceMonitoring = async () => {
      try {
        // Try RPC endpoints until one works
        let provider;
        for (const rpc of RPC_ENDPOINTS) {
          try {
            provider = new ethers.providers.JsonRpcProvider(rpc);
            await provider.getNetwork();
            break;
          } catch (error) {
            console.warn(`RPC ${rpc} failed, trying next one...`);
            continue;
          }
        }

        if (!provider) {
          throw new Error("All RPC endpoints failed");
        }

        const lgrContract = new ethers.Contract(LGR_TOKEN_ADDRESS, LGR_ABI, provider);

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

