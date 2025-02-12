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
import { Trophy, UserCircle, Wallet, ClipboardCopy, Zap, Network, Coins, GitBranch, UserPlus, Award, Vote, Orbit, Star, Moon, Rocket } from "lucide-react";
import { ethers } from "ethers";
import { getPresaleContract, PRESALE_CONTRACT_ADDRESS, PRESALE_END_TIME, TOTAL_PRESALE_SUPPLY, fetchTotalLGRSold, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { TokenPurchaseForm } from "@/components/TokenPurchaseForm";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Loader2 } from "lucide-react";

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
    description: "Led multiple successful accounting firms through growth and acquisition phases, bringing hands-on leadership experience.",
    icon: Orbit
  },
  { 
    role: "M&A Specialists",
    description: "Expert valuation and deal structuring for accounting practices, with deep understanding of industry metrics.",
    icon: Star
  },
  { 
    role: "Operations Experts",
    description: "Streamlined practice operations and implemented efficient workflows across multiple firms.",
    icon: Moon
  },
  { 
    role: "Technology Leaders",
    description: "Transformed traditional practices through strategic technology adoption and digital transformation.",
    icon: Rocket
  }
];

const TokenPackage = ({ name, tokens, price, features }: { 
  name: string;
  tokens: string;
  price: string;
  features: string[];
}) => {
  const { connect, isConnecting, isConnected } = useWalletConnection();
  const { toast } = useToast();

  const handleGetStarted = async () => {
    if (!isConnected) {
      try {
        await connect();
        toast({
          title: "Welcome to LedgerFund",
          description: `You've selected the ${name} package. Please proceed with your purchase.`,
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Unable to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Package Selected",
        description: `You've selected the ${name} package (${tokens} LGR tokens).`,
      });
    }
  };

  return (
    <div className="relative p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-teal-500/50 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-teal-500/5 rounded-xl" />
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-teal-500">
          {price}
        </span>
        <span className="text-white/60">USD</span>
      </div>
      <div className="text-xl font-semibold text-white mb-6">
        {tokens} LGR Tokens
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-white/80">
            <div className="h-5 w-5 rounded-full bg-teal-500/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-teal-500" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
      <Button 
        className="w-full bg-gradient-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 text-white"
        onClick={handleGetStarted}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : isConnected ? (
          'Purchase Tokens'
        ) : (
          'Get Started'
        )}
      </Button>
    </div>
  );
};

const packages = [
  {
    name: "Early Supporter",
    tokens: "1,000",
    price: "$100",
    features: [
      "Early access to protocol launch",
      "Basic governance voting rights",
      "Protocol reflection rewards",
      "Private Discord channel access",
      "Early supporter NFT badge"
    ]
  },
  {
    name: "Core Supporter",
    tokens: "5,000",
    price: "$500",
    features: [
      "Enhanced governance power",
      "Higher reflection rate",
      "Private investment group access",
      "Priority protocol feature access",
      "Core supporter NFT badge",
      "Direct team communication"
    ]
  },
  {
    name: "Foundation Partner",
    tokens: "25,000",
    price: "$2,500",
    features: [
      "Maximum governance weight",
      "Highest reflection rate",
      "Protocol development input",
      "Foundation partner NFT badge",
      "Strategic partner meetings",
      "Direct founder access"
    ]
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
            Next-Gen<br />Accounting Ownership
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            Join the revolution in firm ownership. LedgerFund DAO empowers accountants to collectively acquire, govern, and transform accounting practices through blockchain technology and democratic decision-making.
          </p>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {packages.map((pkg, index) => (
              <TokenPackage key={index} {...pkg} />
            ))}
          </div>
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
                Unite. Acquire. Transform.
              </h2>
              
              <p className="text-lg text-white/80 max-w-3xl mx-auto mb-12">
                Bringing together decades of industry experience, professional resources, and strategic capital to drive the protocol's success through expert leadership.
              </p>

              <div className="flex items-center justify-center gap-8 mb-12">
                <div className="flex flex-col items-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl animate-pulse rounded-full" />
                    <Orbit className="w-8 h-8 text-yellow-500 relative animate-cosmic-pulse" />
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
                    <Moon className="w-8 h-8 text-yellow-500 relative animate-cosmic-pulse" />
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
