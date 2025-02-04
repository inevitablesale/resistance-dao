
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
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
    environmentId: "2b74d425-6827-4ff1-af57-f9543d71cca0",
    walletConnectors: [
      EthereumWalletConnectors,
      ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
    ],
    eventsCallbacks: {
      onVerificationComplete: () => {
        toast({
          title: "Verification Complete",
          description: "Your account has been verified successfully.",
        });
      },
      onAuthSuccess: (args: any) => {
        toast({
          title: "Authentication Successful",
          description: "You're now connected to LedgerFund. Checking NFT ownership...",
        });
      },
      onLogout: () => {
        toast({
          title: "Logged Out",
          description: "You've been successfully logged out.",
        });
      },
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
