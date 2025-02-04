
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GovernanceVoting from "./pages/GovernanceVoting";
import MintNFT from "./pages/MintNFT";

function App() {
  const dynamicSettings = {
    environmentId: "4cb31233-ced0-4d1c-a0d8-5957bfb35925", // Your Dynamic environment ID
    walletConnectors: [EthereumWalletConnectors],
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
