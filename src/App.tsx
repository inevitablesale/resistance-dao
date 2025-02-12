
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { Analytics } from '@vercel/analytics/react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GovernanceVoting from "./pages/GovernanceVoting";
import MintNFT from "./pages/MintNFT";
import ShareToEarn from "./pages/ShareToEarn";
import Litepaper from "./pages/Litepaper";
import KnowledgeArticle from "./pages/KnowledgeArticle";
import ContentHub from "./pages/ContentHub";
import { Marketplace } from "./pages/Marketplace";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { PurchaseProvider } from "./contexts/PurchaseContext";

function App() {
  const { toast } = useToast();
  
  const zeroDevConfig = {
    projectId: "4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
  };

  const dynamicSettings = {
    environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
    walletConnectorOptions: {
      zeroDevOptions: zeroDevConfig
    },
    walletConnectors: [
      EthereumWalletConnectors,
      ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
    ],
    eventsCallbacks: {
      onAuthFlowOpen: () => {
        console.log("[Dynamic SDK] Auth flow opened");
      },
      onAuthFlowClose: () => {
        console.log("[Dynamic SDK] Auth flow closed");
      },
      onAuthFailure: (reason) => {
        console.log("[Dynamic SDK] Auth failure:", reason);
        toast({
          title: "Authentication Failed",
          description: "There was an error connecting your wallet.",
        });
      },
      onAuthSuccess: (args) => {
        console.log("[Dynamic SDK] Auth Success:", args);
        toast({
          title: "Successfully Connected",
          description: `Connected ${args?.wallet?.connector?.name || 'wallet'} (${args?.wallet?.address?.slice(0, 6)}...${args?.wallet?.address?.slice(-4)})`,
        });
      },
      onVerificationSuccess: (args) => {
        console.log("[Dynamic SDK] Verification success:", args);
      },
      onSessionConnect: () => {
        console.log("[Dynamic SDK] Session connected");
      },
      onSessionRestore: () => {
        console.log("[Dynamic SDK] Session restored");
      },
      onLogout: () => {
        console.log("[Dynamic SDK] User logged out");
        toast({
          title: "Logged Out",
          description: "You've been successfully logged out.",
        });
      },
      onEmailVerificationStart: () => {
        console.log("[Dynamic SDK] Email verification started");
      },
      onEmailVerificationSuccess: () => {
        console.log("[Dynamic SDK] Email verification succeeded");
      },
      onDisconnect: () => {
        console.log("[Dynamic SDK] Wallet disconnected");
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      },
      onPaymentCancel: () => {
        console.log("[Dynamic SDK] Payment cancelled");
        toast({
          title: "Payment Cancelled",
          description: "The payment process was cancelled.",
        });
      },
      onPaymentSuccess: () => {
        console.log("[Dynamic SDK] Payment successful");
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
      },
      onPaymentError: (error) => {
        console.error("[Dynamic SDK] Payment error:", error);
        toast({
          title: "Payment Error",
          description: "There was an error processing your payment.",
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
      enableVisitTrackingOnConnectOnly: true,
      enableWalletConnectV1: false,
      enableWalletConnectV2: true,
      persistWalletSession: true,
      enableSessionRestoration: true,
      enableAuthProviders: true,
      enablePasskeys: false,
      evmWallets: {
        options: {
          emailAuth: {
            signInWithEmail: true,
            autoVerify: true,
            autoClose: true,
            onComplete: (args) => {
              console.log("[Dynamic SDK] Email Auth Complete:", args);
              toast({
                title: "Email Authentication Complete",
                description: "You can now proceed with the token purchase.",
              });
            },
            onError: (error) => {
              console.error("[Dynamic SDK] Email verification error:", error);
              toast({
                title: "Verification Error",
                description: "There was an error verifying your email. Please try again.",
                variant: "destructive",
              });
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
      <PurchaseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/governance-voting" element={<GovernanceVoting />} />
            <Route path="/mint-nft" element={<MintNFT />} />
            <Route path="/share-to-earn" element={<ShareToEarn />} />
            <Route path="/litepaper" element={<Litepaper />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:category/:slug" element={<KnowledgeArticle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
        <Analytics />
      </PurchaseProvider>
    </DynamicContextProvider>
  );
}

export default App;
