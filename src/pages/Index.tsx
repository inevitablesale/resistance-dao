
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
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-tight animate-fade-in">
          Own the Future of<br />Accounting Practices
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in animation-delay-200">
          Be part of our $500,000 investment round to build a better model for accounting practice succession. Minimum investment: $100.
        </p>

        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4 mb-12">
          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left animate-fade-in animation-delay-300 hover:scale-105 transition-transform duration-300">
            <DollarSign className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">$100 Minimum</h3>
            <p className="text-gray-300">
              Low entry barrier for all accountants to participate
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left animate-fade-in animation-delay-400 hover:scale-105 transition-transform duration-300">
            <CreditCard className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Easy Payment</h3>
            <p className="text-gray-300">
              Purchase securely with credit card
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left animate-fade-in animation-delay-500 hover:scale-105 transition-transform duration-300">
            <PieChart className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Revenue Share</h3>
            <p className="text-gray-300">
              Earn from practice acquisitions
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-left animate-fade-in animation-delay-600 hover:scale-105 transition-transform duration-300">
            <Users className="w-8 h-8 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Governance</h3>
            <p className="text-gray-300">
              Vote on key investment decisions
            </p>
          </Card>
        </div>

        <div className="space-y-6 animate-fade-in animation-delay-700">
          <Button
            onClick={handleInvestNow}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-xl text-lg font-semibold hover:scale-105 transition-all duration-300"
          >
            Invest Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm text-gray-400">
            Token Price: $0.10 USD • Total Supply: 5,000,000 LGR
          </p>
        </div>

        {showPurchaseForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
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
