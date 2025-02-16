
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Wallet } from "lucide-react";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const LGR_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function getPrice() external view returns (uint256)",
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
        const walletClient = await primaryWallet.getWalletClient();
        if (!walletClient) return;

        const provider = new ethers.providers.Web3Provider(walletClient);
        const signer = provider.getSigner();
        const lgrToken = new ethers.Contract(
          LGR_TOKEN_ADDRESS,
          LGR_ABI,
          signer
        );

        // Get LGR balance
        const balance = await lgrToken.balanceOf(primaryWallet.address);
        setLgrBalance(ethers.utils.formatUnits(balance, 18));

        // Get USD balance
        const price = await lgrToken.getPrice();
        const usdValue = ethers.utils.formatUnits(price.mul(balance).div(ethers.constants.WeiPerEther), 18);
        setUsdBalance(usdValue);
        setLgrPrice(ethers.utils.formatUnits(price, 18));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
  }, [primaryWallet]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showWidget && (
        <div className="bg-black/80 backdrop-blur-md rounded-md shadow-lg p-4 mb-2 text-white">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-gray-400" />
            <span>Wallet Balance:</span>
          </div>
          <div className="text-sm text-gray-400">LGR Balance: {Number(lgrBalance).toFixed(2)}</div>
          <div className="text-sm text-gray-400">USD Value: ${Number(usdBalance).toFixed(2)}</div>
          <div className="text-sm text-gray-400">LGR Price: ${Number(lgrPrice).toFixed(4)}</div>
        </div>
      )}
      <Badge
        className="cursor-pointer rounded-full h-10 w-auto px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-popover text-popover-foreground shadow-md flex items-center"
        onClick={() => setShowWidget(!showWidget)}
      >
        <DollarSign className="h-4 w-4 mr-2" />
        {showWidget ? "Hide Balance" : "Show Balance"}
      </Badge>
    </div>
  );
};

export default LGRFloatingWidget;
