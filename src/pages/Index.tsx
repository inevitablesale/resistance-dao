
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
      <div className="text-center mb-8 max-w-6xl mx-auto pt-32 relative z-10 overflow-hidden">
        {/* Black Hole Effect Container */}
        <div className="absolute inset-0 z-0 perspective-3000">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[800px] relative">
              {/* Singularity Core */}
              <div className="absolute inset-0 rounded-full bg-black animate-singularity" 
                   style={{
                     boxShadow: `
                       0 0 100px 20px rgba(138, 43, 226, 0.3),
                       0 0 200px 40px rgba(138, 43, 226, 0.2),
                       0 0 300px 60px rgba(138, 43, 226, 0.1)
                     `
                   }}
              />
              
              {/* Accretion Disk */}
              <div className="absolute inset-0 rounded-full animate-cosmic-pulse"
                   style={{
                     background: `radial-gradient(circle at center,
                       rgba(147, 51, 234, 0.8) 0%,
                       rgba(138, 43, 226, 0.5) 30%,
                       rgba(123, 31, 162, 0.3) 60%,
                       transparent 80%
                     )`
                   }}
              />
              
              {/* Event Horizon */}
              <div className="absolute inset-0 rounded-full animate-pulse-slow"
                   style={{
                     background: `radial-gradient(circle at center,
                       rgba(255, 255, 255, 0.1) 0%,
                       transparent 70%
                     )`,
                     border: '2px solid rgba(147, 51, 234, 0.3)'
                   }}
              />
            </div>
          </div>
        </div>

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
