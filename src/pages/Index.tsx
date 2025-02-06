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
import { Trophy, UserCircle, Building2 } from "lucide-react";

const IndexContent = () => {
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const loadTime = Date.now();

  useEffect(() => {
    // Set loaded state after a small delay to trigger initial animations
    setTimeout(() => setIsLoaded(true), 100);
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
        {/* Background Layer */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 animate-parallax-slow"
            style={{
              background: `
                radial-gradient(2px 2px at 20% 20%, rgba(234, 179, 8, 0.95) 100%, transparent),
                radial-gradient(2px 2px at 40% 40%, rgba(234, 179, 8, 0.92) 100%, transparent),
                radial-gradient(3px 3px at 60% 60%, rgba(234, 179, 8, 0.90) 100%, transparent)
              `,
              backgroundSize: "240px 240px",
              opacity: Math.max(0.1, 0.85 - scrollProgress)
            }}
          />
        </div>

        {/* Middle Layer with Floating Firms */}
        <div className="fixed inset-0 z-1">
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
            }}
          >
            {[...Array(12)].map((_, i) => {
              // Calculate initial position on the edge of the viewport
              const viewportAngle = (i * (360 / 12)) * (Math.PI / 180);
              const viewportRadius = Math.max(window.innerWidth, window.innerHeight) * 0.8;
              const startX = Math.cos(viewportAngle) * viewportRadius;
              const startY = Math.sin(viewportAngle) * viewportRadius;

              // Unique orbit parameters for each firm
              const orbitSpeed = 1 + (i % 3) * 0.5;
              const orbitRadius = isLoaded 
                ? Math.max(150, viewportRadius * Math.pow(0.95, (Date.now() - loadTime) / 1000)) // Exponential decay
                : viewportRadius;
              const orbitPhase = i * (Math.PI / 6);
              const rotationSpeed = 0.5 + (i % 4) * 0.3;
              const wobbleAmplitude = 20 + (i % 3) * 10;
              const wobbleFrequency = 1 + (i % 2) * 0.5;

              const angle = (Date.now() / (1000 / orbitSpeed) + orbitPhase) % (Math.PI * 2);
              const finalRadius = 150 - (scrollProgress * 150);
              
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    transition: isLoaded ? 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    transform: scrollProgress > 0 
                      ? `translate(-50%, -50%) rotate(${angle * 180 / Math.PI + (scrollProgress * 720)}deg) translateX(${finalRadius}px)`
                      : `translate(calc(-50% + ${startX}px), calc(-50% + ${startY}px)) 
                         rotate(${angle * 180 / Math.PI * rotationSpeed}deg) 
                         translateX(${orbitRadius + Math.sin(Date.now() / (1000 * wobbleFrequency)) * wobbleAmplitude}px)`,
                  }}
                >
                  <Building2 
                    className={`w-8 h-8 text-teal-300/90 transition-all duration-1000`}
                    style={{ 
                      transform: `rotate(${-angle * 180 / Math.PI}deg) scale(${1 - scrollProgress * 0.5})`,
                      opacity: Math.max(0, 1 - scrollProgress * 2)
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Energy Vortex Effect */}
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
                transform: `translateZ(${scrollProgress * 200}px)`,
                transition: 'transform 0.5s ease-out'
              }}
            >
              {/* Core */}
              <div 
                className={`absolute inset-0 rounded-full bg-black transition-all duration-1000 ${isLoaded ? 'scale-100' : 'scale-0'}`}
                style={{
                  boxShadow: `
                    0 0 ${100 + scrollProgress * 200}px ${20 + scrollProgress * 40}px rgba(234, 179, 8, 0.4),
                    0 0 ${200 + scrollProgress * 400}px ${40 + scrollProgress * 80}px rgba(20, 184, 166, 0.3),
                    0 0 ${300 + scrollProgress * 600}px ${60 + scrollProgress * 120}px rgba(234, 179, 8, 0.2)
                  `,
                  transform: `scale(${0.2 + scrollProgress * 1.8})`,
                }}
              />
              
              {/* Energy Field */}
              <div 
                className={`absolute inset-0 rounded-full animate-cosmic-pulse transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  background: `
                    radial-gradient(circle at center,
                      rgba(0, 0, 0, 1) 0%,
                      rgba(234, 179, 8, ${0.3 + scrollProgress * 0.7}) 30%,
                      rgba(20, 184, 166, ${0.2 + scrollProgress * 0.6}) 50%,
                      rgba(234, 179, 8, ${0.1 + scrollProgress * 0.5}) 70%,
                      transparent 90%
                    )
                  `,
                  transform: `scale(${0.5 + scrollProgress * 1.5}) rotate(${scrollProgress * 360}deg)`,
                }}
              />
              
              {/* Outer Ring */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${isLoaded ? 'scale-100' : 'scale-0'}`}
                style={{
                  background: `
                    radial-gradient(circle at center,
                      rgba(0, 0, 0, 0.9) 0%,
                      rgba(234, 179, 8, ${0.1 + scrollProgress * 0.4}) 40%,
                      rgba(20, 184, 166, ${0.1 + scrollProgress * 0.3}) 60%,
                      rgba(234, 179, 8, ${0.05 + scrollProgress * 0.25}) 80%,
                      transparent 90%
                    )
                  `,
                  border: '2px solid rgba(234, 179, 8, 0.5)',
                  transform: `scale(${0.8 + scrollProgress * 1.7})`,
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
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Own the future of<br />accounting
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            LedgerFund is building a decentralized network of accounting firms owned and governed by accountants. 
            We're putting the future of the profession back in the hands of professionals.
          </p>

          <div className="mb-16">
            <p className="text-sm uppercase tracking-wider text-teal-300 mb-6 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
              Explore applications powered by LedgerFund Protocol
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a 
                href="#join-our-vision"
                className="group relative px-8 py-3 bg-gradient-to-r from-yellow-600 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <Trophy className="w-5 h-5" />
                  <span>Purchase LGR Tokens</span>
                </div>
              </a>
              
              <button 
                onClick={() => navigate('/mint-nft')}
                className="group relative px-8 py-3 bg-black/50 hover:bg-black/60 border border-yellow-500/40 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-400/20 blur-sm group-hover:blur-lg transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                  <UserCircle className="w-5 h-5" />
                  <span>Mint Your LedgerFren NFT</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm">
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
