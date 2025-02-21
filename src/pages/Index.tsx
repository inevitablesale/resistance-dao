import React from 'react';
import { WhatWeBuilding } from "@/components/WhatWeBuilding";
import { ReclaimControl } from "@/components/ReclaimControl";
import { HowItWorks } from "@/components/HowItWorks";
import { AlternativeToEquity } from "@/components/AlternativeToEquity";
import { SystemWeDeserve } from "@/components/SystemWeDeserve";
import { CallToAction } from "@/components/CallToAction";
import { Roadmap } from "@/components/Roadmap";
import { LedgerFrens } from "@/components/LedgerFrens";
import { Partners } from "@/components/Partners";
import { FAQ } from "@/components/FAQ";
import { useNavigate } from "react-router-dom";
import { WalletInfo } from "@/components/WalletInfo";
import { useEffect, useRef, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Award, 
  Vote, 
  Star, 
  Rocket, 
  Users, 
  Shield, 
  Crown, 
  Calculator, 
  Clock, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  BarChart2, 
  Briefcase, 
  Building,
  Wallet,
  Image,
  Settings,
  Brain,
  UsersRound,
} from "lucide-react";
import { getPresaleContract, PRESALE_CONTRACT_ADDRESS, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";

const presaleData = [
  { 
    name: 'Protocol Investment', 
    value: 100, 
    color: '#14b8a6', 
    description: 'Early supporters invest in the LedgerFund protocol, gaining tokens and earning reflections from all accounting firm investments made by the DAO. 5M tokens available at $0.10.',
    className: 'col-span-2 text-center',
    features: [
      {
        icon: Trophy,
        title: "Presale Bonus",
        description: "25% bonus tokens for early supporters"
      },
      {
        icon: Award,
        title: "Reflection Rights",
        description: "10% of all future firm distributions"
      },
      {
        icon: Vote,
        title: "Governance Power",
        description: "Vote on key protocol decisions and future development"
      },
      {
        icon: Star,
        title: "Network Effects",
        description: "Be part of the first decentralized accounting network"
      },
      {
        icon: Rocket,
        title: "Early Access",
        description: "Priority access to future token sales and firm investments"
      },
      {
        icon: Users,
        title: "Exclusive Access",
        description: "Join private Discord channels and community events"
      }
    ]
  }
];

const publicSaleData = [
  { 
    name: 'Treasury', 
    value: 30, 
    color: '#ea384c',
    description: 'Strategic treasury management by third-party vault provider ensures secure and transparent fund management for accounting firm acquisitions.',
    className: 'col-span-1'
  },
  { 
    name: 'Firm Investment', 
    value: 50, 
    color: '#ea384c',
    description: 'Dedicated allocation for accountants to invest in practices identified and vetted by the DAO community.',
    className: 'col-span-1'
  },
  { 
    name: 'Community Rewards', 
    value: 10, 
    color: '#ea384c',
    description: 'Incentives for active DAO participation including practice identification, due diligence, and community growth initiatives.',
    className: 'col-span-1'
  },
  { 
    name: 'Partners', 
    value: 10, 
    color: '#ea384c',
    description: 'Strategic partnerships with banks, staffing agencies, technology providers supporting practice acquisitions.',
    className: 'col-span-1'
  }
];

const boardMembers = [
  { 
    role: "Managing Partners",
    description: "Led multiple successful accounting firms through growth and acquisition phases, bringing hands-on leadership experience.",
    icon: Trophy
  },
  { 
    role: "M&A Specialists",
    description: "Expert valuation and deal structuring for accounting practices, with deep understanding of industry metrics.",
    icon: Star
  },
  { 
    role: "Operations Experts",
    description: "Streamlined practice operations and implemented efficient workflows across multiple firms.",
    icon: Shield
  },
  { 
    role: "Technology Leaders",
    description: "Transformed traditional practices through strategic technology adoption and digital transformation.",
    icon: Rocket
  }
];

const processSteps = [
  {
    title: "Submit Your Thesis",
    description: "Join a community of like-minded investors to propose and develop investment strategies for accounting practices you want to acquire.",
    icon: Trophy,
    color: "yellow",
    className: "cosmic-box yellow-energy"
  },
  {
    title: "Tokenize Firm Assets",
    description: "Convert accounting practices into tradeable digital assets. Access the decentralized marketplace for seamless buying and selling.",
    icon: Crown,
    color: "yellow",
    className: "cosmic-box yellow-energy"
  }
];

const IndexContent = () => {
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const { setShowOnRamp, setShowAuthFlow } = useWalletConnection();
  const { toast } = useToast();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const presaleRef = useRef<HTMLDivElement>(null);
  const [maticPrice, setMaticPrice] = useState<string>("Loading...");

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const fetchMaticPrice = async () => {
      const price = await fetchPresaleMaticPrice();
      setMaticPrice(price);
    };
    fetchMaticPrice();
    const interval = setInterval(fetchMaticPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyToken = () => {
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

  useEffect(() => {
    const createNodes = () => {
      const nodes = [];
      for (let i = 0; i < 5; i++) {
        nodes.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          type: Math.random() > 0.5 ? 'yellow' : 'teal'
        });
      }
      return nodes;
    };

    const createDataPoints = () => {
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push({
          startX: Math.random() * 100,
          startY: Math.random() * 100,
          endX: Math.random() * 100,
          endY: Math.random() * 100,
          type: Math.random() > 0.5 ? 'yellow' : 'teal',
          delay: Math.random() * 2
        });
      }
      return points;
    };

    const nodes = createNodes();
    const dataPoints = createDataPoints();

    // Add nodes to the circuit board
    const circuitBoard = document.querySelector('.circuit-board');
    if (circuitBoard) {
      nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = `circuit-node ${node.type}`;
        nodeElement.style.left = `${node.x}%`;
        nodeElement.style.top = `${node.y}%`;
        circuitBoard.appendChild(nodeElement);
      });

      // Add data points
      dataPoints.forEach(point => {
        const pointElement = document.createElement('div');
        pointElement.className = `data-point ${point.type}`;
        pointElement.style.left = `${point.startX}%`;
        pointElement.style.top = `${point.startY}%`;
        pointElement.style.setProperty('--flow-x', `${point.endX - point.startX}%`);
        pointElement.style.setProperty('--flow-y', `${point.endY - point.startY}%`);
        pointElement.style.animationDelay = `${point.delay}s`;
        circuitBoard.appendChild(pointElement);
      });
    }
  }, []);

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
            <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-400 text-center">
              Introducing LedgerFrens
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* $25 LFP Mint */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="p-2 bg-yellow-500/10 rounded-lg inline-block mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-500/30 rounded-full animate-pulse"></div>
                      <Wallet className="w-12 h-12 text-yellow-500 relative z-10 animate-cosmic-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-500 mb-4">Start Your Web3 Journey for $25</h3>
                  <p className="text-white/70">
                    Mint a LedgerFren Proposal (LFP) with our LedgerFren Proposal Factory for just $25—no fancy pitch decks, VC connections, or smart contracts needed. Test your idea (token, NFT, DeFi, AI, or more) and build momentum with our community.
                  </p>
                </div>
              </div>

              {/* Community Voting */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="p-2 bg-teal-500/10 rounded-lg inline-block mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-teal-500/30 rounded-full animate-pulse"></div>
                      <UsersRound className="w-12 h-12 text-teal-500 relative z-10 animate-vote-stack" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-teal-500 mb-4">Tap Our Community's Votes</h3>
                  <p className="text-white/70">
                    Our 1,500 newsletter subscribers and 2,500 LinkedIn members vote with $1 each on your LFP to show soft commitments, shaping your project's direction—no centralized gatekeepers, just raw support.
                  </p>
                </div>
              </div>

              {/* Launch Momentum */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="p-2 bg-yellow-500/10 rounded-lg inline-block mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-500/30 rounded-full animate-pulse"></div>
                      <Rocket className="w-12 h-12 text-yellow-500 relative z-10 animate-cosmic-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-500 mb-4">Gain Traction Before You Launch</h3>
                  <p className="text-white/70">
                    Use your LFP to prove your project's potential on-chain, gathering votes and commitments before investing in smart contracts. No upfront risks, no steep fees—just clear momentum to launch when you're ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatWeBuilding />
      <LedgerFrens />
      <HowItWorks />
      <AlternativeToEquity />
      <ReclaimControl />
      <SystemWeDeserve />
      <CallToAction />
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
