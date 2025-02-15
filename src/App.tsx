
import React from 'react';
import { Routes, Route } from "react-router-dom";
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
import ThesisSubmission from "./pages/ThesisSubmission";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

function Layout() {
  const { toast } = useToast();

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
      <Route path="/submit-thesis" element={<ThesisSubmission />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const dynamicSettings = {
    environmentId: "2762a57b-faa3-4387-81bf-53c843813c29",
    walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectorsWithConfig],
  };

  return (
    <DynamicContextProvider settings={dynamicSettings}>
      <Layout />
      <Toaster />
      <Analytics />
    </DynamicContextProvider>
  );
}

export default App;
