
import { useState } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Nav from "@/components/Nav";
import { WhatWeBuilding } from "@/components/WhatWeBuilding";
import { PrivateEquityImpact } from "@/components/PrivateEquityImpact";
import { ReclaimControl } from "@/components/ReclaimControl";
import { HowItWorks } from "@/components/HowItWorks";
import { AlternativeToEquity } from "@/components/AlternativeToEquity";
import { SystemWeDeserve } from "@/components/SystemWeDeserve";
import { CallToAction } from "@/components/CallToAction";
import { Roadmap } from "@/components/Roadmap";
import { LedgerFrens } from "@/components/LedgerFrens";
import { Partners } from "@/components/Partners";
import { FAQ } from "@/components/FAQ";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";

const IndexContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGetStarted = () => {
    navigate('/getting-started');
  };

  return (
    <>
      <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-tight">
          The Future of<br />Accounting Practice Ownership
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Join a community of accountants building the next generation of firm ownership. Together, we're making practice acquisition accessible to everyone.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Easy Entry</h3>
            <p className="text-gray-300">
              Start with as little as $100. No complex crypto knowledge required.
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Simple Process</h3>
            <p className="text-gray-300">
              Use your credit card or bank transfer. We handle all the technical details.
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Real Benefits</h3>
            <p className="text-gray-300">
              Earn from practice acquisitions and participate in key decisions.
            </p>
          </Card>
        </div>

        <div className="mt-12 space-y-6">
          <Button
            onClick={handleGetStarted}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-xl text-lg font-semibold"
          >
            New to This? Start Here
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-400">Already familiar with digital assets?</p>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/mint-nft')}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                Mint Your NFT
              </Button>
              <Button
                onClick={() => navigate('/governance-voting')}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                Join Governance
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create Your Account</h3>
              <p className="text-gray-300">
                Sign up with your email and verify your identity. No complex wallet setup needed.
              </p>
            </div>

            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Choose Your Investment</h3>
              <p className="text-gray-300">
                Select your investment amount. Start with as little as $100 using your credit card.
              </p>
            </div>

            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Start Earning</h3>
              <p className="text-gray-300">
                Receive your ownership tokens and start earning from practice acquisitions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black/95">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join hundreds of accountants already participating in the future of practice ownership.
              </p>
              <Button
                onClick={handleGetStarted}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-xl text-lg font-semibold"
              >
                Learn How It Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">For Investors</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>✓ Low minimum investment</li>
                  <li>✓ Earn from practice acquisitions</li>
                  <li>✓ Vote on important decisions</li>
                  <li>✓ Simple digital ownership</li>
                </ul>
              </Card>

              <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">For Practice Owners</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>✓ Access to acquisition capital</li>
                  <li>✓ Community support</li>
                  <li>✓ Simplified exit planning</li>
                  <li>✓ Professional network</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <WhatWeBuilding />
      <LedgerFrens />
      <HowItWorks />
      <AlternativeToEquity />
      <PrivateEquityImpact />
      <ReclaimControl />
      <SystemWeDeserve />
      <CallToAction />
      <Roadmap />
      <FAQ />
      <Partners />
    </>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, #14b8a6 0%, #000000 100%)",
            opacity: 0.98
          }}
        />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 relative z-10">
        <IndexContent />
      </div>
    </div>
  );
};

export default Index;
