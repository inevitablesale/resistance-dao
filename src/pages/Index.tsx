
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
import { Trophy, UserCircle, Building2, Star } from "lucide-react";

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
        {/* Background Layer with Stars */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(1px 1px at 40px 60px, #D6BCFA 100%, transparent),
                radial-gradient(1px 1px at 20% 50%, #9b87f5 100%, transparent),
                radial-gradient(1.5px 1.5px at 30% 40%, #7E69AB 100%, transparent),
                radial-gradient(1.2px 1.2px at 50% 60%, #8B5CF6 100%, transparent),
                radial-gradient(1px 1px at 60% 50%, #D6BCFA 100%, transparent),
                radial-gradient(1.5px 1.5px at 70% 30%, #9b87f5 100%, transparent),
                radial-gradient(2px 2px at 80% 40%, #7E69AB 100%, transparent),
                radial-gradient(1.2px 1.2px at 90% 60%, #8B5CF6 100%, transparent)
              `,
              backgroundSize: "550px 550px",
              opacity: 0.6
            }}
          />
        </div>

        {/* Middle Layer with Floating Firms */}
        <div className="fixed inset-0 z-1">
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5)
            }}
          >
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: "50%",
                  top: `${-20 + (i * 10)}%`,
                  transform: `translateX(-50%) translateY(${scrollProgress * 100}vh) rotate(${i * 15}deg)`,
                  transition: "transform 0.3s ease-out",
                  animation: `float-${i} ${10 + i}s infinite`
                }}
              >
                <Building2 
                  className="w-8 h-8 text-purple-400/90 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" 
                  style={{
                    transform: `rotate(${-i * 15}deg)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Black Hole Effect */}
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
                className="absolute inset-0 rounded-full bg-[#120338] animate-singularity" 
                style={{
                  boxShadow: `
                    0 0 ${100 + scrollProgress * 100}px ${20 + scrollProgress * 30}px rgba(147, 51, 234, 0.5),
                    0 0 ${200 + scrollProgress * 200}px ${40 + scrollProgress * 60}px rgba(168, 85, 247, 0.4),
                    0 0 ${300 + scrollProgress * 300}px ${60 + scrollProgress * 90}px rgba(192, 132, 252, 0.3)
                  `,
                  transform: `scale(${1 + scrollProgress * 0.8})`
                }}
              />
              
              {/* Accretion Disk */}
              <div 
                className="absolute inset-0 rounded-full animate-cosmic-pulse"
                style={{
                  background: `
                    radial-gradient(circle at center,
                      rgba(147, 51, 234, ${0.7 + scrollProgress * 0.3}) 0%,
                      rgba(168, 85, 247, ${0.5 + scrollProgress * 0.3}) 30%,
                      rgba(192, 132, 252, ${0.4 + scrollProgress * 0.2}) 60%,
                      transparent 80%
                    )
                  `,
                  transform: `scale(${1 + scrollProgress * 1.2}) rotate(${scrollProgress * 180}deg)`
                }}
              />
              
              {/* Event Horizon */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at center,
                      rgba(255, 255, 255, ${0.2 + scrollProgress * 0.2}) 0%,
                      transparent 70%
                    )
                  `,
                  border: '2px solid rgba(168, 85, 247, 0.5)',
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
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Own the future of<br />accounting
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            LedgerFund is building a decentralized network of accounting firms owned and governed by accountants. 
            We're putting the future of the profession back in the hands of professionals.
          </p>

          <div className="mb-16">
            <p className="text-sm uppercase tracking-wider text-purple-300 mb-6 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
              Explore applications powered by LedgerFund Protocol
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/mint-nft')}
                className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/70 to-indigo-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <Trophy className="w-5 h-5" />
                  <span>Earn Rewards with Quests</span>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/token-presale')}
                className="group relative px-8 py-3 bg-black/50 hover:bg-black/60 border border-purple-500/40 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-400/20 blur-sm group-hover:blur-lg transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <UserCircle className="w-5 h-5" />
                  <span>Mint Your LedgerFren NFT</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black/95 backdrop-blur-sm">
        {/* Section Background with Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-purple-200/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${0.5 + Math.random() * 0.5})`,
                animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`
              }}
            />
          ))}
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
            background: "radial-gradient(circle at center, #2D1B69 0%, #0F0628 100%)",
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
