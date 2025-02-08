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
import { useNavigate } from "react-router-dom";
import { WalletInfo } from "@/components/WalletInfo";
import { useEffect, useRef, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { Trophy, UserCircle, Wallet, ClipboardCopy, Zap, Network, Coins, GitBranch, UserPlus, Award, Vote, Orbit, Star, Moon, Rocket } from "lucide-react";
import { ethers } from "ethers";
import { getPresaleContract, PRESALE_CONTRACT_ADDRESS, PRESALE_END_TIME, TOTAL_PRESALE_SUPPLY, fetchTotalLGRSold, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { TokenPurchaseForm } from "@/components/TokenPurchaseForm";

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
        icon: Coins,
        title: "Reflection Rights",
        description: "10% of all future firm distributions"
      },
      {
        icon: GitBranch,
        title: "Governance Power",
        description: "Vote on key protocol decisions and future development"
      },
      {
        icon: Network,
        title: "Network Effects",
        description: "Be part of the first decentralized accounting network"
      },
      {
        icon: Zap,
        title: "Early Access",
        description: "Priority access to future token sales and firm investments"
      },
      {
        icon: UserCircle,
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
    description: "Built successful firms",
    icon: Orbit  // Leadership orbit
  },
  { 
    role: "M&A Specialists",
    description: "Understand true practice value",
    icon: Star   // Representing celestial mergers
  },
  { 
    role: "Operations Experts",
    description: "Optimized workflows",
    icon: Moon   // Representing cycles and systems
  },
  { 
    role: "Technology Leaders",
    description: "Drive practice innovation",
    icon: Rocket // Representing forward momentum
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
  const loadTime = Date.now();

  const [presaleSupply] = useState<string>(TOTAL_PRESALE_SUPPLY.toString());
  const [totalSold, setTotalSold] = useState<string>('0');
  const [presaleEndTime] = useState<number>(PRESALE_END_TIME * 1000); // Convert to milliseconds
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [myPurchased, setMyPurchased] = useState<string>('0');
  const [myStakeable, setMyStakeable] = useState<string>('0');
  const [maticPrice, setMaticPrice] = useState<string>('Loading...');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!primaryWallet) {
        console.log("[Toast] Showing welcome toast - no wallet detected");
        toast({
          title: "Welcome to LedgerFund",
          description: "Connect your wallet to participate in the token presale",
          duration: 5000,
        });
      }
    }, 1000); // Small delay to ensure proper initialization

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuyClick = () => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to purchase tokens.",
        duration: 5000,
      });
    } else {
      setShowPurchaseForm(true);
    }
  };

  const parallaxStyle = {
    '--scroll-progress': scrollProgress,
    transform: `scale(${1 + scrollProgress * 0.5})`,
    opacity: 1 - scrollProgress * 0.6
  } as React.CSSProperties;

  const fetchPresaleData = async () => {
    try {
      const sold = await fetchTotalLGRSold();
      setTotalSold(sold);

      const price = await fetchPresaleMaticPrice();
      setMaticPrice(price === "0" ? "Loading..." : `${price} MATIC`);
      
      if (primaryWallet?.address) {
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
        const presaleContract = await getPresaleContract(provider);
        const purchased = await (await presaleContract).purchasedTokens(primaryWallet.address);
        setMyPurchased(ethers.utils.formatEther(purchased));
      }
    } catch (error) {
      console.error('Error fetching presale data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch presale data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = presaleEndTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        });
      }
    };

    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [presaleEndTime]);

  useEffect(() => {
    fetchPresaleData();
    const interval = setInterval(fetchPresaleData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculatePercentage = () => {
    return ((Number(totalSold) / Number(presaleSupply)) * 100).toFixed(2);
  };

  const formatLargeNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <div 
        ref={heroRef} 
        className="text-center mb-8 max-w-6xl mx-auto pt-32 relative z-10 min-h-[120vh] flex flex-col items-center justify-start"
      >
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

        <div 
          ref={presaleRef}
          className="relative z-3 mt-[30vh]" 
          style={{
            ...parallaxStyle,
            transform: `scale(${1 - scrollProgress * 0.3}) translateY(${scrollProgress * -50}px)`
          }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            From Service to<br />Sovereignty
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Support Web3's first protocol where token holders elect the board, vote on MSP partners, and power an unstoppable acquisition engine. LedgerFund DAO unites elite accountants, trusted managed service providers, and networked capital to revolutionize practice ownership.
          </p>

          {showPurchaseForm ? (
            <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Purchase LGR Tokens</h2>
                <button
                  onClick={() => setShowPurchaseForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
              </div>
              <TokenPurchaseForm />
            </div>
          ) : (
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ea384c] text-white py-2 px-4 font-bold text-lg shadow-lg transform rotate-[-35deg] w-[150%] text-center"
                >
                  SALE STARTS 2/10/2025
                </div>
              </div>
              
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 blur-xl animate-pulse" />
                    <h2 className="relative text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-2 text-center">
                      Presale
                    </h2>
                  </div>
                </div>

                <div className="text-center text-white/80 font-medium mb-4">
                  UNTIL PRICE INCREASE
                </div>

                <div className="grid grid-cols-4 gap-8 mb-8">
                  {[
                    { label: 'DAYS', value: timeLeft.days },
                    { label: 'HOURS', value: timeLeft.hours },
                    { label: 'MINUTES', value: timeLeft.minutes },
                    { label: 'SECONDS', value: timeLeft.seconds }
                  ].map(({ label, value }) => (
                    <div 
                      key={label} 
                      className="relative group perspective-3000"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-teal-500/30 rounded-lg blur-md transform group-hover:scale-110 transition-transform duration-300" />
                      <div className="relative bg-black/80 p-4 rounded-lg border border-yellow-500/30 transform transition-all duration-300 group-hover:translate-y-[-2px]">
                        <div className="text-4xl font-bold text-white mb-2 text-center animate-[pulse_2s_ease-in-out_infinite]">
                          {value}
                        </div>
                        <div className="text-sm text-gray-400 text-center">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-teal-500/10 blur-lg" />
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-white text-lg">
                        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-300">
                          {formatLargeNumber(totalSold)}
                        </span>
                        <span className="text-gray-400"> / </span> 
                        <span className="text-gray-300">5M</span>
                        <span className="text-gray-400 ml-2">LGR Tokens Sold</span>
                      </div>
                      <div className="text-teal-400 font-bold">
                        {calculatePercentage()}%
                      </div>
                    </div>
                    
                    <div className="relative h-4 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 animate-pulse blur-sm"
                      />
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-teal-500 transition-all duration-1000 relative"
                        style={{ 
                          width: `${Math.min(100, (Number(totalSold) / Number(presaleSupply)) * 100)}%` 
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/50 to-teal-500/50 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-center text-white/80 font-medium">
                        90% DISCOUNT ACTIVE
                      </div>
                      <div className="text-center text-teal-400 font-medium">
                        Current Price: {maticPrice} / $0.10 USD
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <button 
                    onClick={handleBuyClick}
                    className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative flex items-center justify-center gap-3 text-white font-medium text-lg">
                      <Trophy className="w-5 h-5" />
                      <span>Buy with Card</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={handleBuyClick}
                    className="group relative px-8 py-4 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative flex items-center justify-center gap-3 text-white font-medium text-lg">
                      <Wallet className="w-5 h-5" />
                      <span>Buy with Crypto</span>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={() => window.open('https://docs.ledgerfund.finance/guides/buying-lgr', '_blank')}
                  className="mt-4 text-gray-400 hover:text-white transition-colors text-sm w-full text-center"
                >
                  New to crypto? Get started here
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12">
            How to Buy $LGR
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create Your Wallet</h3>
              <p className="text-gray-300">
                Enter and confirm your email address to create a wallet. You can also sign in using your MetaMask wallet.
              </p>
            </div>

            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Load Wallet With Crypto</h3>
              <p className="text-gray-300">
                Add MATIC to your wallet to participate in the presale. You can buy MATIC directly or transfer from another wallet.
              </p>
            </div>

            <div className="relative p-6 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Buy and Stake $LGR</h3>
              <p className="text-gray-300">
                Purchase $LGR tokens at the presale price and stake them to earn rewards and participate in governance.
              </p>
            </div>
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
                Join the Singularity
              </h2>

              <div className="relative mt-16 mb-24">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 via-teal-500 to-yellow-500 transform -translate-x-1/2" />
                
                {[
                  { phase: 'Q2 2024', event: 'Board Nomination Opens', delay: '0s' },
                  { phase: 'Q3 2024', event: 'Initial Board Election', delay: '0.2s' },
                  { phase: 'Q4 2024', event: 'First Acquisitions Selected', delay: '0.4s' },
                  { phase: '2025', event: 'Portfolio Expansion Begins', delay: '0.6s' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="relative mb-16 group"
                    style={{ animationDelay: item.delay }}
                  >
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32 relative animate-orbit">
                        <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm border border-yellow-500/30 
                                      group-hover:border-yellow-500/60 transition-all duration-300
                                      flex items-center justify-center text-center p-4 animate-cosmic-pulse
                                      transform group-hover:scale-110">
                          <div>
                            <div className="text-yellow-500 font-bold mb-1">{item.phase}</div>
                            <div className="text-white/80 text-sm">{item.event}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
                <div className="col-span-full text-center mb-8">
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <div className="flex flex-col items-center group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-xl animate-pulse rounded-full" />
                        <Orbit className="w-8 h-8 text-yellow-500 relative animate-cosmic-pulse" />
                      </div>
                      <span className="text-xl font-bold text-white mt-2">Apply</span>
                    </div>
                    <div className="flex flex-col items-center group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-teal-500/20 blur-xl animate-pulse rounded-full" />
                        <Star className="w-8 h-8 text-teal-500 relative animate-cosmic-pulse" />
                      </div>
                      <span className="text-xl font-bold text-white mt-2">Nominate</span>
                    </div>
                    <div className="flex flex-col items-center group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-xl animate-pulse rounded-full" />
                        <Moon className="w-8 h-8 text-yellow-500 relative animate-cosmic-pulse" />
                      </div>
                      <span className="text-xl font-bold text-white mt-2">Vote</span>
                    </div>
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
          <Partners />
        </div>
      </div>
    </>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div
