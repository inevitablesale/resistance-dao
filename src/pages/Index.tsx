
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
    transform: `scale(${1 + scrollProgress * 0.2})`,
    opacity: 1 - scrollProgress * 0.3 // Reduced fade out rate
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
                radial-gradient(2px 2px at 20% 20%, rgba(255, 255, 255, 0.9) 100%, transparent),
                radial-gradient(2px 2px at 40% 40%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(3px 3px at 60% 60%, rgba(255, 255, 255, 0.7) 100%, transparent)
              `,
              backgroundSize: "240px 240px",
              opacity: 0.7
            }}
          />
        </div>

        {/* Middle Layer */}
        <div className="fixed inset-0 z-1">
          {/* Floating Firm Icons */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-orbit"
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${20 + i * 10}%`,
                  animationDelay: `${i * -3}s`,
                  transform: `rotate(${i * 60}deg) translateX(100px)`,
                }}
              >
                <Building2 
                  className="w-8 h-8 text-purple-400/50" 
                  style={{ transform: `rotate(-${i * 60}deg)` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Black Hole Effect Container */}
        <div className="fixed inset-0 z-2 perspective-3000" style={parallaxStyle}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[800px] relative">
              {/* Singularity Core */}
              <div 
                className="absolute inset-0 rounded-full bg-black animate-singularity" 
                style={{
                  boxShadow: `
                    0 0 100px 20px rgba(255, 69, 0, 0.4),
                    0 0 200px 40px rgba(255, 140, 0, 0.3),
                    0 0 300px 60px rgba(0, 0, 139, 0.2)
                  `
                }}
              />
              
              {/* Accretion Disk */}
              <div 
                className="absolute inset-0 rounded-full animate-cosmic-pulse"
                style={{
                  background: `
                    radial-gradient(circle at center,
                      rgba(255, 69, 0, 0.6) 0%,
                      rgba(255, 140, 0, 0.4) 30%,
                      rgba(0, 0, 139, 0.3) 60%,
                      transparent 80%
                    )
                  `
                }}
              />
              
              {/* Event Horizon */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at center,
                      rgba(255, 255, 255, 0.15) 0%,
                      transparent 70%
                    )
                  `,
                  border: '2px solid rgba(255, 140, 0, 0.4)',
                  animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-3 mt-[30vh]" style={parallaxStyle}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-blue-400 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            Own the future of<br />accounting
          </h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-12 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            LedgerFund is building a decentralized network of accounting firms owned and governed by accountants. 
            We're putting the future of the profession back in the hands of professionals.
          </p>

          <div className="mb-16">
            <p className="text-sm uppercase tracking-wider text-orange-300 mb-6 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              Explore applications powered by LedgerFund Protocol
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/mint-nft')}
                className="group relative px-8 py-3 bg-gradient-to-r from-orange-600 to-blue-400 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/70 to-blue-400/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <Trophy className="w-5 h-5" />
                  <span>Earn Rewards with Quests</span>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/token-presale')}
                className="group relative px-8 py-3 bg-black/50 hover:bg-black/60 border border-orange-500/40 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-300/20 blur-sm group-hover:blur-lg transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <UserCircle className="w-5 h-5" />
                  <span>Mint Your LedgerFren NFT</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <InvestmentReadiness />
      <WhatWeBuilding />
      <PrivateEquityImpact />
      <ReclaimControl />
      <HowItWorks />
      <AlternativeToEquity />
      <SystemWeDeserve />
      <CallToAction />
      <Roadmap />
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
            background: "radial-gradient(circle at center, #1a0b2e 0%, #000000 100%)",
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

