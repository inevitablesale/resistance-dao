
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
          {/* Deep Space Base Layer */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #0B0B0F 0%, #1A1A2F 40%, #1F1F3F 100%)',
              opacity: 0.98
            }}
          />
          
          {/* Enhanced Nebula Layer */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/lovable-uploads/4b887efe-6a76-44c3-870a-df8185740314.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
              mixBlendMode: 'screen'
            }}
          />

          {/* Detailed Planet */}
          <div className="absolute top-20 right-40">
            <div 
              className="w-64 h-64 relative"
              style={{
                background: `
                  radial-gradient(circle at 40% 40%, 
                    #8B4513 0%,    /* Dark landmass base */
                    #228B22 20%,   /* Forest regions */
                    #1E90FF 40%,   /* Ocean areas */
                    #4682B4 60%,   /* Deeper waters */
                    #191970 85%,   /* Deep atmosphere */
                    #000033 100%   /* Space edge */
                  )
                `,
                borderRadius: '50%',
                transform: 'scale(1.5)',
                opacity: 0.95,
                boxShadow: `
                  inset -15px -15px 40px rgba(0,0,0,0.8),
                  inset 5px 5px 40px rgba(255,255,255,0.4),
                  0 0 60px rgba(135,206,250,0.2)
                `
              }}
            >
              {/* Atmosphere Glow */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(173,216,230,0.15) 0%, transparent 60%)',
                  filter: 'blur(8px)'
                }}
              />
              
              {/* Surface Features */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: `
                    radial-gradient(circle at 60% 60%, rgba(34,139,34,0.3) 0%, transparent 30%),
                    radial-gradient(circle at 30% 70%, rgba(0,191,255,0.2) 0%, transparent 40%),
                    radial-gradient(circle at 70% 30%, rgba(139,69,19,0.4) 0%, transparent 35%)
                  `,
                  opacity: 0.8
                }}
              />

              {/* City Lights (dark side) */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 80% 80%, rgba(255,250,205,0.15) 0%, transparent 40%)',
                  filter: 'blur(2px)'
                }}
              />

              {/* Landing Zone Indicators */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: `
                    radial-gradient(circle at 45% 45%, rgba(255,215,0,0.2) 0%, transparent 5%),
                    radial-gradient(circle at 55% 55%, rgba(255,215,0,0.2) 0%, transparent 5%)
                  `,
                  animation: 'pulse 2s infinite'
                }}
              />
            </div>
          </div>
          
          {/* Enhanced Refugee Fleet */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large Command Ship */}
            <div className="absolute animate-landing-approach-1">
              <div 
                className="relative"
                style={{
                  width: '160px',
                  height: '50px',
                  background: '#403E43',
                  clipPath: 'polygon(0% 50%, 15% 20%, 85% 20%, 100% 50%, 85% 80%, 15% 80%)',
                  boxShadow: '0 0 20px rgba(255,69,0,0.3)'
                }}
              >
                {/* Hull Details */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(90deg, 
                        rgba(62,58,63,0.8) 0%,
                        rgba(142,145,150,0.4) 50%,
                        rgba(62,58,63,0.8) 100%
                      )
                    `
                  }}
                />

                {/* Cargo Modules */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{
                        background: '#8E9196',
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)'
                      }}
                    />
                  ))}
                </div>

                {/* Heat Shield Glow */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1/4"
                  style={{
                    background: 'linear-gradient(0deg, rgba(255,69,0,0.3) 0%, transparent 100%)',
                    animation: 'pulse 2s infinite'
                  }}
                />

                {/* Engine Array */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className="relative"
                      style={{
                        width: '20px',
                        height: '8px',
                        background: 'radial-gradient(circle at right, rgba(255,140,0,0.8), transparent 70%)',
                        filter: 'blur(2px)',
                        animation: 'enginePulse 1.5s infinite'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Medium Transport */}
            <div className="absolute animate-landing-approach-2">
              <div 
                className="relative"
                style={{
                  width: '120px',
                  height: '40px',
                  background: '#8E9196',
                  clipPath: 'polygon(0% 50%, 20% 20%, 80% 20%, 100% 50%, 80% 80%, 20% 80%)',
                  boxShadow: '0 0 15px rgba(255,69,0,0.2)'
                }}
              >
                {/* Hull Damage */}
                <div 
                  className="absolute top-1/3 left-1/4 w-1/6 h-1/3"
                  style={{
                    background: '#403E43',
                    clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'
                  }}
                />

                {/* Engine Array */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="relative"
                      style={{
                        width: '15px',
                        height: '6px',
                        background: 'radial-gradient(circle at right, rgba(255,140,0,0.7), transparent 70%)',
                        filter: 'blur(1.5px)',
                        animation: 'enginePulse 1.8s infinite'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Small Scout Ship */}
            <div className="absolute animate-landing-approach-3">
              <div 
                className="relative"
                style={{
                  width: '80px',
                  height: '30px',
                  background: '#9F9EA1',
                  clipPath: 'polygon(0% 50%, 25% 20%, 75% 20%, 100% 50%, 75% 80%, 25% 80%)',
                  boxShadow: '0 0 10px rgba(255,69,0,0.15)'
                }}
              >
                {/* Emergency Thruster */}
                <div 
                  className="absolute -right-2 top-1/2 -translate-y-1/2"
                  style={{
                    width: '12px',
                    height: '5px',
                    background: 'radial-gradient(circle at right, rgba(255,140,0,0.6), transparent 70%)',
                    filter: 'blur(1px)',
                    animation: 'enginePulse 2s infinite'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Star Field with Depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: Array.from({length: 3}, (_, i) => 
                Array.from({length: 100}, () => 
                  `radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 255, 255, ${0.3 - i * 0.1}) 0%, transparent 100%)`
                ).join(',')
              ).join(','),
              opacity: 0.8
            }}
          />
          
          {/* Landing Zone Atmospheric Glow */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 70% 30%, rgba(173,216,230,0.1) 0%, transparent 60%)',
              mixBlendMode: 'screen'
            }}
          />
          
          {/* Animation Keyframes */}
          <style>
            {`
              @keyframes enginePulse {
                0%, 100% { opacity: 0.6; transform: scaleX(1); }
                50% { opacity: 1; transform: scaleX(1.2); }
              }

              @keyframes landing-approach-1 {
                0% { transform: translate(-160px, 20vh) rotate(-5deg); }
                100% { transform: translate(calc(70vw), 30vh) rotate(15deg); }
              }

              @keyframes landing-approach-2 {
                0% { transform: translate(-120px, 30vh) rotate(-8deg); }
                100% { transform: translate(calc(65vw), 35vh) rotate(18deg); }
              }

              @keyframes landing-approach-3 {
                0% { transform: translate(-80px, 40vh) rotate(-10deg); }
                100% { transform: translate(calc(60vw), 40vh) rotate(20deg); }
              }

              .animate-landing-approach-1 {
                animation: landing-approach-1 20s linear infinite;
                animation-delay: 0s;
                will-change: transform;
              }

              .animate-landing-approach-2 {
                animation: landing-approach-2 25s linear infinite;
                animation-delay: 5s;
                will-change: transform;
              }

              .animate-landing-approach-3 {
                animation: landing-approach-3 30s linear infinite;
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
