
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
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
import { useCallback } from "react";

function App() {
  const { toast } = useToast();
  
  const zeroDevConfig = {
    projectId: "4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
  };

  // Simple handler for email verification completion
  const handleEmailVerificationComplete = useCallback((args: any) => {
    console.log("[Dynamic SDK] Email verification flow complete with args:", args);
    toast({
      title: "Email Verified",
      description: "Your email has been successfully verified.",
    });
  }, [toast]);

  const dynamicSettings = {
    environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
    walletConnectorOptions: {
      zeroDevOptions: zeroDevConfig,
      viewTypes: ['deposit', 'send'],
      onramp: {
        providers: ['banxa'],
        defaultProvider: 'banxa',
        defaultFiatAmount: 100,
        defaultNetwork: {
          chainId: 137
        }
      }
    },
    walletConnectors: [
      EthereumWalletConnectors,
      ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
    ],
    events: {
      authFlowOpen: () => {
        console.log("[Dynamic SDK] Auth flow opened");
      },
      authFlowClose: () => {
        console.log("[Dynamic SDK] Auth flow closed");
      },
      authFailure: (reason) => {
        console.error("[Dynamic SDK] Auth failure:", reason);
        toast({
          title: "Authentication Failed",
          description: "There was an error connecting your wallet.",
          variant: "destructive"
        });
      },
      authSuccess: (args) => {
        console.log("[Dynamic SDK] Auth Success:", args);
        toast({
          title: "Successfully Connected",
          description: `Connected ${args?.wallet?.connector?.name || 'wallet'} (${args?.wallet?.address?.slice(0, 6)}...${args?.wallet?.address?.slice(-4)})`,
        });
      },
      emailVerificationStarted: () => {
        console.log("[Dynamic SDK] Email verification started");
      },
      emailVerificationCompleted: handleEmailVerificationComplete,
      emailVerificationSuccess: (args) => {
        console.log("[Dynamic SDK] Email verification succeeded:", args);
      },
      userCreated: (args) => {
        console.log("[Dynamic SDK] New user created:", args);
        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
        });
      },
      logout: () => {
        console.log("[Dynamic SDK] User logged out");
        toast({
          title: "Logged Out",
          description: "You've been successfully logged out.",
        });
      },
      userWalletsChanged: (params) => {
        console.log("[Dynamic SDK] User wallets changed:", params);
      },
      primaryWalletChanged: (newPrimaryWallet) => {
        console.log("[Dynamic SDK] Primary wallet changed:", newPrimaryWallet);
      }
    },
    settings: {
      network: {
        chainId: 137, // Polygon Mainnet
      },
      environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
      appName: "LedgerFund",
      appLogoUrl: "/favicon.ico",
      // Wallet settings
      enableEmbeddedWallets: true,
      enableVisitTrackingOnConnectOnly: true,
      enableWalletConnectV1: false,
      enableWalletConnectV2: true,
      // Session settings
      persistWalletSession: true,
      enableSessionRestoration: true,
      // Authentication settings
      enableAuthProviders: true,
      enablePasskeys: false,
      // Wallet connector settings
      walletConnectors: {
        enableDirectNavigation: true,
        views: {
          deposit: {
            enabled: true,
            defaultProvider: 'banxa'
          },
          send: {
            enabled: true
          }
        }
      },
      // Email authentication settings
      evmWallets: {
        options: {
          emailAuth: {
            signInWithEmail: true,
            autoVerify: true,
            autoClose: true,
            onComplete: handleEmailVerificationComplete
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
    </DynamicContextProvider>
  );
}

export default App;

