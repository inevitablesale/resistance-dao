
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
        {/* Hand-drawn Artistic Space Background */}
        <div className="absolute inset-0">
          {/* Deep space base with a subtle texture */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #080C17 0%, #0A0F1F 100%)',
              opacity: 0.98,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundBlendMode: 'soft-light',
              filter: 'contrast(120%) brightness(80%)'
            }}
          />
          
          {/* Distant nebulae and cosmic structures with realistic textures */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(67, 54, 44, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 60% 40%, rgba(51, 41, 34, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(46, 37, 31, 0.06) 0%, transparent 50%)
              `,
              mixBlendMode: 'color-dodge',
              animation: 'nebulaPulse 60s ease-in-out infinite alternate'
            }}
          />
          
          {/* Detailed nebula structures with hand-drawn feel */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(1200px 800px at 40% 40%, rgba(82, 65, 52, 0.06) 0%, transparent 50%),
                radial-gradient(1000px 600px at 60% 30%, rgba(71, 56, 45, 0.05) 0%, transparent 50%),
                radial-gradient(800px 1000px at 20% 70%, rgba(61, 48, 39, 0.06) 0%, transparent 50%)
              `,
              mixBlendMode: 'screen',
              animation: 'nebulaGlow 75s ease-in-out infinite alternate'
            }}
          />
          
          {/* Realistic star field with varied sizes and brightness */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at ${Array.from({length: 200}, () => 
                  `${Math.random() * 100}% ${Math.random() * 100}%`
                ).join(', ')}, rgba(255, 255, 255, ${Array.from({length: 200}, () => 
                  Math.random() * 0.5 + 0.3
                ).join(')), rgba(255, 255, 255, ')})
              `,
              opacity: 0.8,
              animation: 'starTwinkle 90s ease-in-out infinite'
            }}
          />
          
          {/* Bright focal stars with realistic glow */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: Array.from({length: 15}, () => 
                `radial-gradient(${Math.random() * 2 + 1}px ${Math.random() * 2 + 1}px at ${
                  Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 255, 255, ${
                  Math.random() * 0.3 + 0.6}) 0%, transparent 100%)`
              ).join(','),
              filter: 'blur(0.2px)',
              animation: 'starGlow 80s ease-in-out infinite alternate'
            }}
          />
          
          <style>
            {`
              @keyframes nebulaPulse {
                0%, 100% {
                  opacity: 0.6;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.7;
                  transform: scale(1.005);
                }
              }

              @keyframes nebulaGlow {
                0%, 100% {
                  opacity: 0.5;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.6;
                  transform: scale(1.01);
                }
              }

              @keyframes starTwinkle {
                0%, 100% {
                  opacity: 0.8;
                }
                50% {
                  opacity: 0.6;
                }
              }

              @keyframes starGlow {
                0%, 100% {
                  opacity: 0.7;
                  filter: blur(0.2px);
                }
                50% {
                  opacity: 0.9;
                  filter: blur(0.3px);
                }
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
