
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { WalletInfo } from "@/components/WalletInfo";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Nav from "@/components/Nav";

const IndexContent = () => {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  return (
    <>
      <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
          The future of accounting<br />belongs to you
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
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

        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
            <div className="flex justify-center mb-8">
              <DynamicWidget />
            </div>
            <WalletInfo />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Check your eligibility to join the future of accounting
          </p>
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
        {/* Sepia Space Background */}
        <div className="absolute inset-0">
          {/* Base gradient layer */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #000000 0%, #1a1305 40%, #3d2f0c 100%)',
              opacity: 0.95
            }}
          />
          
          {/* Cloud layer */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/lovable-uploads/4b887efe-6a76-44c3-870a-df8185740314.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.4,
              filter: 'sepia(100%) brightness(0.7) contrast(1.2)',
              mixBlendMode: 'screen'
            }}
          />

          {/* Planet */}
          <div 
            className="absolute top-20 right-40 w-64 h-64"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #cfab67 0%, #7c571e 60%, #2b1d0a 100%)',
              borderRadius: '50%',
              boxShadow: 'inset -10px -10px 50px rgba(0,0,0,0.8)',
              transform: 'scale(1.5)',
              opacity: 0.9
            }}
          />
          
          {/* Spaceships */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large Spaceship */}
            <div
              className="absolute animate-spaceship-1"
              style={{
                width: '60px',
                height: '24px',
                background: '#403E43',
                clipPath: 'polygon(0% 50%, 20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%)',
                boxShadow: '0 0 15px rgba(207, 171, 103, 0.3)',
                animation: 'spaceship1 20s linear infinite'
              }}
            >
              <div 
                className="absolute right-0 w-3 h-2"
                style={{
                  background: 'radial-gradient(circle at right, rgba(207, 171, 103, 0.8), transparent 70%)',
                  transform: 'translateX(100%)',
                  filter: 'blur(2px)'
                }}
              />
            </div>

            {/* Medium Spaceship */}
            <div
              className="absolute animate-spaceship-2"
              style={{
                width: '40px',
                height: '16px',
                background: '#8E9196',
                clipPath: 'polygon(0% 50%, 30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%)',
                boxShadow: '0 0 10px rgba(207, 171, 103, 0.2)',
                animation: 'spaceship2 25s linear infinite'
              }}
            >
              <div 
                className="absolute right-0 w-2 h-1.5"
                style={{
                  background: 'radial-gradient(circle at right, rgba(207, 171, 103, 0.6), transparent 70%)',
                  transform: 'translateX(100%)',
                  filter: 'blur(1px)'
                }}
              />
            </div>

            {/* Small Spaceship */}
            <div
              className="absolute animate-spaceship-3"
              style={{
                width: '30px',
                height: '12px',
                background: '#9F9EA1',
                clipPath: 'polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)',
                boxShadow: '0 0 8px rgba(207, 171, 103, 0.15)',
                animation: 'spaceship3 30s linear infinite'
              }}
            >
              <div 
                className="absolute right-0 w-1.5 h-1"
                style={{
                  background: 'radial-gradient(circle at right, rgba(207, 171, 103, 0.5), transparent 70%)',
                  transform: 'translateX(100%)',
                  filter: 'blur(1px)'
                }}
              />
            </div>
          </div>
          
          {/* Stars layer */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at ${Array.from({length: 150}, () => 
                  `${Math.random() * 100}% ${Math.random() * 100}%`
                ).join(', ')}, rgba(255, 255, 255, ${Array.from({length: 150}, () => 
                  Math.random() * 0.4 + 0.1
                ).join(')), rgba(255, 255, 255, ')})
              `,
              opacity: 0.6
            }}
          />
          
          {/* Atmospheric glow */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 80%, rgba(255, 200, 100, 0.15) 0%, transparent 60%)',
              mixBlendMode: 'screen'
            }}
          />
          
          <style>
            {`
              @keyframes twinkle {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 0.8; }
              }
              
              @keyframes cloudDrift {
                0% { transform: translateX(0) scale(1); }
                50% { transform: translateX(-1%) scale(1.01); }
                100% { transform: translateX(0) scale(1); }
              }

              @keyframes spaceship1 {
                0% { transform: translate(-100px, 100vh) rotate(-15deg); }
                100% { transform: translate(calc(100vw + 100px), -100px) rotate(15deg); }
              }

              @keyframes spaceship2 {
                0% { transform: translate(-80px, 70vh) rotate(-20deg); }
                100% { transform: translate(calc(100vw + 80px), 100px) rotate(20deg); }
              }

              @keyframes spaceship3 {
                0% { transform: translate(-60px, 40vh) rotate(-25deg); }
                100% { transform: translate(calc(100vw + 60px), 300px) rotate(25deg); }
              }

              .animate-spaceship-1 {
                top: 30%;
                left: -60px;
                animation: spaceship1 20s linear infinite;
                will-change: transform;
              }

              .animate-spaceship-2 {
                top: 45%;
                left: -40px;
                animation: spaceship2 25s linear infinite;
                animation-delay: 5s;
                will-change: transform;
              }

              .animate-spaceship-3 {
                top: 60%;
                left: -30px;
                animation: spaceship3 30s linear infinite;
                animation-delay: 10s;
                will-change: transform;
              }
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
