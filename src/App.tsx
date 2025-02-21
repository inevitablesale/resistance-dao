import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Index from './pages/Index';
import Thesis from './pages/Thesis';
import Proposals from './pages/Proposals';
import ProposalDetails from './pages/ProposalDetails';
import EditProposal from './pages/EditProposal';
import CreateProposal from './pages/CreateProposal';
import BuyTokens from "./pages/BuyTokens";
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/thesis" element={<Thesis />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/proposals/:id" element={<ProposalDetails />} />
            <Route path="/proposals/:id/edit" element={<EditProposal />} />
            <Route path="/proposals/create" element={<CreateProposal />} />
            <Route path="/buy-tokens" element={<BuyTokens />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
