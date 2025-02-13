import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Nav from "@/components/Nav";
import { WhatWeBuilding } from "@/components/WhatWeBuilding";
import { PrivateEquityImpact } from "@/components/PrivateEquityImpact";
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
import { Trophy, Award, Vote, Star, Rocket, Users, Shield, Crown, Building2, ArrowRight, BarChart2, Briefcase, Calculator, Clock, Calendar, DollarSign, BookOpen } from "lucide-react";
import { ethers } from "ethers";
import { getPresaleContract, PRESALE_CONTRACT_ADDRESS, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { TokenPurchaseForm } from "@/components/TokenPurchaseForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    description: "Share your vision for acquiring and scaling accounting practices. Connect with like-minded investors to form investment pools.",
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
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const presaleRef = useRef<HTMLDivElement>(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");
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

  useEffect(() => {
    if (primaryWallet?.isConnected?.() && selectedAmount) {
      setShowPurchaseForm(true);
    }
  }, [primaryWallet, selectedAmount]);

  const handleTierSelect = (amount: string) => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to purchase tokens.",
        duration: 5000,
      });
      return;
    }
    setSelectedAmount(amount);
    setShowPurchaseForm(true);
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
          <div className="mb-8">
            <Building2 className="w-24 h-24 mx-auto text-yellow-500 animate-cosmic-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Accounting Firm<br />Ownership Simplified
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12">
            Start with $100 and own fractions of high-quality accounting practices. Pool resources, earn passive income, and trade firm assets on our decentralized marketplace.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setShowPurchaseForm(!showPurchaseForm)}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Buy Token
              </button>
              <button 
                onClick={() => window.open('https://docs.ledgerfund.finance', '_blank')}
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Book a Demo
              </button>
            </div>

            {showPurchaseForm && (
              <div className="max-w-md mx-auto bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 animate-in slide-in-from-top duration-300">
                <TokenPurchaseForm initialAmount={selectedAmount} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 1: Submit Your Thesis */}
      <section className="py-24 relative z-10 bg-black/30 backdrop-blur-sm">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300">
                Build Your Investment Thesis
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-4xl mx-auto">
                Join a community of like-minded investors to propose and develop investment strategies for accounting practices you want to acquire.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Create Thesis */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="p-2 bg-yellow-500/10 rounded-lg inline-block mb-6">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-500 mb-4">Create Thesis</h3>
                  <p className="text-white/70">
                    Propose your vision for acquiring and growing accounting practices. Define your strategy, target metrics, and growth plans.
                  </p>
                </div>
              </div>

              {/* Token-Based Voting */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="p-2 bg-teal-500/10 rounded-lg inline-block mb-6">
                    <Vote className="w-12 h-12 text-teal-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-teal-500 mb-4">Token-Based Voting</h3>
                  <p className="text-white/70">
                    Community members vote on theses by dedicating their LGR tokens, aligning incentives and building consensus.
                  </p>
                </div>
              </div>

              {/* Pool Resources */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="p-2 bg-yellow-500/10 rounded-lg inline-block mb-6">
                    <Crown className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-500 mb-4">Pool Resources</h3>
                  <p className="text-white/70">
                    Once approved, create or join liquidity pools with your LGR tokens to participate in practice acquisitions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Tokenize Firm Assets */}
      <section className="py-24 relative z-10 bg-black/30 backdrop-blur-sm">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300">
                Tokenize Acquired Practices
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-4xl mx-auto">
                Convert illiquid practice assets into tradeable tokens on our decentralized exchange, unlocking new value from human capital, client relationships, and intellectual property.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Firm Valuation */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-teal-500/10 rounded-lg">
                      <Building2 className="w-8 h-8 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Firm Valuation</h3>
                      <p className="text-white/70">Tokenize partner expertise, specialized skills, and professional certifications into tradeable assets</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-white/60">Asset Class: Professional Expertise</span>
                    <span className="text-yellow-500 px-3 py-1 rounded-full text-sm border border-yellow-500/20 bg-yellow-500/10">
                      Available after presale
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Portfolio */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Users className="w-8 h-8 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Client Portfolio</h3>
                      <p className="text-white/70">Transform long-term client relationships and recurring revenue streams into liquid digital assets</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-white/60">Asset Class: Customer Relations</span>
                    <span className="text-yellow-500 px-3 py-1 rounded-full text-sm border border-yellow-500/20 bg-yellow-500/10">
                      Available after presale
                    </span>
                  </div>
                </div>
              </div>

              {/* Advisory Services */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Briefcase className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Advisory Services</h3>
                      <p className="text-white/70">Monetize industry networks, referral partnerships, and community relationships through tokenization</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-white/60">Asset Class: Professional Network</span>
                    <span className="text-yellow-500 px-3 py-1 rounded-full text-sm border border-yellow-500/20 bg-yellow-500/10">
                      Available after presale
                    </span>
                  </div>
                </div>
              </div>

              {/* Resources & IP */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                      <BarChart2 className="w-8 h-8 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Resources & IP</h3>
                      <p className="text-white/70">Convert proprietary processes, workflows, and systems into tradeable digital assets</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-white/60">Asset Class: Intellectual Property</span>
                    <span className="text-yellow-500 px-3 py-1 rounded-full text-sm border border-yellow-500/20 bg-yellow-500/10">
                      Available after presale
                    </span>
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
      <PrivateEquityImpact />
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
