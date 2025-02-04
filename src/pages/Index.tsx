
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
        {/* Enhanced James Webb-inspired Space Background */}
        <div className="absolute inset-0">
          {/* Deep space base layer - darker and more contrasted */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #1a0f2e 0%, #000000 100%)',
              opacity: 0.98
            }}
          />
          
          {/* Enhanced nebulae and cosmic dust with more vibrant colors */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, rgba(255, 147, 92, 0.35) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(130, 71, 229, 0.4) 0%, transparent 55%),
                radial-gradient(circle at 50% 50%, rgba(86, 42, 168, 0.35) 0%, transparent 65%),
                radial-gradient(circle at 20% 30%, rgba(255, 124, 64, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 80% 20%, rgba(130, 71, 229, 0.35) 0%, transparent 55%)
              `,
              animation: 'nebulaPulse 25s ease-in-out infinite alternate',
              mixBlendMode: 'screen'
            }}
          />
          
          {/* High-definition star clusters with increased density */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(2px 2px at 10% 10%, rgba(255, 255, 255, 1) 100%, transparent),
                radial-gradient(2.5px 2.5px at 20% 20%, rgba(255, 255, 255, 0.9) 100%, transparent),
                radial-gradient(2px 2px at 30% 30%, rgba(255, 255, 255, 1) 100%, transparent),
                radial-gradient(3px 3px at 40% 40%, rgba(255, 255, 255, 0.9) 100%, transparent),
                radial-gradient(2.5px 2.5px at 50% 50%, rgba(255, 255, 255, 1) 100%, transparent),
                radial-gradient(2px 2px at 60% 60%, rgba(255, 255, 255, 0.9) 100%, transparent),
                radial-gradient(3px 3px at 70% 70%, rgba(255, 255, 255, 1) 100%, transparent),
                radial-gradient(2.5px 2.5px at 80% 80%, rgba(255, 255, 255, 0.9) 100%, transparent),
                radial-gradient(2px 2px at 90% 90%, rgba(255, 255, 255, 1) 100%, transparent)
              `,
              backgroundSize: '300% 300%',
              animation: 'starFloat 60s ease-in-out infinite',
              opacity: 0.9
            }}
          />
          
          {/* Enhanced ethereal glow and cosmic rays with increased intensity */}
          <div 
            className="absolute inset-0 mix-blend-screen"
            style={{
              background: `
                radial-gradient(circle at 40% 30%, rgba(255, 147, 92, 0.25) 0%, transparent 65%),
                radial-gradient(circle at 60% 70%, rgba(130, 71, 229, 0.25) 0%, transparent 65%),
                radial-gradient(circle at 50% 50%, rgba(86, 42, 168, 0.2) 0%, transparent 75%)
              `,
              animation: 'cosmicGlow 20s ease-in-out infinite alternate'
            }}
          />
          
          {/* Distant galaxies with enhanced visibility */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(3px 3px at 25% 35%, rgba(255, 187, 132, 0.8) 100%, transparent),
                radial-gradient(3px 3px at 75% 65%, rgba(170, 111, 229, 0.8) 100%, transparent),
                radial-gradient(3px 3px at 50% 50%, rgba(126, 82, 208, 0.8) 100%, transparent)
              `,
              backgroundSize: '200% 200%',
              animation: 'galaxyPulse 40s ease-in-out infinite',
              opacity: 0.8
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
                  opacity: 0.8;
                  transform: scale(1.05);
                }
              }

              @keyframes starFloat {
                0%, 100% {
                  opacity: 0.9;
                  transform: scale(1) rotate(0deg);
                  background-position: 0% 0%;
                }
                25% {
                  opacity: 1;
                  background-position: 50% 50%;
                }
                50% {
                  opacity: 0.8;
                  transform: scale(1.1) rotate(0.5deg);
                  background-position: 100% 100%;
                }
                75% {
                  opacity: 1;
                  background-position: 25% 75%;
                }
              }

              @keyframes cosmicGlow {
                0%, 100% {
                  opacity: 0.5;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.7;
                  transform: scale(1.1);
                }
              }

              @keyframes galaxyPulse {
                0%, 100% {
                  opacity: 0.6;
                  background-size: 200% 200%;
                }
                50% {
                  opacity: 0.8;
                  background-size: 220% 220%;
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
