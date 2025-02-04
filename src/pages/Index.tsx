```typescript
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
        {/* Enhanced Space Background with Deep Atmospheric Effects */}
        <div className="absolute inset-0">
          {/* Base Space Layer */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
              opacity: 0.95
            }}
          />
          
          {/* Atmospheric Cloud Layer using reference image */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/lovable-uploads/a5e158c0-20cc-46ca-9c71-5dfa7741d854.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.8,
              mixBlendMode: 'screen'
            }}
          />

          {/* Golden Atmospheric Glow */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(255, 197, 66, 0.15) 0%, rgba(255, 197, 66, 0) 40%)',
              mixBlendMode: 'overlay'
            }}
          />

          {/* Detailed Planet with Enhanced Surface Features */}
          <div className="absolute top-20 right-40">
            <div 
              className="w-64 h-64 relative"
              style={{
                background: `
                  radial-gradient(circle at 40% 40%,
                    #DAA520 0%,    /* Golden surface base */
                    #B8860B 20%,   /* Darker golden regions */
                    #CD853F 40%,   /* Copper-like areas */
                    #8B4513 60%,   /* Deep surface features */
                    #654321 85%,   /* Shadow regions */
                    #3D2B1F 100%   /* Dark edge */
                  )
                `,
                borderRadius: '50%',
                transform: 'scale(1.5)',
                opacity: 0.95,
                boxShadow: `
                  inset -15px -15px 40px rgba(0,0,0,0.8),
                  inset 5px 5px 40px rgba(255,215,0,0.4),
                  0 0 60px rgba(218,165,32,0.3)
                `
              }}
            >
              {/* Enhanced Atmospheric Layer */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.2) 0%, transparent 60%)',
                  filter: 'blur(8px)'
                }}
              />
              
              {/* Detailed Surface Features */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: `
                    radial-gradient(circle at 60% 60%, rgba(205,133,63,0.3) 0%, transparent 30%),
                    radial-gradient(circle at 30% 70%, rgba(218,165,32,0.2) 0%, transparent 40%),
                    radial-gradient(circle at 70% 30%, rgba(139,69,19,0.4) 0%, transparent 35%)
                  `,
                  opacity: 0.9
                }}
              />

              {/* Enhanced Landing Zone Indicators */}
              <div 
                className="absolute inset-0"
                style={{
                  borderRadius: '50%',
                  background: `
                    radial-gradient(circle at 45% 45%, rgba(255,223,0,0.3) 0%, transparent 5%),
                    radial-gradient(circle at 55% 55%, rgba(255,223,0,0.3) 0%, transparent 5%)
                  `,
                  animation: 'pulse 2s infinite'
                }}
              />
            </div>
          </div>
          
          {/* Enhanced Refugee Fleet with Detailed Ships */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Command Ship with Enhanced Details */}
            <div className="absolute animate-landing-approach-1">
              <div 
                className="relative"
                style={{
                  width: '160px',
                  height: '50px',
                  background: '#CD853F',
                  clipPath: 'polygon(0% 50%, 15% 20%, 85% 20%, 100% 50%, 85% 80%, 15% 80%)',
                  boxShadow: '0 0 20px rgba(255,215,0,0.3)'
                }}
              >
                {/* Enhanced Hull Details */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(90deg, 
                        rgba(139,69,19,0.8) 0%,
                        rgba(205,133,63,0.4) 50%,
                        rgba(139,69,19,0.8) 100%
                      )
                    `
                  }}
                />

                {/* Enhanced Heat Shield Effect */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1/4"
                  style={{
                    background: 'linear-gradient(0deg, rgba(255,165,0,0.6) 0%, transparent 100%)',
                    animation: 'pulse 1.5s infinite',
                    filter: 'blur(2px)'
                  }}
                />

                {/* Enhanced Engine Array */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className="relative"
                      style={{
                        width: '25px',
                        height: '8px',
                        background: 'radial-gradient(circle at right, rgba(255,215,0,0.9), transparent 70%)',
                        filter: 'blur(1px)',
                        animation: 'enginePulse 1.2s infinite'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Transport Ships with Landing Configuration */}
            {[2, 3].map((index) => (
              <div key={index} className={`absolute animate-landing-approach-${index}`}>
                <div 
                  className="relative"
                  style={{
                    width: index === 2 ? '120px' : '80px',
                    height: index === 2 ? '40px' : '30px',
                    background: '#B8860B',
                    clipPath: 'polygon(0% 50%, 20% 20%, 80% 20%, 100% 50%, 80% 80%, 20% 80%)',
                    boxShadow: `0 0 ${15 - (index * 2)}px rgba(255,215,0,0.2)`
                  }}
                >
                  {/* Ship-specific Heat Shield */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1/3"
                    style={{
                      background: 'linear-gradient(0deg, rgba(255,140,0,0.7) 0%, transparent 100%)',
                      animation: 'pulse 1.8s infinite',
                      filter: 'blur(1px)'
                    }}
                  />

                  {/* Ship-specific Engines */}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    {[...Array(index === 2 ? 3 : 2)].map((_, i) => (
                      <div 
                        key={i}
                        className="relative"
                        style={{
                          width: `${20 - (index * 3)}px`,
                          height: '6px',
                          background: 'radial-gradient(circle at right, rgba(255,215,0,0.8), transparent 70%)',
                          filter: 'blur(1px)',
                          animation: `enginePulse ${1.5 + (index * 0.2)}s infinite`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Star Field with Depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: Array.from({length: 3}, (_, i) => 
                Array.from({length: 150}, () => {
                  const x = Math.random() * 100;
                  const y = Math.random() * 100;
                  const size = Math.random() * 1.5 + 0.5;
                  return `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255, 255, 255, ${0.8 - i * 0.2}) 0%, transparent 100%)`
                }).join(',')
              ).join(','),
              opacity: 0.8
            }}
          />
          
          {/* Enhanced Atmospheric Glow */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 70% 30%, rgba(255,215,0,0.15) 0%, transparent 60%)',
              mixBlendMode: 'soft-light'
            }}
          />
          
          {/* Animation Keyframes with Enhanced Landing Approaches */}
          <style>
            {`
              @keyframes enginePulse {
                0%, 100% { opacity: 0.7; transform: scaleX(1); }
                50% { opacity: 1; transform: scaleX(1.3); }
              }

              @keyframes landing-approach-1 {
                0% { transform: translate(-160px, 40vh) rotate(-15deg); }
                100% { transform: translate(calc(65vw), 35vh) rotate(25deg); }
              }

              @keyframes landing-approach-2 {
                0% { transform: translate(-120px, 45vh) rotate(-18deg); }
                100% { transform: translate(calc(60vw), 40vh) rotate(28deg); }
              }

              @keyframes landing-approach-3 {
                0% { transform: translate(-80px, 50vh) rotate(-20deg); }
                100% { transform: translate(calc(55vw), 45vh) rotate(30deg); }
              }

              .animate-landing-approach-1 {
                animation: landing-approach-1 20s linear infinite;
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
```
