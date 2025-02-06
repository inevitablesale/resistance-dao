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
  const [isReclaimVisible, setIsReclaimVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const reclaimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsReclaimVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (reclaimRef.current) {
      observer.observe(reclaimRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const generateFirmIcons = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      delay: `${Math.random() * 2}s`,
      position: Math.random() * 100
    }));
  };

  const firms = generateFirmIcons(12);

  const parallaxStyle = {
    '--scroll-progress': scrollProgress,
    transform: `scale(${1 + scrollProgress * 0.2})`,
    opacity: 1 - scrollProgress * 0.5
  } as React.CSSProperties;

  return (
    <>
      <div ref={heroRef} className="text-center mb-8 max-w-6xl mx-auto pt-32 relative z-10 overflow-hidden min-h-screen">
        {/* Fixed Black Hole at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 h-[40vh] z-20 pointer-events-none">
          <div 
            className={`absolute inset-0 transition-colors duration-1000 ${
              isReclaimVisible 
                ? 'bg-gradient-to-t from-orange-500/30 via-blue-400/20 to-transparent'
                : 'bg-gradient-to-t from-purple-900/30 via-purple-800/20 to-transparent'
            }`}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]">
            {/* Event Horizon */}
            <div 
              className={`absolute bottom-0 left-0 right-0 h-32 rounded-t-full animate-black-hole-pulse transition-colors duration-1000 ${
                isReclaimVisible
                  ? 'bg-gradient-to-t from-orange-500 via-blue-400 to-transparent'
                  : 'bg-gradient-to-t from-purple-900 via-purple-800 to-transparent'
              }`}
            />
            {/* Gravitational Waves */}
            <div className="absolute bottom-0 left-0 right-0 h-64 flex flex-col justify-end gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-[2px] w-full animate-gravity-wave opacity-30 transition-colors duration-1000 ${
                    isReclaimVisible ? 'bg-orange-400' : 'bg-purple-600'
                  }`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Falling/Rising Firms */}
        {firms.map(firm => (
          <div
            key={firm.id}
            className={`fixed top-0 left-[${firm.position}%] z-10 ${
              isReclaimVisible ? 'animate-eject-and-rise' : 'animate-fall-and-spiral'
            }`}
            style={{ 
              animationDelay: firm.delay,
              animationPlayState: scrollProgress > 0 ? 'running' : 'paused'
            }}
          >
            <Building2 
              className={`w-8 h-8 transition-colors duration-1000 ${
                isReclaimVisible ? 'text-orange-400' : 'text-purple-400'
              }`}
            />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-30">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-blue-400 animate-gradient">
            Own the future of<br />accounting
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            LedgerFund is building a decentralized network of accounting firms owned and governed by accountants. 
            We're putting the future of the profession back in the hands of professionals.
          </p>

          <div className="mb-16">
            <p className="text-sm uppercase tracking-wider text-orange-300 mb-6">
              Explore applications powered by LedgerFund Protocol
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/mint-nft')}
                className="group relative px-8 py-3 bg-gradient-to-r from-orange-600 to-blue-400 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/50 to-blue-400/50 blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <Trophy className="w-5 h-5" />
                  <span>Earn Rewards with Quests</span>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/token-presale')}
                className="group relative px-8 py-3 bg-black/30 hover:bg-black/40 border border-orange-500/30 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-300/10 blur-sm group-hover:blur-lg transition-all duration-300" />
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
      <div ref={reclaimRef}>
        <ReclaimControl />
      </div>
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
