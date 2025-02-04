
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
        {/* Blockchain Universe Background */}
        <div className="absolute inset-0">
          {/* Deep space base layer */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #1a1f3c 0%, #000000 100%)',
              opacity: 0.95
            }}
          />
          
          {/* Blockchain nodes visualization */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(130, 71, 229, 0.4) 0%, transparent 30%),
                radial-gradient(circle at 80% 70%, rgba(130, 71, 229, 0.3) 0%, transparent 25%),
                radial-gradient(circle at 50% 50%, rgba(130, 71, 229, 0.2) 0%, transparent 35%),
                radial-gradient(circle at 30% 80%, rgba(130, 71, 229, 0.3) 0%, transparent 25%),
                radial-gradient(circle at 70% 20%, rgba(130, 71, 229, 0.35) 0%, transparent 30%)
              `,
              animation: 'pulse 15s ease-in-out infinite alternate'
            }}
          />
          
          {/* Connecting lines between nodes */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 48%, rgba(130, 71, 229, 0.3) 49%, rgba(130, 71, 229, 0.3) 51%, transparent 52%),
                linear-gradient(-45deg, transparent 48%, rgba(130, 71, 229, 0.3) 49%, rgba(130, 71, 229, 0.3) 51%, transparent 52%)
              `,
              backgroundSize: '100px 100px',
              animation: 'moveLines 20s linear infinite'
            }}
          />
          
          {/* Distant star clusters */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.8) 100%, transparent)',
              backgroundSize: '200% 200%',
              animation: 'floatStars 45s ease-in-out infinite'
            }}
          />
          
          {/* Ethereal blockchain connections */}
          <div 
            className="absolute inset-0 mix-blend-screen"
            style={{
              background: `
                radial-gradient(circle at 30% 20%, rgba(130, 71, 229, 0.15) 0%, transparent 45%),
                radial-gradient(circle at 70% 60%, rgba(130, 71, 229, 0.15) 0%, transparent 45%),
                radial-gradient(circle at 50% 40%, rgba(130, 71, 229, 0.1) 0%, transparent 55%)
              `,
              animation: 'etherealPulse 12s ease-in-out infinite alternate'
            }}
          />
          
          {/* Dynamic node pulses */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(2px 2px at 70% 60%, rgba(130, 71, 229, 0.9) 100%, transparent)',
              backgroundSize: '300% 300%',
              animation: 'nodePulse 25s ease-in-out infinite'
            }}
          />
          
          <style>
            {`
              @keyframes pulse {
                0%, 100% {
                  opacity: 0.3;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.5;
                  transform: scale(1.1);
                }
              }

              @keyframes moveLines {
                0% {
                  background-position: 0 0;
                }
                100% {
                  background-position: 100px 100px;
                }
              }

              @keyframes floatStars {
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

              @keyframes etherealPulse {
                0%, 100% {
                  opacity: 0.2;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.4;
                  transform: scale(1.15);
                }
              }

              @keyframes nodePulse {
                0%, 100% {
                  opacity: 0.4;
                  background-size: 300% 300%;
                }
                50% {
                  opacity: 0.7;
                  background-size: 350% 350%;
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
