
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
import { Loader2, ArrowRight, CreditCard, PieChart, Users, Building2, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TokenPurchaseForm } from "@/components/TokenPurchaseForm";

const IndexContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  const handleGetStarted = () => {
    navigate('/getting-started');
  };

  const handleInvestNow = () => {
    setShowPurchaseForm(true);
  };

  return (
    <>
      <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-tight">
          Invest in the Future of<br />Accounting Practice Ownership
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Join our $500,000 funding round to revolutionize accounting firm acquisitions. Secure your tokens starting at just $100.
        </p>

        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4 mb-12">
          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left">
            <DollarSign className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">$100 Minimum</h3>
            <p className="text-gray-300">
              Low entry barrier for all accountants to participate
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left">
            <CreditCard className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Easy Payment</h3>
            <p className="text-gray-300">
              Buy with credit card or bank transfer
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left">
            <PieChart className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Revenue Share</h3>
            <p className="text-gray-300">
              Earn from practice acquisitions
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left">
            <Users className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Governance</h3>
            <p className="text-gray-300">
              Vote on key investment decisions
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Button
            onClick={handleInvestNow}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-xl text-lg font-semibold"
          >
            Invest Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm text-gray-400">
            Token Price: $0.10 USD • Total Supply: 5,000,000 LGR
          </p>
        </div>

        {showPurchaseForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Purchase Tokens</h3>
                <button 
                  onClick={() => setShowPurchaseForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <TokenPurchaseForm />
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Use of Funds
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                70%
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Practice Acquisitions</h3>
              <p className="text-gray-300">
                Direct investment into accounting practice acquisitions and growth capital.
              </p>
            </div>

            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                20%
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Operations</h3>
              <p className="text-gray-300">
                Platform development, legal compliance, and professional services.
              </p>
            </div>

            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                10%
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Reserve</h3>
              <p className="text-gray-300">
                Strategic reserve for future opportunities and market stabilization.
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
                Investment Benefits
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join hundreds of accountants already participating in the future of practice ownership.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">For Investors</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>✓ Low minimum investment ($100)</li>
                  <li>✓ Revenue share from acquisitions</li>
                  <li>✓ Voting rights on key decisions</li>
                  <li>✓ Early access to new features</li>
                </ul>
              </Card>

              <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">For Practice Owners</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>✓ Access to acquisition capital</li>
                  <li>✓ Professional network support</li>
                  <li>✓ Simplified exit planning</li>
                  <li>✓ Technology resources</li>
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
