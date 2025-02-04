```typescript
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { WalletInfo } from "@/components/WalletInfo";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useInView } from "react-intersection-observer";
import Nav from "@/components/Nav";

const IndexContent = () => {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
          The future of accounting<br />belongs to you
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
        </p>
      </div>

      {/* Story Sections */}
      <div className="max-w-4xl mx-auto space-y-32 px-4 mb-32">
        <section className="text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Revolutionizing Professional Services</h2>
          <p className="text-lg text-gray-300">
            Traditional accounting firms are being transformed through blockchain technology, 
            creating new opportunities for licensed professionals to participate in ownership 
            and governance.
          </p>
        </section>

        <section className="text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Earn Through Contribution</h2>
          <p className="text-lg text-gray-300">
            Complete quests, contribute your expertise, and earn LGR tokens. 
            These tokens represent your stake in the future of decentralized accounting.
          </p>
        </section>

        <section className="text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Join the Movement</h2>
          <p className="text-lg text-gray-300">
            Your LedgerFren Badge is more than just a token - it's your passport to 
            participating in the governance of next-generation accounting firms.
          </p>
        </section>
      </div>

      {/* Final Landing Zone Section */}
      <div 
        ref={sectionRef}
        className="max-w-5xl mx-auto px-4 py-24 text-center"
      >
        <div 
          className={`transition-all duration-1000 transform ${
            inView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 mb-12">
            <div className="flex justify-center mb-8">
              <DynamicWidget />
            </div>
            <WalletInfo />
          </div>

          <p className="text-xl text-gray-300 mb-8">
            Ready to shape the future of accounting? Your journey starts here.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <button 
              className="w-full md:w-auto px-8 py-4 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-all duration-300 text-lg font-medium transform hover:scale-105 hover:shadow-lg hover:shadow-[#8247E5]/20"
            >
              Earn LGR with Quests
            </button>
            <button 
              onClick={() => setShowAuthFlow?.(true)}
              className="w-full md:w-auto px-8 py-4 bg-white hover:bg-white/90 text-[#8247E5] rounded-lg transition-all duration-300 text-lg font-medium transform hover:scale-105 hover:shadow-lg"
            >
              Mint LedgerFren Badge
            </button>
          </div>
        </div>
      </div>
    </>
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
        {/* Enhanced Space Background with Advanced Ships */}
        <div className="absolute inset-0">
          {/* Deep space base with quantum field effects */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)',
              opacity: 0.98
            }}
          />
          
          {/* Quantum probability waves */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)
              `,
              animation: 'quantumField 30s ease-in-out infinite'
            }}
          />
          
          {/* Enhanced star field with temporal wake effects */}
          <div 
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(2px 2px at 20% 20%, rgba(0, 255, 255, 0.7) 100%, transparent),
                radial-gradient(1.5px 1.5px at 30% 30%, rgba(147, 51, 255, 0.8) 100%, transparent),
                radial-gradient(2px 2px at 40% 40%, rgba(64, 156, 255, 0.6) 100%, transparent)
              `,
              backgroundSize: '400% 400%',
              animation: 'starField 240s ease-in-out infinite'
            }}
          />
          
          {/* The Ark - Flagship with Quantum Core */}
          <div className="absolute w-96 h-96 left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/4">
            {/* Quantum Core */}
            <div 
              className="absolute w-32 h-32 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at center,
                    rgba(147, 51, 255, 0.9) 0%,
                    rgba(64, 156, 255, 0.8) 30%,
                    rgba(0, 255, 255, 0.7) 60%,
                    transparent 100%
                  )
                `,
                animation: 'pulseCore 4s ease-in-out infinite',
                boxShadow: '0 0 60px rgba(147, 51, 255, 0.4)'
              }}
            />
            
            {/* Toroidal Structure */}
            <div 
              className="absolute w-full h-full left-0 top-0"
              style={{
                transform: 'rotate3d(1, 0.2, 0.1, 60deg)',
                animation: 'rotateTorus 20s linear infinite'
              }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={`ring-${i}`}
                  className="absolute w-full h-full left-0 top-0"
                  style={{
                    transform: `rotate(${i * 45}deg)`,
                    border: '2px solid rgba(64, 156, 255, 0.5)',
                    borderRadius: '50%',
                    animation: `pulseRing ${3 + i * 0.5}s ease-in-out infinite`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Guardian Escorts Formation */}
          {[...Array(6)].map((_, index) => (
            <div
              key={`guardian-${index}`}
              className="absolute"
              style={{
                width: '120px',
                height: '40px',
                left: `${35 + (index % 3) * 15}%`,
                top: `${30 + Math.floor(index / 3) * 20}%`,
                transform: 'rotate(-15deg)',
                animation: `guardianFlight${index + 1} 10s ease-in-out infinite`
              }}
            >
              {/* Guardian Ship Body */}
              <div
                className="w-full h-full relative"
                style={{
                  background: `linear-gradient(45deg, 
                    rgba(64, 156, 255, 0.9) 0%,
                    rgba(147, 51, 255, 0.8) 50%,
                    rgba(0, 255, 255, 0.7) 100%
                  )`,
                  clipPath: 'polygon(0 50%, 20% 0, 80% 0, 100% 50%, 80% 100%, 20% 100%)',
                  boxShadow: '0 0 30px rgba(64, 156, 255, 0.3)'
                }}
              />
              
              {/* Quantum Shield Effect */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(147, 51, 255, 0.2) 50%, transparent 100%)',
                  animation: 'shieldPulse 2s ease-in-out infinite'
                }}
              />
            </div>
          ))}
          
          <style>
            {`
              @keyframes pulseCore {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
              }

              @keyframes pulseRing {
                0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
                50% { transform: scale(1.02) rotate(180deg); opacity: 0.8; }
              }

              @keyframes rotateTorus {
                0% { transform: rotate3d(1, 0.2, 0.1, 60deg) rotateZ(0deg); }
                100% { transform: rotate3d(1, 0.2, 0.1, 60deg) rotateZ(360deg); }
              }

              @keyframes shieldPulse {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 0.4; }
              }

              @keyframes starField {
                0%, 100% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
              }

              @keyframes quantumField {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.1); opacity: 0.9; }
              }

              ${[...Array(6)].map((_, i) => `
                @keyframes guardianFlight${i + 1} {
                  0%, 100% { transform: translate(0, 0) rotate(-15deg); }
                  50% { transform: translate(${(i % 3 - 1) * 20}px, ${(Math.floor(i / 3) - 0.5) * 20}px) rotate(-15deg); }
                }
              `).join('\n')}
            `}
          </style>
        </div>
        
        <Nav />
        
        <div className="container mx-auto px-4 relative z-10">
          <IndexContent />
        </div>
      </div>
    </DynamicContextProvider>
  );
};

export default Index;
```
