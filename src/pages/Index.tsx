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
        <div className="fixed inset-0 z-0">
          <div className="circuit-board" />
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

        <div 
          ref={presaleRef}
          className="relative z-3 mt-[20vh]" 
          style={{
            ...parallaxStyle,
            transform: `scale(${1 - scrollProgress * 0.3}) translateY(${scrollProgress * -50}px)`
          }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Launch Your Web3 Idea—Test, Grow, and Succeed Risk-Free
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12">
            Launch a proposal for $25, gather soft commitments with $1 votes—tap our network, no big connections needed
          </p>

          <div className="space-y-6">
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate('/thesis')}
                className="px-12 py-6 bg-yellow-500 text-black rounded-lg font-bold text-2xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Create Proposal
              </button>
              <button 
                onClick={() => navigate('/proposals')}
                className="px-12 py-6 bg-teal-500 text-black rounded-lg font-bold text-2xl hover:bg-teal-400 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Explore Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      <LGRFloatingWidget />

      {/* Pre-ICO Opportunity Section */}
      <section className="py-24 relative z-10 bg-black/30 backdrop-blur-sm">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Rocket className="w-16 h-16 mx-auto text-yellow-500 mb-6 animate-cosmic-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-400">
                Unleash Your Web3 Vision—Tap Our Network to Launch Without Risk
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-4xl mx-auto">
                Whether you're a CEO, product manager, developer, marketer, or analyst—your Web3 vision deserves a shot. No network? No problem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Pain Points */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="p-2 bg-red-500/10 rounded-lg inline-block mb-6">
                    <DollarSign className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-500 mb-4">Feeling Sidelined?</h3>
                  <ul className="space-y-4 text-white/70">
                    <li className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <span>Watching others launch tokens, NFTs, and DeFi platforms while your idea stays locked in your head</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <span>Launchpads demand steep fees and force commitments before proving interest</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Crown className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <span>Social platforms drown out fresh voices, and traditional routes demand insider networks</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Solution */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="p-2 bg-teal-500/10 rounded-lg inline-block mb-6">
                    <Rocket className="w-12 h-12 text-teal-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-teal-500 mb-4">Our Pre-Launch Solution</h3>
                  <ul className="space-y-4 text-white/70">
                    <li className="flex items-start gap-3">
                      <Wallet className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                      <span>Start with just $25—create a proposal NFT that tests your token, NFT, DeFi, or AI project</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                      <span>Tap our network of 1,500 newsletter subscribers and 2,500 LinkedIn members</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                      <span>Gather soft commitments with $1 votes before investing in smart contracts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Web3 Pillars */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 h-full">
                  <div className="p-2 bg-yellow-500/10 rounded-lg inline-block mb-6">
                    <Shield className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-4">Non-Custodial</h3>
                  <p className="text-white/70">
                    Your wallet, your control. Create and manage your proposal NFT directly—no intermediaries or gatekeepers involved.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 h-full">
                  <div className="p-2 bg-teal-500/10 rounded-lg inline-block mb-6">
                    <Users className="w-12 h-12 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold text-teal-500 mb-4">Decentralized</h3>
                  <p className="text-white/70">
                    No centralized authorities—your potential supporters vote with $1 each to show interest and guide your project's direction.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 h-full">
                  <div className="p-2 bg-yellow-500/10 rounded-lg inline-block mb-6">
                    <Rocket className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-4">Transparent</h3>
                  <p className="text-white/70">
                    Track every $25 proposal, $1 vote, and soft commitment on-chain via your proposal NFT. Monitor interest in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              
            </div>
          </div>
        </div>
      </section>

      {/* Mint NFT Section - Right after Hero */}
      <section className="py-16 relative z-10">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Left side - Animated Icons */}
                  <div className="w-full md:w-1/3 flex justify-center relative">
                    {/* Main NFT Visual */}
                    <div className="relative w-64 h-64">
                      {/* Floating Project Symbols */}
                      <div className="absolute inset-0">
                        <DollarSign className="absolute top-0 left-0 w-8 h-8 text-yellow-500 animate-float" />
                        <Image className="absolute top-1/4 right-0 w-8 h-8 text-purple-500 animate-float-delayed" />
                        <Settings className="absolute bottom-1/4 left-0 w-8 h-8 text-teal-500 animate-float-more-delayed" />
                        <Brain className="absolute bottom-0 right-0 w-8 h-8 text-blue-500 animate-float-most-delayed" />
                      </div>
                      
                      {/* Wallet Icon */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-500/30 rounded-full animate-pulse"></div>
                          <Wallet className="w-16 h-16 text-yellow-500 relative z-10 animate-cosmic-pulse" />
                        </div>
                      </div>

                      {/* Users Vote Stack */}
                      <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-teal-500/30 rounded-full animate-pulse"></div>
                          <UsersRound className="w-16 h-16 text-teal-500 relative z-10 animate-vote-stack" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="w-full md:w-2/3">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-400">
                      Mint an NFT to Launch Your Web3 Idea—Simple and Accessible
                    </h2>
                    <p className="text-lg text-white/80 mb-8">
                      Use our LedgerFren Proposal Factory to mint a LedgerFren Proposal (LFP) for just $25—an NFT that lets you test any Web3 idea (token, NFT, DeFi, AI, or more) and collect soft commitments. No smart contracts or tech skills required upfront.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start gap-3">
                        <Wallet className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0 animate-pulse" />
                        <span className="text-white/70">Mint your proposal NFT for just $25</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <UsersRound className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0 animate-pulse" />
                        <span className="text-white/70">Collect $1 votes as soft commitments</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-6 h-6 text-yellow-500 mt-1 flex-shrink-0" />
                        <span className="text-white/70">Join 1,500+ newsletter subscribers</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-teal-500 mt-1 flex-shrink-0" />
                        <span className="text-white/70">2,500+ LinkedIn network members</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => navigate('/thesis')}
                        className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5" />
                          <span>Mint Your Proposal NFT</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => navigate('/proposals')}
                        className="px-6 py-3 bg-teal-500 text-black rounded-lg font-semibold hover:bg-teal-400 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center gap-2">
                          <UsersRound className="w-5 h-5" />
                          <span>View Active Proposals</span>
                        </div>
                      </button>
                    </div>
                  </div>
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
