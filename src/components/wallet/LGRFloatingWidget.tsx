import React, { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Wallet } from "lucide-react";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const COINGECKO_API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd";

const LGR_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const LGRFloatingWidget = () => {
  const { primaryWallet } = useDynamicContext();
  const [showWidget, setShowWidget] = useState(false);
  const [usdBalance, setUsdBalance] = useState("0.00");
  const [lgrBalance, setLgrBalance] = useState("0.00");
  const [lgrPrice, setLgrPrice] = useState("0.00");

  useEffect(() => {
    const fetchBalances = async () => {
      if (!primaryWallet?.address) return;

      try {
        const provider = await primaryWallet.getEthersProvider();
        if (!provider) return;

        const signer = provider.getSigner();
        const lgrToken = new ethers.Contract(
          LGR_TOKEN_ADDRESS,
          LGR_ABI,
          signer
        );

        const balance = await lgrToken.balanceOf(primaryWallet.address);
        const decimals = await lgrToken.decimals();
        const formattedBalance = formatEther(balance, decimals);
        setLgrBalance(Number(formattedBalance).toFixed(2));

        // Fetch USDC balance to estimate USD value
        const usdcContract = new ethers.Contract(
          "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Polygon
          ["function balanceOf(address owner) view returns (uint256)"],
          provider
        );
        const usdcBalance = await usdcContract.balanceOf(primaryWallet.address);
        const formattedUsdcBalance = formatEther(usdcBalance, 6); // USDC has 6 decimals
        setUsdBalance(Number(formattedUsdcBalance).toFixed(2));

        // Fetch LGR price (using dummy value for now)
        setLgrPrice("0.10");
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
  }, [primaryWallet]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showWidget && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-2 w-64">
          <h3 className="text-lg font-semibold mb-2">Wallet Balances</h3>
          <div className="flex items-center justify-between mb-2">
            <span>
              <Badge variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                USD Balance:
              </Badge>
            </span>
            <span>${usdBalance}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline">
                <Wallet className="h-4 w-4 mr-2" />
                LGR Balance:
              </Badge>
            </span>
            <span>{lgrBalance} LGR</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            LGR Price: ${lgrPrice}
          </p>
        </div>
      )}
      <button
        onClick={() => setShowWidget(!showWidget)}
        className="bg-polygon-primary text-white rounded-full p-3 hover:bg-polygon-secondary focus:outline-none"
      >
        <Wallet className="h-6 w-6" />
      </button>
    </div>
  );
};
