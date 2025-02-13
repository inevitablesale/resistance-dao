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
    title: "Build Your Thesis",
    description: "Join a community of like-minded investors to propose and develop investment strategies for accounting practices you want to acquire",
    icon: Trophy,
    color: "yellow",
    className: "cosmic-box yellow-energy"
  },
  {
    title: "Create Liquidity Pools",
    description: "Pool resources with other accountants to acquire and scale practices",
    icon: Users,
    color: "teal",
    className: "cosmic-box teal-energy"
  },
  {
    title: "Manage Firms",
    description: "Leverage centralized services model to separate work from accounts, creating scalable digital assets",
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
            Invest in<br />Accounting Firms On-Chain
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12">
            Start with $100 and own fractions of high-quality accounting practices. Pool resources, earn passive income, and trade firm tokens on our decentralized marketplace.
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

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative mt-24">
            {processSteps.map((step, index) => (
              <div 
                key={index}
                className={`${step.className} p-8 rounded-xl backdrop-blur-sm relative overflow-hidden group transition-all duration-500 hover:scale-105`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 z-0" />
                <div className="relative z-10">
                  <div className="mb-6">
                    <step.icon className={`w-12 h-12 mx-auto text-${step.color}-500 animate-cosmic-pulse`} />
                  </div>
                  <h3 className={`text-2xl font-bold text-${step.color}-500 mb-4`}>
                    {step.title}
                  </h3>
                  <p className="text-white/80 text-lg">
                    {step.description}
                  </p>
                </div>
                <div className="absolute inset-0 border border-white/10 rounded-xl z-20 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12">
            Tokenize Acquired Practices
          </h2>
          
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-xl text-gray-300">
              Convert illiquid practice assets into tradeable tokens on our decentralized exchange, unlocking new value from human capital, client relationships, and intellectual property.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="bg-black/20 border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Human Capital</CardTitle>
                    <CardDescription className="text-gray-400">
                      Tokenize partner expertise, specialized skills, and professional certifications into tradeable assets
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Asset Class</span>
                  <span className="text-white font-medium">Professional Expertise</span>
                </div>
                <Button className="w-full group-hover:translate-x-1 transition-transform">
                  Tokenize Human Capital <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Client Capital</CardTitle>
                    <CardDescription className="text-gray-400">
                      Transform long-term client relationships and recurring revenue streams into liquid digital assets
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Asset Class</span>
                  <span className="text-white font-medium">Customer Relations</span>
                </div>
                <Button className="w-full group-hover:translate-x-1 transition-transform">
                  Tokenize Client Base <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Social Capital</CardTitle>
                    <CardDescription className="text-gray-400">
                      Monetize industry networks, referral partnerships, and community relationships through tokenization
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Asset Class</span>
                  <span className="text-white font-medium">Network Value</span>
                </div>
                <Button className="w-full group-hover:translate-x-1 transition-transform">
                  Tokenize Networks <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <BarChart2 className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Structural Capital</CardTitle>
                    <CardDescription className="text-gray-400">
                      Convert proprietary processes, workflows, and systems into tradeable digital assets
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Asset Class</span>
                  <span className="text-white font-medium">Operational IP</span>
                </div>
                <Button className="w-full group-hover:translate-x-1 transition-transform">
                  Tokenize Infrastructure <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-gray-400 max-w-2xl mx-auto mt-12">
            <p className="text-sm">
              Access our DAO-governed marketplace to trade tokenized practice assets, creating new opportunities 
              for wealth creation and practice value realization.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-24">
          <div id="join-the-singularity" className="text-center mb-16 pt-20 relative overflow-hidden">
            <div 
              className="absolute inset-0 -z-10"
              style={{
                background: `
                  radial-gradient(2px 2px at 20% 20%, rgba(234, 179, 8, 0.95) 100%, transparent),
                  radial-gradient(2px 2px at 40% 40%, rgba(234, 179, 8, 0.92) 100%, transparent),
                  radial-gradient(3px 3px at 60% 60%, rgba(234, 179, 8, 0.90) 100%, transparent)
                `,
                backgroundSize: "240px 240px",
                animation: "parallax-scroll 30s linear infinite"
              }}
            />

            <div className="container mx-auto px-4 relative">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6 animate-cosmic-pulse">
                Unite. Acquire. Transform.
              </h2>
              
              <p className="text-lg text-white/80 max-w-3xl mx-auto mb-12">
                Bringing together decades of industry experience, professional resources, and strategic capital to drive the protocol's success through expert leadership.
              </p>

              <div className="flex items-center justify-center gap-8 mb-12">
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl animate-pulse rounded-full" />
                    <Trophy className="w-8 h-8 text-yellow-500 relative animate-cosmic-pulse" />
                  </div>
                  <span className="text-xl font-bold text-white mt-2">Apply</span>
                  <span className="text-sm text-white/60">Submit your expertise</span>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-500/20 blur-xl animate-pulse rounded-full" />
                    <Star className="w-8 h-8 text-teal-500 relative animate-cosmic-pulse" />
                  </div>
                  <span className="text-xl font-bold text-white mt-2">Nominate</span>
                  <span className="text-sm text-white/60">Propose board candidates</span>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl animate-pulse rounded-full" />
                    <Shield className="w-8 h-8 text-yellow-500 relative animate-cosmic-pulse" />
                  </div>
                  <span className="text-xl font-bold text-white mt-2">Vote</span>
                  <span className="text-sm text-white/60">Shape protocol governance</span>
                </div>
              </div>

              {boardMembers.map((member, index) => (
                <div
                  key={index}
                  className="group relative perspective-3000"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-teal-500/30 blur-md transform group-hover:scale-110 transition-transform duration-300" />
                  <div className="relative bg-black/60 p-6 rounded-lg border border-yellow-500/30 
                                transform transition-all duration-300 group-hover:translate-y-[-2px]
                                hover:border-yellow-500/60">
                    <member.icon className="w-10 h-10 text-yellow-500 mb-4 mx-auto animate-cosmic-pulse" />
                    <h3 className="text-xl font-bold text-white mb-2">{member.role}</h3>
                    <p className="text-gray-300">{member.description}</p>
                  </div>
                </div>
              ))}

              <div className="mt-12 flex justify-center w-full">
                <div className="relative max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-teal-500/20 to-yellow-500/20 rounded-lg blur-xl opacity-50 animate-pulse" />
                  <div className="relative bg-black/80 backdrop-blur-sm border border-yellow-500/30 px-8 py-6 rounded-lg">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-500 to-yellow-300 mb-3">
                      Governance Applications Coming Soon
                    </h3>
                    <p className="text-white/80">
                      Applications and voting will begin when $100,000 of funding goal is met
                    </p>
                  </div>
                </div>
              </div>

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
            </div>
          </div>
        </div>
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
