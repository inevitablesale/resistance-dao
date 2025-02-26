
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { AccessCoverOverlay } from "@/components/AccessCoverOverlay";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitPullRequest } from "lucide-react";
import WhatWeBuilding from "@/components/WhatWeBuilding";
import HowItWorks from "@/components/HowItWorks";
import Partners from "@/components/Partners";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";
import AlternativeToEquity from "@/components/AlternativeToEquity";
import SystemWeDeserve from "@/components/SystemWeDeserve";
import ReclaimControl from "@/components/ReclaimControl";
import LedgerFrens from "@/components/LedgerFrens";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";

const Index = () => {
  const navigate = useNavigate();
  const { isConnected } = useCustomWallet();

  return (
    <div className="relative">
      <AccessCoverOverlay />

      {/* Only show wallet widget when connected */}
      {isConnected && <ResistanceWalletWidget />}
      
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                Launch your project with aligned supporters
              </h1>
              <p className="text-lg md:text-xl text-blue-200/80 max-w-xl">
                Connect with investors who care about your vision. We make it easy to raise capital and build a community around your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate("/thesis")}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-8 py-6 text-lg"
                >
                  Start Proposal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => navigate("/proposals")}
                  variant="outline"
                  size="lg"
                  className="border-blue-500/20 hover:bg-blue-500/10 text-blue-300"
                >
                  <GitPullRequest className="mr-2 h-5 w-5" />
                  View Proposals
                </Button>
              </div>
            </div>
            <div className="lg:block">
              <img
                src="/lovable-uploads/1550ce0e-9ba3-4f80-835e-41fc832dec02.png"
                alt="Resistance DAO Member NFT"
                className="w-full max-w-lg mx-auto rounded-2xl"
              />
            </div>
          </div>
        </div>

        <WhatWeBuilding />
        <HowItWorks />
        <Partners />
        <AlternativeToEquity />
        <SystemWeDeserve />
        <ReclaimControl />
        <LedgerFrens />
        <FAQ />
        <CallToAction />
      </div>
    </div>
  );
};

export default Index;
