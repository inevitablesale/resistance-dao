
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
        {/* Immersive James Webb-inspired cosmic background */}
        <div className="absolute inset-0">
          {/* Deep space base layer with enhanced depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #1A1F2C 0%, #000000 100%)',
              opacity: 0.95
            }}
          />
          
          {/* Intense nebula formations */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(155, 135, 245, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 60%)
              `
            }}
          />
          
          {/* Distant star clusters */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.8) 100%, transparent)',
              backgroundSize: '150% 150%',
              animation: 'space 45s ease-in-out infinite'
            }}
          />
          
          {/* Brighter foreground stars */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(2px 2px at 70% 60%, rgba(255, 255, 255, 0.9) 100%, transparent)',
              backgroundSize: '200% 200%',
              animation: 'space 35s ease-in-out infinite reverse'
            }}
          />

          {/* Dynamic cosmic dust */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(1px 1px at 40% 40%, rgba(214, 188, 250, 0.7) 100%, transparent)',
              backgroundSize: '300% 300%',
              animation: 'space 55s ease-in-out infinite alternate'
            }}
          />

          {/* Ethereal glow effects */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 45%),
                radial-gradient(circle at 70% 60%, rgba(30, 174, 219, 0.15) 0%, transparent 45%)
              `,
              animation: 'pulse 12s ease-in-out infinite alternate'
            }}
          />

          {/* Webb telescope infrared visualization effect */}
          <div 
            className="absolute inset-0 mix-blend-screen"
            style={{
              background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.03) 0%, transparent 70%)',
              animation: 'pulse 8s ease-in-out infinite alternate-reverse'
            }}
          />
          
          <style>
            {`
              @keyframes space {
                0%, 100% {
                  opacity: 0.8;
                  transform: scale(1) rotate(0deg);
                  background-position: 0% 0%;
                }
                25% {
                  opacity: 1;
                  background-position: 50% 50%;
                }
                50% {
                  opacity: 0.7;
                  transform: scale(1.2) rotate(1deg);
                  background-position: 100% 100%;
                }
                75% {
                  opacity: 0.9;
                  background-position: 25% 75%;
                }
              }

              @keyframes pulse {
                0%, 100% {
                  opacity: 0.2;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.4;
                  transform: scale(1.1);
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
