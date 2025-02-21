
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa';
import Nav from './components/Nav';
import Index from './pages/Index';
import Proposals from './pages/Proposals';
import ProposalDetails from './pages/ProposalDetails';
import BuyTokens from "./pages/BuyTokens";
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "2ace0996-5136-4c6c-a384-6f205ad7661c",
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
        walletConnectorOptions: {
          zeroDevOptions: {
            projectId: "2ace0996-5136-4c6c-a384-6f205ad7661c",
            bundlerRpc: "https://polygon.drpc.org",
            paymasterRpc: "https://polygon.drpc.org"
          }
        },
        network: {
          chainId: 137
        }
      }}
    >
      <Router>
        <div className="flex flex-col min-h-screen">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/proposals/:id" element={<ProposalDetails />} />
              <Route path="/buy-tokens" element={<BuyTokens />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </DynamicContextProvider>
  );
};

export default App;
