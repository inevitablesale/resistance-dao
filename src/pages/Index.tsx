
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
        {/* Animated universe background */}
        <div className="absolute inset-0">
          {/* Background gradient */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(31,41,55,1) 0%, rgba(0,0,0,1) 100%)'
            }}
          />
          
          {/* Stars layer 1 - Small fast-moving stars */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(1px 1px at 50% 50%, white 100%, transparent)',
              backgroundSize: '100% 100%',
              transform: 'translateZ(0)',
              animation: 'space 8s ease-in-out infinite alternate'
            }}
          />
          
          {/* Stars layer 2 - Medium stars */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(2px 2px at 40% 60%, rgba(255,255,255,0.7) 100%, transparent)',
              backgroundSize: '200% 200%',
              animation: 'space 12s ease-in-out infinite alternate-reverse'
            }}
          />
          
          {/* Stars layer 3 - Large slow-moving stars */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(3px 3px at 60% 40%, rgba(255,255,255,0.9) 100%, transparent)',
              backgroundSize: '300% 300%',
              animation: 'space 20s ease-in-out infinite'
            }}
          />

          {/* Nebula effects */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(130,71,229,0.2), transparent 60%)'
            }}
          />
          
          <style>
            {`
              @keyframes space {
                0%, 100% {
                  opacity: 0.5;
                  transform: scale(1) rotate(0deg);
                  background-position: 0% 0%;
                }
                25% {
                  opacity: 0.7;
                  background-position: 50% 50%;
                }
                50% {
                  opacity: 0.3;
                  transform: scale(1.2) rotate(1deg);
                  background-position: 100% 100%;
                }
                75% {
                  opacity: 0.6;
                  background-position: 50% 50%;
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
