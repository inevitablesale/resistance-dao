
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DynamicContextProvider, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GovernanceVoting from "./pages/GovernanceVoting";
import MintNFT from "./pages/MintNFT";
import { useToast } from "./hooks/use-toast";

function App() {
  const { toast } = useToast();
  
  const ENVIRONMENT_ID = "00a01fb3-76e6-438d-a77d-342bbf2084e2";
  
  const zeroDevConfig = {
    bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
  };

  const dynamicSettings = {
    environmentId: ENVIRONMENT_ID,
    walletConnectors: [
      EthereumWalletConnectors,
      ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
    ],
    eventsCallbacks: {
      onAuthSuccess: (args: any) => {
        console.log("Auth Success:", args);
        toast({
          title: "Authentication Successful",
          description: "You're now connected to LedgerFund.",
        });
      },
      onVerificationComplete: () => {
        console.log("Verification completed");
        toast({
          title: "Verification Complete",
          description: "Your verification has been completed successfully.",
        });
      },
      onLogout: () => {
        console.log("Logged out");
        toast({
          title: "Logged Out",
          description: "You've been successfully logged out.",
        });
      },
      onDisconnect: () => {
        console.log("Wallet disconnected");
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      },
      onError: (error: any) => {
        console.error("Dynamic SDK Error:", error);
        toast({
          title: "Error",
          description: error?.message || "An error occurred",
          variant: "destructive",
        });
      }
    },
    settings: {
      network: {
        chainId: 137, // Polygon Mainnet
      },
      environmentId: ENVIRONMENT_ID,
      appName: "LedgerFund",
      appLogoUrl: "/favicon.ico",
      enableEmbeddedWallets: true,
      enableVisitTrackingOnConnectOnly: false,
      enableWalletConnectV1: false,
      enableWalletConnectV2: true,
      persistWalletSession: true,
      enableAuthProviders: true,
      shadowDOMEnabled: false,
    },
    // Move tokens to root level of dynamicSettings
    tokens: [
      {
        name: "LedgerFund Token",
        symbol: "LGR",
        icon: "/favicon.ico",
        address: "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00",
        decimals: 18,
        chainId: 137,
        // Add these properties for better token display
        logoURI: "/favicon.ico",
        isToken: true,
        balance: "fetchFromContract", // Dynamic will fetch the balance
        contractAddress: "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00"
      }
    ]
  };

  return (
    <DynamicContextProvider settings={dynamicSettings}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/governance-voting" element={<GovernanceVoting />} />
          <Route path="/mint-nft" element={<MintNFT />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DynamicContextProvider>
  );
}

export default App;

