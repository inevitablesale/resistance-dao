
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { EvmNetworks } from "@dynamic-labs/ethereum";
import Index from "./pages/Index";
import Litepaper from "./pages/Litepaper";
import Marketplace from "./pages/Marketplace";
import ShareToEarn from "./pages/ShareToEarn";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeArticle from "./pages/KnowledgeArticle";
import ContentHub from "./pages/ContentHub";
import Proposals from "./pages/Proposals";
import ThesisSubmission from "./pages/ThesisSubmission";
import ProposalDetails from "./pages/ProposalDetails";
import MintNFT from "./pages/MintNFT";
import GettingStarted from "./pages/GettingStarted";
import GovernanceVoting from "./pages/GovernanceVoting";
import NotFound from "./pages/NotFound";
import Nav from "./components/Nav";
import ScrollToTop from "./components/ScrollToTop";

const evmNetworks = [EvmNetworks.POLYGON];

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "f0b977d0-b712-49f1-af89-2a24c47674da",
        walletConnectors: [EthereumWalletConnectors],
        evmNetworks
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <ScrollToTop />
          <Nav />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/litepaper" element={<Litepaper />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/share-to-earn" element={<ShareToEarn />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/knowledge-base/:articleId" element={<KnowledgeArticle />} />
            <Route path="/content-hub" element={<ContentHub />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/thesis" element={<ThesisSubmission />} />
            <Route path="/proposals/:id" element={<ProposalDetails />} />
            <Route path="/mint-nft" element={<MintNFT />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/governance-voting" element={<GovernanceVoting />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Analytics />
        </Router>
      </ThemeProvider>
    </DynamicContextProvider>
  );
}

export default App;
