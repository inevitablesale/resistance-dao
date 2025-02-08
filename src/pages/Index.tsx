
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
import { HeroSection } from "@/components/hero/HeroSection";
import { PresaleSection } from "@/components/presale/PresaleSection";
import { useEffect, useRef, useState } from "react";

const IndexContent = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const presaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !presaleRef.current) return;
      
      const presaleRect = presaleRef.current.getBoundingClientRect();
      
      const presaleVisibility = Math.max(0, Math.min(1, 
        1 - (presaleRect.top / window.innerHeight)
      ));
      
      const scrollingUpAdjustment = Math.max(0, Math.min(1,
        1 - (Math.abs(presaleRect.bottom) / window.innerHeight)
      ));
      
      setScrollProgress(Math.min(presaleVisibility, scrollingUpAdjustment));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div ref={heroRef}>
        <HeroSection scrollProgress={scrollProgress} />
      </div>

      <div ref={presaleRef}>
        <PresaleSection />
      </div>

      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12">
            How to Buy $LGR
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create Your Wallet</h3>
              <p className="text-gray-300">
                Enter and confirm your email address to create a wallet. You can also sign in using your MetaMask wallet.
              </p>
            </div>

            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Load Wallet With Crypto</h3>
              <p className="text-gray-300">
                Add MATIC to your wallet to participate in the presale. You can buy MATIC directly or transfer from another wallet.
              </p>
            </div>

            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Buy and Stake $LGR</h3>
              <p className="text-gray-300">
                Purchase $LGR tokens at the presale price and stake them to earn rewards and participate in governance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-24">
          <WhatWeBuilding />
          <LedgerFrens />
          <HowItWorks />
          <AlternativeToEquity />
          <PrivateEquityImpact />
          <ReclaimControl />
          <SystemWeDeserve />
          <CallToAction />
          <Roadmap />
          <Partners />
        </div>
      </div>
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
            background: "radial-gradient(circle at center, #eab308 0%, #000000 100%)",
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
