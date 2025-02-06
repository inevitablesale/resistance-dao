
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
      <div className="text-center mb-8 max-w-6xl mx-auto pt-32 relative z-10">
        {/* Black Hole Scene Container */}
        <div className="absolute inset-0 -z-10 overflow-hidden perspective-3000">
          {/* Black Hole Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-pulse-slow">
            <div className="absolute inset-0 bg-black rounded-full shadow-[inset_0_0_50px_rgba(255,255,255,0.1)]"></div>
          </div>

          {/* Accretion Disk */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] animate-spin-slow">
            <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-r from-[#ea384c]/40 via-[#F97316]/60 to-[#D946EF]/40
                          blur-md transform rotate-45 scale-y-[0.15] animate-pulse-slow"></div>
            <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-r from-[#F97316]/60 via-[#ea384c]/80 to-[#8B5CF6]/60
                          blur-lg transform -rotate-45 scale-y-[0.15] animate-pulse-slow"></div>
          </div>

          {/* Energy Jet */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-[600px] w-12 bg-gradient-to-t from-[#0EA5E9] via-[#1EAEDB]/50 to-transparent
                          transform -rotate-45 blur-xl animate-pulse-slow"></div>
          </div>

          {/* Gravitational Lensing Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent
                         transform rotate-45 animate-wave"></div>

          {/* Star Field */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:50px_50px] opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(white_2px,transparent_2px)] bg-[length:100px_100px] opacity-30 animate-twinkle"></div>
          </div>

          {/* Galactic Dust */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/10"></div>
        </div>

        {/* Hero Content */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 animate-gradient">
          Own the future of<br />accounting
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          LedgerFund is building a decentralized network of accounting firms owned and governed by accountants. 
          We're putting the future of the profession back in the hands of professionals.
        </p>

        <div className="mb-16">
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

        {/* Animated Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-64 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent animate-wave" 
               style={{
                 maskImage: "linear-gradient(to bottom, transparent, black)",
                 WebkitMaskImage: "linear-gradient(to bottom, transparent, black)"
               }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-400/20 to-transparent animate-wave-slow" 
               style={{
                 maskImage: "linear-gradient(to bottom, transparent, black)",
                 WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
                 animationDelay: "-2s"
               }}
          />
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
        {/* Dark Purple Background with Stars */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, #1a0b2e 0%, #000000 100%)",
            opacity: 0.98
          }}
        />
        
        {/* Animated Glow Effects */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 45%)",
            animation: "quantumField 30s ease-in-out infinite"
          }}
        />
        
        {/* Star Field Effect */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: "radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent), radial-gradient(1.5px 1.5px at 20% 20%, rgba(139, 92, 246, 0.7) 100%, transparent)",
            backgroundSize: "400% 400%",
            animation: "temporalWake 240s ease-in-out infinite"
          }}
        />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 relative z-10">
        <IndexContent />
      </div>

      <style>
        {`
          @keyframes wave {
            0%, 100% {
              transform: translateY(0) scale(1.5);
            }
            50% {
              transform: translateY(-20px) scale(1.3);
            }
          }
          
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          .animate-wave {
            animation: wave 8s ease-in-out infinite;
          }
          
          .animate-wave-slow {
            animation: wave 12s ease-in-out infinite;
          }
          
          .animate-gradient {
            animation: gradient 8s ease infinite;
            background-size: 200% 200%;
          }
        `}
      </style>
    </div>
  );
};

export default Index;
