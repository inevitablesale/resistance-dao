
import React from 'react';
import { Roadmap } from "@/components/Roadmap";
import { Partners } from "@/components/Partners";
import { FAQ } from "@/components/FAQ";
import { LedgerFrens } from "@/components/LedgerFrens";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet,
  Users,
  Shield,
  UsersRound,
  DollarSign,
  Clock,
  Crown,
  Rocket
} from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";

const IndexContent = () => {
  const navigate = useNavigate();
  const { primaryWallet, handleLogOut } = useDynamicContext();
  const { setShowOnRamp, setShowAuthFlow } = useWalletConnection();
  const { toast } = useToast();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const presaleRef = useRef<HTMLDivElement>(null);
  const [maticPrice, setMaticPrice] = useState<string>("Loading...");

  useEffect(() => {
    const handleExpiredProposal = async () => {
      try {
        if (primaryWallet?.isConnected?.()) {
          await handleLogOut();
          toast({
            title: "Session Expired",
            description: "Your wallet session has expired. Please reconnect.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error handling expired proposal:", error);
      }
    };

    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message === 'Proposal expired') {
        handleExpiredProposal();
      }
    });

    return () => {
      window.removeEventListener('unhandledrejection', handleExpiredProposal);
    };
  }, [primaryWallet, handleLogOut, toast]);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleBuyToken = async () => {
    try {
      if (!primaryWallet?.address) {
        toast({
          title: "Wallet Required",
          description: "Please connect your wallet first.",
          variant: "destructive",
        });
        setShowAuthFlow?.(true);
        return;
      }
      setShowOnRamp?.(true);
    } catch (error: any) {
      console.error("Buy token error:", error);
      if (error.message === 'Proposal expired') {
        toast({
          title: "Connection Expired",
          description: "Your wallet connection has expired. Please try again.",
          variant: "destructive",
        });
        await handleLogOut();
      }
    }
  };

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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div 
          ref={presaleRef}
          className="relative z-3 mt-[20vh]" 
          style={{
            ...parallaxStyle,
            transform: `scale(${1 - scrollProgress * 0.3}) translateY(${scrollProgress * -50}px)`
          }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Mint an NFT to Launch Your Web3 Idea—Simple and Accessible
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12">
            Use our LedgerFren Proposal Factory to mint a LedgerFren Proposal (LFP) for just $25—an NFT that lets you test any Web3 idea (token, NFT, DeFi, AI, or more) and collect soft commitments. No smart contracts or tech skills required upfront.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Wallet className="w-8 h-8 text-yellow-500" />
              </div>
              <span className="text-white/80 text-lg">Mint your proposal NFT for just $25</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-teal-500/10 rounded-full">
                <Users className="w-8 h-8 text-teal-500" />
              </div>
              <span className="text-white/80 text-lg">Collect $1 votes as soft commitments</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <UsersRound className="w-8 h-8 text-yellow-500" />
              </div>
              <span className="text-white/80 text-lg">Join 1,500+ newsletter subscribers</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-teal-500/10 rounded-full">
                <Shield className="w-8 h-8 text-teal-500" />
              </div>
              <span className="text-white/80 text-lg">2,500+ LinkedIn network members</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/thesis')}
              className="px-8 py-4 bg-yellow-500 text-black rounded-lg font-bold text-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Mint Your Proposal NFT
            </button>
            <button 
              onClick={() => navigate('/proposals')}
              className="px-8 py-4 bg-teal-500 text-black rounded-lg font-bold text-xl hover:bg-teal-400 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              View Active Proposals
            </button>
          </div>
        </div>
      </div>

      <LGRFloatingWidget />

      <section className="py-16 relative z-10">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300">
                  Unleash Your Web3 Vision
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
                  —Tap Our Network to Launch Without Risk
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto">
                Whether you're a CEO, product manager, developer, marketer, or analyst—your Web3 vision deserves a shot. No network? No problem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Feeling Sidelined Card */}
              <div className="p-8 rounded-lg border border-red-900/30 bg-red-950/20 backdrop-blur-sm">
                <div className="text-red-400 mb-6">
                  <DollarSign className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-red-400 mb-6">Feeling Sidelined?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-white/70">
                    <Users className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <span>Watching others launch tokens, NFTs, and DeFi platforms while your idea stays locked in your head</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <Clock className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <span>Launchpads demand steep fees and force commitments before proving interest</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <Crown className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <span>Social platforms drown out fresh voices, and traditional routes demand insider networks</span>
                  </li>
                </ul>
              </div>

              {/* Our Pre-Launch Solution Card */}
              <div className="p-8 rounded-lg border border-teal-900/30 bg-teal-950/20 backdrop-blur-sm">
                <div className="text-teal-400 mb-6">
                  <Rocket className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-teal-400 mb-6">Our Pre-Launch Solution</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-white/70">
                    <Rocket className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                    <span>Start with just $25—create a proposal NFT that tests your token, NFT, DeFi, or AI project</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <Users className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                    <span>Tap our network of 1,500 newsletter subscribers and 2,500 LinkedIn members</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <Shield className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                    <span>Gather soft commitments with $1 votes before investing in smart contracts</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Non-Custodial Card */}
              <div className="p-8 rounded-lg border border-yellow-900/30 bg-yellow-950/20 backdrop-blur-sm">
                <div className="text-yellow-400 mb-6">
                  <Shield className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">Non-Custodial</h3>
                <p className="text-white/70">
                  Your wallet, your control. Create and manage your proposal NFT directly—no intermediaries or gatekeepers involved.
                </p>
              </div>

              {/* Decentralized Card */}
              <div className="p-8 rounded-lg border border-teal-900/30 bg-teal-950/20 backdrop-blur-sm">
                <div className="text-teal-400 mb-6">
                  <Users className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-teal-400 mb-6">Decentralized</h3>
                <p className="text-white/70">
                  No centralized authorities—your potential supporters vote with $1 each to show interest and guide your project's direction.
                </p>
              </div>

              {/* Transparent Card */}
              <div className="p-8 rounded-lg border border-yellow-900/30 bg-yellow-950/20 backdrop-blur-sm">
                <div className="text-yellow-400 mb-6">
                  <Rocket className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">Transparent</h3>
                <p className="text-white/70">
                  Track every $25 proposal, $1 vote, and soft commitment on-chain via your proposal NFT. Monitor interest in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LedgerFrens />
      <Roadmap />
      <FAQ />
      <Partners />
    </>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <IndexContent />
    </div>
  );
};

export default Index;
