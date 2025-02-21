import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { Analytics } from '@vercel/analytics/react';
import Nav from "./components/Nav";
import { ScrollToTop } from "./components/ScrollToTop";
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
import ThesisSubmission from "./pages/ThesisSubmission";
import ProposalDetails from "./pages/ProposalDetails";
import Proposals from "./pages/Proposals";
import { Toaster } from "./components/ui/toaster";

const FACTORY_ADDRESS = "0x4b729792-4b38-4d73-8a69-4f7559f2c2cd";

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
  environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
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
    environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
    appName: "LedgerFund",
    appLogoUrl: "/favicon.ico",
    onramp: {
      providers: ['banxa']
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
      "id-preview--20de67db-692b-43bc-8918-dfa81ea94ccd.lovable.app",
      "app.dynamicauth.com",
      "localhost"
    ],
    tokens: [
      {
        address: "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00",
        symbol: "LGR",
        decimals: 18,
        name: "LedgerFund Token",
        icon: "/favicon.ico",
        chainId: 137
      },
      {
        address: FACTORY_ADDRESS,
        symbol: "LFP",
        name: "LedgerFren Proposal",
        icon: "/favicon.ico",
        chainId: 137,
        type: "ERC721",
        standard: "ERC721",
        decimals: 0
      }
    ]
  }
};

function Layout() {
  return (
    <>
      <Nav />
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
    <DynamicContextProvider settings={dynamicSettings}>
      <Router>
        <ScrollToTop />
        <Layout />
      </Router>
      <Toaster />
      <Analytics />
    </DynamicContextProvider>
  );
}

export default App;
