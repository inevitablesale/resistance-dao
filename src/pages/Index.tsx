
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
        {/* Enhanced Space Background */}
        <div className="absolute inset-0">
          {/* Base gradient layer with enhanced colors */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #000000 0%, #1a1305 40%, #3d2f0c 100%)',
              opacity: 0.95
            }}
          />
          
          {/* Enhanced Nebula layer */}
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

          {/* Enhanced Planet with detailed features */}
          <div className="absolute top-20 right-40">
            <div 
              className="w-64 h-64 relative"
              style={{
                background: 'radial-gradient(circle at 40% 40%, #cfab67 0%, #7c571e 60%, #2b1d0a 100%)',
                borderRadius: '50%',
                transform: 'scale(1.5)',
                opacity: 0.9,
                boxShadow: `
                  inset -10px -10px 50px rgba(0,0,0,0.8),
                  0 0 50px rgba(207, 171, 103, 0.3)
                `
              }}
            >
              {/* Atmospheric glow */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                  filter: 'blur(8px)'
                }}
              />
              
              {/* Surface details */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: `
                    radial-gradient(circle at 70% 70%, #8b5e1f 0%, transparent 20%),
                    radial-gradient(circle at 30% 30%, #d4b36a 0%, transparent 30%),
                    radial-gradient(circle at 50% 50%, #95642c 0%, transparent 40%)
                  `,
                  opacity: 0.7
                }}
              />

              {/* City lights (dark side) */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 80% 80%, rgba(255, 240, 200, 0.15) 0%, transparent 30%)',
                  filter: 'blur(3px)'
                }}
              />
            </div>
          </div>
          
          {/* Enhanced Spacecraft Fleet */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large Refugee Ship */}
            <div className="absolute animate-spaceship-1">
              {/* Main Hull */}
              <div 
                className="relative"
                style={{
                  width: '120px',
                  height: '40px',
                  background: '#403E43',
                  clipPath: 'polygon(0% 50%, 20% 20%, 80% 20%, 100% 50%, 80% 80%, 20% 80%)',
                  boxShadow: '0 0 15px rgba(207, 171, 103, 0.3)'
                }}
              >
                {/* Cargo Modules */}
                <div 
                  className="absolute"
                  style={{
                    top: '25%',
                    left: '30%',
                    width: '40%',
                    height: '50%',
                    background: '#8E9196',
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)'
                  }}
                />
                
                {/* Communication Array */}
                <div 
                  className="absolute"
                  style={{
                    top: '-30%',
                    left: '60%',
                    width: '4px',
                    height: '20px',
                    background: '#9F9EA1',
                    transform: 'rotate(-15deg)'
                  }}
                />
                
                {/* Engine Exhausts */}
                <div className="absolute right-0 flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="relative"
                      style={{
                        width: '15px',
                        height: '6px',
                        background: 'radial-gradient(circle at right, rgba(207, 171, 103, 0.8), transparent 70%)',
                        transform: 'translateX(100%)',
                        filter: 'blur(2px)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Medium Refugee Ship */}
            <div className="absolute animate-spaceship-2">
              {/* Main Hull */}
              <div 
                className="relative"
                style={{
                  width: '90px',
                  height: '30px',
                  background: '#8E9196',
                  clipPath: 'polygon(0% 50%, 30% 20%, 70% 20%, 100% 50%, 70% 80%, 30% 80%)',
                  boxShadow: '0 0 10px rgba(207, 171, 103, 0.2)'
                }}
              >
                {/* Emergency Repairs */}
                <div 
                  className="absolute"
                  style={{
                    top: '40%',
                    left: '50%',
                    width: '20px',
                    height: '10px',
                    background: '#C8C8C9',
                    transform: 'rotate(-45deg)'
                  }}
                />
                
                {/* Engine Exhausts */}
                <div className="absolute right-0 flex space-x-1">
                  {[...Array(2)].map((_, i) => (
                    <div 
                      key={i}
                      className="relative"
                      style={{
                        width: '12px',
                        height: '5px',
                        background: 'radial-gradient(circle at right, rgba(207, 171, 103, 0.6), transparent 70%)',
                        transform: 'translateX(100%)',
                        filter: 'blur(1px)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Small Refugee Ship */}
            <div className="absolute animate-spaceship-3">
              {/* Main Hull */}
              <div 
                className="relative"
                style={{
                  width: '60px',
                  height: '24px',
                  background: '#9F9EA1',
                  clipPath: 'polygon(0% 50%, 25% 20%, 75% 20%, 100% 50%, 75% 80%, 25% 80%)',
                  boxShadow: '0 0 8px rgba(207, 171, 103, 0.15)'
                }}
              >
                {/* Distress Beacon */}
                <div 
                  className="absolute"
                  style={{
                    top: '-20%',
                    left: '70%',
                    width: '4px',
                    height: '8px',
                    background: '#ff4444',
                    animation: 'pulse 2s infinite'
                  }}
                />
                
                {/* Engine Exhaust */}
                <div 
                  className="absolute right-0"
                  style={{
                    width: '10px',
                    height: '4px',
                    background: 'radial-gradient(circle at right, rgba(207, 171, 103, 0.5), transparent 70%)',
                    transform: 'translateX(100%)',
                    filter: 'blur(1px)'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Enhanced Star Field */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at ${Array.from({length: 200}, () => 
                  `${Math.random() * 100}% ${Math.random() * 100}%`
                ).join(', ')}, rgba(255, 255, 255, ${Array.from({length: 200}, () => 
                  Math.random() * 0.4 + 0.1
                ).join(')), rgba(255, 255, 255, ')})
              `,
              opacity: 0.6
            }}
          />
          
          {/* Enhanced Atmospheric Glow */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 80%, rgba(255, 200, 100, 0.15) 0%, transparent 60%)',
              mixBlendMode: 'screen'
            }}
          />
          
          {/* Animation Styles */}
          <style>
            {`
              @keyframes pulse {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
              }

              @keyframes spaceship1 {
                0% { transform: translate(-120px, 100vh) rotate(-15deg); }
                100% { transform: translate(calc(100vw + 120px), -100px) rotate(15deg); }
              }

              @keyframes spaceship2 {
                0% { transform: translate(-90px, 70vh) rotate(-20deg); }
                100% { transform: translate(calc(100vw + 90px), 100px) rotate(20deg); }
              }

              @keyframes spaceship3 {
                0% { transform: translate(-60px, 40vh) rotate(-25deg); }
                100% { transform: translate(calc(100vw + 60px), 300px) rotate(25deg); }
              }

              .animate-spaceship-1 {
                top: 30%;
                left: -120px;
                animation: spaceship1 20s linear infinite;
                will-change: transform;
              }

              .animate-spaceship-2 {
                top: 45%;
                left: -90px;
                animation: spaceship2 25s linear infinite;
                animation-delay: 5s;
                will-change: transform;
              }

              .animate-spaceship-3 {
                top: 60%;
                left: -60px;
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
