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
import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { checkNFTOwnership } from "@/services/contractService";
import { Trophy, UserCircle } from "lucide-react";

const IndexContent = () => {
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [blackHoleState, setBlackHoleState] = useState('pe-dominance'); // 'pe-dominance' | 'transformation' | 'ledgerfund-future'

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPos(position);
      
      // Update black hole state based on scroll position
      const windowHeight = window.innerHeight;
      if (position < windowHeight * 0.3) {
        setBlackHoleState('pe-dominance');
      } else if (position < windowHeight * 0.6) {
        setBlackHoleState('transformation');
      } else {
        setBlackHoleState('ledgerfund-future');
      }
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

  return (
    <>
      <div className="text-center mb-8 max-w-6xl mx-auto pt-32 relative z-10 overflow-hidden min-h-[100vh]">
        {/* Enhanced Black Hole Container */}
        <div className="absolute inset-0 z-0 perspective-3000">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`w-[1200px] h-[1200px] relative transition-all duration-1000 ease-out ${
                blackHoleState === 'pe-dominance' ? 'scale-75' : 
                blackHoleState === 'transformation' ? 'scale-90' : 
                'scale-100'
              }`}
              style={{
                transform: `
                  translateY(${Math.min(scrollPos * 0.15, 150)}px) 
                  scale(${1 + scrollPos * 0.0005})
                `
              }}
            >
              {/* Black Hole Core */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  blackHoleState === 'pe-dominance' ? 'bg-black scale-100' :
                  blackHoleState === 'transformation' ? 'bg-purple-900/90 scale-90' :
                  'bg-purple-800/80 scale-75'
                }`}
                style={{
                  boxShadow: `
                    0 0 150px 30px rgba(255, 140, 0, 0.3),
                    0 0 300px 60px rgba(255, 69, 0, 0.2),
                    0 0 450px 90px rgba(255, 165, 0, 0.1)
                  `
                }}
              />
              
              {/* Light Beam */}
              <div
                className="absolute top-1/2 left-1/2 w-[400px] h-[800px] -translate-x-1/2 -translate-y-1/2 animate-light-beam"
                style={{
                  background: `
                    linear-gradient(
                      180deg,
                      rgba(255, 255, 255, 0.8) 0%,
                      rgba(255, 165, 0, 0.4) 50%,
                      transparent 100%
                    )
                  `,
                  transform: 'rotate(-45deg)'
                }}
              />
              
              {/* Accretion Disk */}
              <div 
                className="absolute inset-0 rounded-full animate-accretion-spin"
                style={{
                  background: `
                    conic-gradient(
                      from 0deg,
                      rgba(255, 69, 0, 0.8) 0%,
                      rgba(255, 140, 0, 0.6) 25%,
                      rgba(255, 165, 0, 0.4) 50%,
                      rgba(255, 69, 0, 0.8) 75%,
                      rgba(255, 140, 0, 0.6) 100%
                    )
                  `,
                  clipPath: 'ellipse(40% 15% at 50% 50%)',
                  transform: 'rotate(-15deg)'
                }}
              />
              
              {/* Matter Streams */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 animate-matter-stream"
                  style={{
                    background: `
                      radial-gradient(
                        ellipse at center,
                        rgba(255, 140, 0, 0.6) 0%,
                        rgba(255, 69, 0, 0.4) 50%,
                        transparent 100%
                      )
                    `,
                    transform: `rotate(${i * 45}deg)`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}

              {/* PE Takeover Text Fragments */}
              {blackHoleState === 'pe-dominance' && (
                <>
                  {['Layoffs', 'Short-Term Profits', 'Lost Trust'].map((text, index) => (
                    <div
                      key={text}
                      className="absolute text-orange-400/80 font-medium animate-spiral-in"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${index * 120}deg) translateX(${200 + scrollPos * 0.1}px)`,
                        animation: `spiral-in 10s infinite ${index * 2}s`
                      }}
                    >
                      {text}
                    </div>
                  ))}
                </>
              )}
              
              {/* Firm Icons being pulled in */}
              {blackHoleState === 'pe-dominance' && (
                <>
                  {['🏢', '🏦', '📊'].map((icon, index) => (
                    <div
                      key={icon}
                      className="absolute text-2xl animate-matter-stream"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${index * 120}deg) translateX(${300 + scrollPos * 0.2}px)`,
                        animationDelay: `${index * 1.5}s`
                      }}
                    >
                      {icon}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Star Field Background with Parallax */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(1px 1px at ${20 + scrollPos * 0.05}% ${20 + scrollPos * 0.02}%, rgba(255, 255, 255, 0.3) 100%, transparent),
              radial-gradient(2px 2px at ${40 + scrollPos * 0.08}% ${40 + scrollPos * 0.04}%, rgba(255, 165, 0, 0.2) 100%, transparent),
              radial-gradient(2.5px 2.5px at ${60 + scrollPos * 0.12}% ${60 + scrollPos * 0.06}%, rgba(255, 255, 255, 0.2) 100%, transparent)
            `,
            backgroundSize: '200% 200%',
            transform: `translateZ(${scrollPos * 0.2}px)`
          }}
        />

        {/* Content */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 animate-gradient relative z-10">
          Own the future of<br />accounting
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 relative z-10">
          LedgerFund is building a decentralized network of accounting firms owned and governed by accountants. 
          We're putting the future of the profession back in the hands of professionals.
        </p>

        <div className="mb-16 relative z-10">
          <p className="text-sm uppercase tracking-wider text-purple-300 mb-6">
            Explore applications powered by LedgerFund Protocol
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/mint-nft')}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-purple-400/50 blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                <Trophy className="w-5 h-5" />
                <span>Earn Rewards with Quests</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/token-presale')}
              className="group relative px-8 py-3 bg-black/30 hover:bg-black/40 border border-purple-500/30 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-300/10 blur-sm group-hover:blur-lg transition-all duration-300" />
              <div className="relative flex items-center justify-center gap-2 text-white font-medium">
                <UserCircle className="w-5 h-5" />
                <span>Mint Your LedgerFren NFT</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Other sections */}
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
        {/* Dark Purple Background with Stars */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, #1a0b2e 0%, #000000 100%)",
            opacity: 0.98
          }}
        />
        
        {/* Star Field Effect */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent),
              radial-gradient(1.5px 1.5px at 20% 20%, rgba(139, 92, 246, 0.7) 100%, transparent)
            `,
            backgroundSize: "400% 400%",
            animation: "star-field 240s ease-in-out infinite"
          }}
        />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 relative z-10">
        <IndexContent />
      </div>

      <style>
        {`
          @keyframes singularity {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(180deg); }
          }
          
          @keyframes cosmic-pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          
          @keyframes star-field {
            0% { transform: translateZ(0) rotate(0deg); }
            100% { transform: translateZ(400px) rotate(360deg); }
          }
          
          .perspective-3000 {
            perspective: 3000px;
          }
        `}
      </style>
    </div>
  );
};

export default Index;
