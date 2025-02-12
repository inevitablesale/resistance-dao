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
import GettingStarted from "./pages/GettingStarted";
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
    settings: {
      network: {
        chainId: 137,
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
      displayNetworkName: false, // This hides the network name in the header
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
            }
          }
        }
      },
      style: {
        buttonClassName: "dynamic-button",
        theme: "dark",
        displaySiweStatement: false,
        buttonText: {
          connectWallet: "Connect Wallet",
          disconnect: "Disconnect",
          signIn: "Connect Wallet",
          signUp: "Connect Wallet",
          connected: "Connected",
          connecting: "Connecting...",
          viewAccount: "View Account",
          loggedOut: "Connect Wallet"
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
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:category/:slug" element={<KnowledgeArticle />} />
            <Route path="/content" element={<ContentHub />} />
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
