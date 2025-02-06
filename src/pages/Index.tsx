
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Nav from "@/components/Nav";
import { InvestmentReadiness } from "@/components/InvestmentReadiness";
import { WhatWeBuilding } from "@/components/WhatWeBuilding";
import { PrivateEquityImpact } from "@/components/PrivateEquityImpact";
import { ReclaimControl } from "@/components/ReclaimControl";
import { HowItWorks } from "@/components/HowItWorks";
import { AlternativeToEquity } from "@/components/AlternativeToEquity";
import { SystemWeDeserve } from "@/components/SystemWeDeserve";
import { CallToAction } from "@/components/CallToAction";
import { Roadmap } from "@/components/Roadmap";
import { useNavigate } from "react-router-dom";
import { WalletInfo } from "@/components/WalletInfo";
import { useEffect, useRef, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { checkNFTOwnership } from "@/services/contractService";
import { Trophy, UserCircle, Building2, FileText } from "lucide-react";

const IndexContent = () => {
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const scrollPercentage = Math.max(0, Math.min(1, 1 - (rect.bottom / window.innerHeight)));
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!primaryWallet) {
        toast({
          title: "Welcome to LedgerFund",
          description: "Connect your wallet to participate in the token presale"
        });
        return;
      }

      const isConnected = await primaryWallet.isConnected();
      if (!isConnected) {
        toast({
          title: "Wallet Connection Required",
          description: "Please connect your wallet to access the platform"
        });
        return;
      }

      // Check NFT ownership using contract
      setIsChecking(true);
      try {
        console.log('Checking NFT ownership...');
        const hasNFT = await checkNFTOwnership(
          await primaryWallet.getWalletClient(),
          primaryWallet.address
        );
        console.log('NFT ownership result:', hasNFT);
        
        if (!hasNFT) {
          toast({
            title: "NFT Required",
            description: "Mint your LedgerFren NFT to participate in governance"
          });
        }
      } catch (error) {
        console.error('Error checking NFT:', error);
        toast({
          title: "Error",
          description: "Failed to check NFT ownership. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkWalletStatus();
  }, [primaryWallet, toast]);

  const parallaxStyle = {
    '--scroll-progress': scrollProgress,
    transform: `scale(${1 + scrollProgress * 0.5})`,
    opacity: 1 - scrollProgress * 0.6
  } as React.CSSProperties;

  return (
    <>
      <div 
        ref={heroRef} 
        className="text-center mb-8 max-w-6xl mx-auto pt-32 relative z-10 min-h-[120vh] flex flex-col items-center justify-start"
      >
        {/* Background Layer (Slowest) */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 animate-parallax-slow"
            style={{
              background: `
                radial-gradient(2px 2px at 20% 20%, rgba(147, 197, 253, 0.95) 100%, transparent),
                radial-gradient(2px 2px at 40% 40%, rgba(147, 197, 253, 0.92) 100%, transparent),
                radial-gradient(3px 3px at 60% 60%, rgba(147, 197, 253, 0.90) 100%, transparent)
              `,
              backgroundSize: "240px 240px",
              opacity: 0.85 - scrollProgress * 0.3
            }}
          />
        </div>

        {/* Middle Layer with Floating Firms */}
        <div className="fixed inset-0 z-1">
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
              transform: `scale(${1 + scrollProgress * 0.3})`
            }}
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-orbit"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * -2}s`,
                  transform: `rotate(${i * 30}deg) translateX(${150 + scrollProgress * 100}px)`,
                }}
              >
                <Building2 
                  className="w-8 h-8 text-blue-300/90" 
                  style={{ transform: `rotate(-${i * 30}deg)` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Black Hole Effect Container */}
        <div 
          className="fixed inset-0 z-2 perspective-3000" 
          style={{
            ...parallaxStyle,
            transform: `scale(${1 + scrollProgress * 1.5})`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-[800px] h-[800px] relative"
              style={{
                transform: `translateZ(${scrollProgress * 200}px)`
              }}
            >
              {/* Singularity Core */}
              <div 
                className="absolute inset-0 rounded-full bg-black animate-singularity" 
                style={{
                  boxShadow: `
                    0 0 ${100 + scrollProgress * 100}px ${20 + scrollProgress * 30}px rgba(59, 130, 246, 0.4),
                    0 0 ${200 + scrollProgress * 200}px ${40 + scrollProgress * 60}px rgba(96, 165, 250, 0.3),
                    0 0 ${300 + scrollProgress * 300}px ${60 + scrollProgress * 90}px rgba(147, 197, 253, 0.2)
                  `,
                  transform: `scale(${1 + scrollProgress * 0.8})`
                }}
              />
              
              {/* Accretion Disk - Shimmering Effect */}
              <div 
                className="absolute inset-0 rounded-full animate-cosmic-pulse"
                style={{
                  background: `
                    radial-gradient(circle at center,
                      rgba(0, 0, 0, 1) 0%,
                      rgba(59, 130, 246, ${0.7 + scrollProgress * 0.3}) 30%,
                      rgba(96, 165, 250, ${0.5 + scrollProgress * 0.3}) 50%,
                      rgba(147, 197, 253, ${0.4 + scrollProgress * 0.2}) 70%,
                      transparent 90%
                    )
                  `,
                  transform: `scale(${1 + scrollProgress * 1.2}) rotate(${scrollProgress * 180}deg)`
                }}
              />
              
              {/* Event Horizon - Enhanced Shimmer */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at center,
                      rgba(0, 0, 0, 0.9) 0%,
                      rgba(59, 130, 246, ${0.3 + scrollProgress * 0.2}) 40%,
                      rgba(96, 165, 250, ${0.2 + scrollProgress * 0.2}) 60%,
                      rgba(147, 197, 253, ${0.15 + scrollProgress * 0.15}) 80%,
                      transparent 90%
                    )
                  `,
                  border: '2px solid rgba(147, 197, 253, 0.5)',
                  transform: `scale(${1 + scrollProgress * 1.5})`,
                  animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Layer */}
        <div 
          className="relative z-3 mt-[30vh]" 
          style={{
            ...parallaxStyle,
            transform: `scale(${1 - scrollProgress * 0.3}) translateY(${scrollProgress * -50}px)`
          }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Own the future of<br />accounting
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            LedgerFund is building a decentralized network of accounting firms owned and governed by accountants. 
            We're putting the future of the profession back in the hands of professionals.
          </p>

          <div className="mb-16">
            <p className="text-sm uppercase tracking-wider text-blue-300 mb-6 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
              Explore applications powered by LedgerFund Protocol
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/mint-nft')}
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-cyan-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <Trophy className="w-5 h-5" />
                  <span>Earn Rewards with Quests</span>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/token-presale')}
                className="group relative px-8 py-3 bg-black/50 hover:bg-black/60 border border-blue-500/40 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-sm group-hover:blur-lg transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <UserCircle className="w-5 h-5" />
                  <span>Mint Your LedgerFren NFT</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black/80 backdrop-blur-sm">
        <InvestmentReadiness />
        <WhatWeBuilding />
        <PrivateEquityImpact />
        <ReclaimControl />
        <HowItWorks />
        <AlternativeToEquity />
        <SystemWeDeserve />
        <CallToAction />
        <Roadmap />
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
            background: "radial-gradient(circle at center, #3b82f6 0%, #0F0628 100%)",
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
