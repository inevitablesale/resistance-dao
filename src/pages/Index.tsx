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
import { Trophy, UserCircle, Wallet, ClipboardCopy } from "lucide-react";
import { ethers } from "ethers";
import { getPresaleContract, PRESALE_CONTRACT_ADDRESS, PRESALE_END_TIME, TOTAL_PRESALE_SUPPLY, fetchTotalLGRSold, fetchPresaleMaticPrice } from "@/services/presaleContractService";
import { TokenPurchaseForm } from "@/components/TokenPurchaseForm";

const IndexContent = () => {
  const navigate = useNavigate();
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const presaleRef = useRef<HTMLDivElement>(null);
  const loadTime = Date.now();

  // Add states for presale data
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
    // Set loaded state after a small delay to trigger initial animations
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !presaleRef.current) return;
      
      const presaleRect = presaleRef.current.getBoundingClientRect();
      
      // Calculate when Presale Stage 1 enters viewport (top of section reaches bottom of viewport)
      // Scale from 0 to 1 as section enters
      const presaleVisibility = Math.max(0, Math.min(1, 
        1 - (presaleRect.top / window.innerHeight)
      ));
      
      // When scrolling up past the section, scale back down
      const scrollingUpAdjustment = Math.max(0, Math.min(1,
        1 - (Math.abs(presaleRect.bottom) / window.innerHeight)
      ));
      
      // Use the minimum of both values to ensure proper scaling in both directions
      setScrollProgress(Math.min(presaleVisibility, scrollingUpAdjustment));
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
    };

    checkWalletStatus();
  }, [primaryWallet, toast]);

  const parallaxStyle = {
    '--scroll-progress': scrollProgress,
    transform: `scale(${1 + scrollProgress * 0.5})`,
    opacity: 1 - scrollProgress * 0.6
  } as React.CSSProperties;

  // Function to fetch presale data
  const fetchPresaleData = async () => {
    try {
      // Get total LGR tokens sold using the correct function
      const sold = await fetchTotalLGRSold();
      setTotalSold(sold);

      // Get current price in MATIC
      const price = await fetchPresaleMaticPrice();
      setMaticPrice(price === "0" ? "Loading..." : `${price} MATIC`);
      
      // If wallet is connected, get user's purchased tokens
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

  // Calculate time left
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

  // Fetch presale data on component mount and periodically
  useEffect(() => {
    fetchPresaleData();
    const interval = setInterval(fetchPresaleData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to format large numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Function to calculate percentage
  const calculatePercentage = () => {
    return ((Number(totalSold) / Number(presaleSupply)) * 100).toFixed(2);
  };

  // Function to format large numbers with commas
  const formatLargeNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleBuyClick = () => {
    if (!primaryWallet || !primaryWallet.isConnected()) {
      setShowAuthFlow?.(true);
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to purchase tokens.",
      });
    } else {
      setShowPurchaseForm(true);
    }
  };

  return (
    <>
      <div 
        ref={heroRef} 
        className="text-center mb-8 max-w-6xl mx-auto pt-32 relative z-10 min-h-[120vh] flex flex-col items-center justify-start"
      >
        {/* Background Layer */}
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

        {/* Energy Vortex Effect */}
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
              {/* Core */}
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
              
              {/* Energy Field */}
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
              
              {/* Outer Ring */}
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

        {/* Content Layer */}
        <div 
          ref={presaleRef}
          className="relative z-3 mt-[30vh]" 
          style={{
            ...parallaxStyle,
            transform: `scale(${1 - scrollProgress * 0.3}) translateY(${scrollProgress * -50}px)`
          }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 animate-gradient drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            The accounting singularity<br />has arrived
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
            LedgerFund is creating a gravitational force in the accounting industry - a decentralized network that pulls firms into a unified system. Like a cosmic singularity, we're bending the fabric of traditional accounting, collapsing the barriers between firms and creating an event horizon where the profession's future crystallizes into a new form: one owned and governed by accountants themselves.
          </p>

          {/* Presale Information */}
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
            <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-teal-500/20 blur-xl animate-pulse" />
                  <h2 className="relative text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-2 text-center">
                    Presale Stage 1
                  </h2>
                </div>
              </div>

              <div className="text-center text-white/80 font-medium mb-4">
                UNTIL PRICE INCREASE
              </div>

              {/* Countdown Timer with Enhanced Design */}
              <div className="grid grid-cols-4 gap-4 mb-8">
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

              {/* Progress and Stats with Enhanced Visual Design */}
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

              {/* Enhanced Purchase Options */}
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={handleBuyClick}
                  className="group relative px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/70 to-yellow-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative flex items-center justify-center gap-3 text-white font-medium text-lg">
                    <Trophy className="w-5 h-5 animate-bounce" />
                    <span>Buy with Card</span>
                  </div>
                </button>
                
                <button 
                  onClick={handleBuyClick}
                  className="group relative px-8 py-4 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/70 to-teal-500/70 blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative flex items-center justify-center gap-3 text-white font-medium text-lg">
                    <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Buy with Crypto</span>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => navigate('/mint-nft')}
                className="mt-4 text-white/80 hover:text-white underline text-sm transition-colors w-full text-center"
              >
                New to crypto? Get started here
              </button>
            </div>
          )}
        </div>
      </div>

      {/* How to Buy Section */}
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

      {/* Rest of the sections */}
      <div className="relative z-10 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-sm">
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
