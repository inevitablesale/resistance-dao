
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
  
  const zeroDevConfig = {
    bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
  };

  const dynamicSettings = {
    environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
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
      onEmailVerificationSuccess: (args: any) => {
        console.log("Email Verification Success:", args);
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        });
      },
      onWalletConnectSuccess: (args: any) => {
        console.log("Wallet Connect Success:", args);
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
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
      },
      onEmailVerificationFailure: (error: any) => {
        console.error("Email Verification Error:", error);
        toast({
          title: "Verification Failed",
          description: "Failed to verify email. Please try again.",
          variant: "destructive",
        });
      }
    },
    settings: {
      network: {
        chainId: 137, // Polygon Mainnet
      },
      environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
      appName: "LedgerFund",
      appLogoUrl: "/favicon.ico",
      enableEmbeddedWallets: true,
      enableVisitTrackingOnConnectOnly: false,
      enableWalletConnectV1: false,
      enableWalletConnectV2: true,
      persistWalletSession: true,
      enableAuthProviders: true,
      enablePasskeys: false,
      evmWallets: {
        options: {
          emailAuth: {
            autoVerify: true,
            autoClose: true,
            onChange: () => {
              console.log("Email auth form changed");
            },
            onComplete: () => {
              console.log("Email auth completed");
            }
          }
        }
      },
      shadowDOMEnabled: false,
      tokens: [
        {
          address: "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00",
          symbol: "LGR",
          decimals: 18,
          name: "LedgerFund Token",
          icon: "/favicon.ico",
          chainId: 137
        }
      ]
    }
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
