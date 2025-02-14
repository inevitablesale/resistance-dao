
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DynamicContextProvider, useTokenBalances } from "@dynamic-labs/sdk-react-core";
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

function Layout() {
  const { toast } = useToast();
  const { tokenBalances, isLoading, error } = useTokenBalances();

  // Log token balances when they change
  React.useEffect(() => {
    if (tokenBalances && !isLoading && !error) {
      console.log("Token balances updated:", tokenBalances);
      // Find LGR token balance
      const lgrToken = tokenBalances.find(token => 
        token.address?.toLowerCase() === "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00".toLowerCase()
      );
      if (lgrToken) {
        toast({
          title: "LGR Balance Updated",
          description: `Your LGR balance: ${lgrToken.balance || '0'} LGR`,
        });
      }
    }
  }, [tokenBalances, isLoading, error, toast]);
  
  return (
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
  );
}

function App() {
  const { toast } = useToast();
  
  const zeroDevConfig = {
    projectId: "4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
  };

  const customTokenFilter = (tokens: any[]) => {
    const maticToken = tokens.find(token => token.symbol === 'MATIC' && token.chainId === 137);
    const lgrToken = {
      address: "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00",
      symbol: "LGR",
      decimals: 18,
      name: "LedgerFund Token",
      icon: "/favicon.ico",
      chainId: 137
    };
    
    return maticToken ? [maticToken, lgrToken] : [lgrToken];
  };

  const dynamicSettings = {
    environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
    walletConnectors: [
      EthereumWalletConnectors,
      ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
    ],
    tokenFilter: customTokenFilter,
    eventsCallbacks: {
      onAuthSuccess: (args: any) => {
        console.log("[Dynamic SDK] Auth Success:", args);
        toast({
          title: "Successfully Connected",
          description: `Connected ${args?.wallet?.connector?.name || 'wallet'} (${args?.wallet?.address?.slice(0, 6)}...${args?.wallet?.address?.slice(-4)})`,
        });
      },
      onEmailVerificationSuccess: () => {
        console.log("[Dynamic SDK] Email verification succeeded");
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        });
      },
      onLogout: () => {
        console.log("[Dynamic SDK] User logged out");
        toast({
          title: "Logged Out",
          description: "You've been successfully logged out.",
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
      onramp: {
        providers: ['banxa'],
        defaultProvider: 'banxa',
        defaultFiatAmount: 100,
        defaultNetwork: {
          chainId: 137
        }
      },
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
      // Email authentication settings
      evmWallets: {
        options: {
          emailAuth: {
            signInWithEmail: true,
            autoVerify: true,
            autoClose: true
          }
        }
      },
      style: {
        theme: "dark",
        displaySiweStatement: false
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
        <Layout />
      </Router>
      <Toaster />
      <Analytics />
    </DynamicContextProvider>
  );
}

export default App;
