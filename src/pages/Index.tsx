
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { WalletInfo } from "@/components/WalletInfo";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState, useRef } from 'react';
import Nav from "@/components/Nav";

const IndexContent = () => {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();
  const [scrollProgress, setScrollProgress] = useState(0);
  const spaceSceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (spaceSceneRef.current) {
        const scrollHeight = spaceSceneRef.current.scrollHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  return (
    <div ref={spaceSceneRef} className="relative min-h-[300vh]">
      {/* Section 1: Upper Fleet */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          {/* Deep space background */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)',
              opacity: 0.98
            }}
          />
          
          {/* Quantum effects */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at ${30 + scrollProgress * 20}% ${70 - scrollProgress * 20}%, rgba(64, 156, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at ${70 - scrollProgress * 20}% ${60 + scrollProgress * 20}%, rgba(147, 51, 255, 0.1) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(0, 255, 255, ${0.05 + scrollProgress * 0.1}) 0%, transparent 55%)
              `,
              animation: 'quantumField 30s ease-in-out infinite'
            }}
          />
          
          {/* Interactive Star Field */}
          <div 
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at ${10 + scrollProgress * 20}% ${10 + scrollProgress * 20}%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(2px 2px at ${20 + scrollProgress * 30}% ${20 - scrollProgress * 20}%, rgba(0, 255, 255, 0.7) 100%, transparent),
                radial-gradient(1.5px 1.5px at ${30 - scrollProgress * 20}% ${30 + scrollProgress * 30}%, rgba(147, 51, 255, 0.8) 100%, transparent)
              `,
              transform: `translateY(${scrollProgress * -50}px) scale(${1 + scrollProgress * 0.2})`,
              transition: 'transform 0.3s ease-out'
            }}
          />

          {/* Destination Planet */}
          <div
            className="absolute"
            style={{
              right: `${20 - scrollProgress * 10}%`,
              bottom: `${20 - scrollProgress * 10}%`,
              width: `${300 + scrollProgress * 400}px`,
              height: `${300 + scrollProgress * 400}px`,
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 30% 30%,
                  rgba(64, 156, 255, 0.8),
                  rgba(147, 51, 255, 0.6) 40%,
                  rgba(0, 255, 255, 0.4) 80%
                )
              `,
              boxShadow: `
                0 0 100px rgba(64, 156, 255, 0.3),
                0 0 200px rgba(147, 51, 255, 0.2) inset
              `,
              transform: `scale(${1 + scrollProgress * 0.5})`,
              opacity: Math.max(0.2, Math.min(1, 1 - scrollProgress * 1.5))
            }}
          >
            {/* Atmospheric Effects */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 50% 50%,
                    transparent 50%,
                    rgba(0, 255, 255, ${0.1 + scrollProgress * 0.2}) 60%,
                    transparent 70%
                  )
                `,
                animation: 'atmosphericPulse 8s ease-in-out infinite'
              }}
            />
          </div>

          {/* The Ark - Main Ship */}
          <div
            className="absolute animate-quantum-ship"
            style={{
              left: `${50 - scrollProgress * 20}%`,
              top: `${40 + scrollProgress * 10}%`,
              width: '300px',
              height: '100px',
              background: `
                linear-gradient(${45 + scrollProgress * 45}deg, 
                  rgba(64, 156, 255, 0.9) 0%,
                  rgba(147, 51, 255, 0.8) 50%,
                  rgba(0, 255, 255, 0.7) 100%
                )
              `,
              boxShadow: `
                0 0 ${40 + scrollProgress * 20}px rgba(64, 156, 255, 0.3),
                0 0 ${80 + scrollProgress * 40}px rgba(147, 51, 255, 0.2),
                0 0 ${120 + scrollProgress * 60}px rgba(0, 255, 255, 0.1)
              `,
              clipPath: 'polygon(0 50%, 25% 0, 85% 0, 100% 50%, 85% 100%, 25% 100%)',
              transform: `
                rotate(${-15 + scrollProgress * 30}deg)
                scale(${1 + scrollProgress * 0.3})
              `,
              transition: 'transform 0.3s ease-out',
              zIndex: 10
            }}
          />

          {/* Guardian Ships */}
          {[...Array(3)].map((_, index) => (
            <div
              key={`guardian-${index}`}
              className="absolute"
              style={{
                left: `${30 + index * 20 - scrollProgress * (15 + index * 5)}%`,
                top: `${35 + index * 10 + scrollProgress * (10 - index * 2)}%`,
                width: '150px',
                height: '50px',
                background: `
                  linear-gradient(${45 + scrollProgress * 45}deg, 
                    rgba(147, 51, 255, 0.9) 0%,
                    rgba(0, 255, 255, 0.8) 50%,
                    rgba(64, 156, 255, 0.7) 100%
                  )
                `,
                boxShadow: `
                  0 0 ${30 + scrollProgress * 15}px rgba(147, 51, 255, 0.3),
                  0 0 ${60 + scrollProgress * 30}px rgba(0, 255, 255, 0.2)
                `,
                clipPath: 'polygon(0 50%, 15% 0, 95% 0, 100% 50%, 95% 100%, 15% 100%)',
                transform: `
                  rotate(${-15 + scrollProgress * (20 - index * 5)}deg)
                  scale(${1 + scrollProgress * 0.2})
                `,
                transition: 'transform 0.3s ease-out',
                zIndex: 5
              }}
            />
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 max-w-5xl mx-auto">
              <h1 
                className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight"
                style={{
                  opacity: 1 - scrollProgress * 2,
                  transform: `translateY(${scrollProgress * -100}px)`
                }}
              >
                The future of accounting<br />belongs to you
              </h1>
              <p 
                className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
                style={{
                  opacity: 1 - scrollProgress * 2,
                  transform: `translateY(${scrollProgress * -50}px)`
                }}
              >
                Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
              </p>

              <div 
                className="flex flex-col md:flex-row gap-4 justify-center mb-16"
                style={{
                  opacity: 1 - scrollProgress * 2,
                  transform: `translateY(${scrollProgress * -25}px)`
                }}
              >
                <button className="px-8 py-3 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-colors text-lg font-medium">
                  Earn LGR with Quests
                </button>
                <button 
                  onClick={() => setShowAuthFlow?.(true)}
                  className="px-8 py-3 bg-white hover:bg-white/90 text-[#8247E5] rounded-lg transition-colors text-lg font-medium"
                >
                  Mint LedgerFren Badge
                </button>
              </div>

              <div 
                className="max-w-md mx-auto"
                style={{
                  opacity: 1 - scrollProgress * 2,
                  transform: `translateY(${scrollProgress * -25}px)`
                }}
              >
                <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
                  <div className="flex justify-center mb-8">
                    <DynamicWidget />
                  </div>
                  <WalletInfo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const zeroDevConfig = {
  bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
  paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
};

const Index = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "2b74d425-6827-4ff1-af57-f9543d71cca0",
        walletConnectors: [
          EthereumWalletConnectors,
          ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
        ],
      }}
    >
      <div className="min-h-screen bg-black overflow-hidden relative">
        <Nav />
        <IndexContent />
      </div>
    </DynamicContextProvider>
  );
};

export default Index;
