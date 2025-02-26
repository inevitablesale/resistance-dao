import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { Analytics } from '@vercel/analytics/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Nav from "./components/Nav";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ThesisSubmission from "./pages/ThesisSubmission";
import ProposalDetails from "./pages/ProposalDetails";
import Proposals from "./pages/Proposals";
import { Toaster } from "./components/ui/toaster";
import { useLocation } from 'react-router-dom';
import { useCustomWallet } from './hooks/useCustomWallet';

const zeroDevConfig = {
  projectId: "4b729792-4b38-4d73-8a69-4f7559f2c2cd",
  bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
  paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
};

const evmNetworks = [
  {
    blockExplorerUrls: ['https://polygonscan.com/'],
    chainId: 137,
    chainName: 'Matic Mainnet',
    iconUrls: ["https://app.dynamic.xyz/assets/networks/polygon.svg"],
    name: 'Polygon',
    displayName: 'Polygon',
    nativeCurrency: {
      decimals: 18,
      name: 'MATIC',
      symbol: 'MATIC',
      iconUrl: 'https://app.dynamic.xyz/assets/networks/polygon.svg',
    },
    networkId: 137,
    rpcUrls: ['https://polygon-rpc.com'],
    vanityName: 'Polygon',
  }
];

const dynamicSettings = {
  environmentId: "ad4b2b5c-ffbd-47e7-b6e0-88c7f66580e5",
  walletConnectors: [
    EthereumWalletConnectors,
    ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
  ],
  eventsCallbacks: {
    onAuthSuccess: (args: any) => {
      console.log("[Dynamic SDK] Auth Success:", args);
    },
    onEmailVerificationSuccess: () => {
      console.log("[Dynamic SDK] Email verification succeeded");
    },
    onLogout: () => {
      console.log("[Dynamic SDK] User logged out");
    },
    onSessionConnect: () => {
      console.log("[Dynamic SDK] Session connected");
    },
    onSessionRestore: () => {
      console.log("[Dynamic SDK] Session restored");
    }
  },
  settings: {
    evmNetworks,
    network: evmNetworks[0],
    environmentId: "ad4b2b5c-ffbd-47e7-b6e0-88c7f66580e5",
    appName: "Resistance",
    appLogoUrl: "/favicon.ico",
    onramp: {
      providers: ['banxa'],
      defaultFiatCurrency: 'USD',
      banxaConfig: {
        environment: 'PRODUCTION'
      }
    },
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
          autoClose: true
        }
      }
    },
    style: {
      theme: "dark",
      displaySiweStatement: false
    },
    shadowDOMEnabled: false,
    allowedDomains: [
      "resistancedao.xyz",
      "app.dynamicauth.com",
      "localhost"
    ],
    tokens: [
      {
        address: "0x81137573408bCD23f801A56D68268cc0CE5206B5",
        symbol: "RDT",
        decimals: 18,
        name: "Resistance Token",
        icon: "/favicon.ico",
        chainId: 137
      },
      {
        address: "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C",
        symbol: "RDM",
        name: "Resistance DAO Member",
        icon: "/favicon.ico",
        chainId: 137,
        type: "ERC721",
        standard: "ERC721",
        decimals: 0
      },
      {
        address: "0x3522fCA64A8F79b004fDbd9a383B56113B81130B",
        symbol: "RDP",
        name: "Resistance DAO Proposal",
        icon: "/favicon.ico",
        chainId: 137,
        type: "ERC721",
        standard: "ERC721",
        decimals: 0
      }
    ]
  }
};

const queryClient = new QueryClient();

function Layout() {
  const location = useLocation();
  const { isConnected } = useCustomWallet();
  const isIndexPage = location.pathname === '/';
  
  const showNav = !isIndexPage || isConnected;

  return (
    <>
      {showNav && <Nav />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/thesis" element={<ThesisSubmission />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/proposals/:tokenId" element={<ProposalDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicContextProvider settings={dynamicSettings}>
        <Router>
          <ScrollToTop />
          <Layout />
        </Router>
        <Toaster />
        <Analytics />
      </DynamicContextProvider>
    </QueryClientProvider>
  );
}

export default App;
