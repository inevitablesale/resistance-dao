
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
        {/* Deep Space Background with Nebula */}
        <div className="absolute inset-0">
          {/* Base deep space layer */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #0B0B0F 0%, #141420 100%)',
              opacity: 0.92
            }}
          />
          
          {/* Realistic nebula structure inspired by James Webb imagery */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/lovable-uploads/4b887efe-6a76-44c3-870a-df8185740314.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5,
              mixBlendMode: 'screen'
            }}
          />

          {/* Overlay layer for depth and atmosphere */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 50%, rgba(43, 53, 89, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 70% 50%, rgba(89, 43, 69, 0.15) 0%, transparent 60%)
              `,
              mixBlendMode: 'overlay'
            }}
          />
          
          {/* Realistic star field with depth variation */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at ${Array.from({length: 100}, () => 
                  `${Math.random() * 100}% ${Math.random() * 100}%`
                ).join(', ')}, rgba(255, 255, 255, ${Array.from({length: 100}, () => 
                  Math.random() * 0.3 + 0.1
                ).join(')), rgba(255, 255, 255, ')})
              `,
              opacity: 0.8
            }}
          />
          
          {/* Larger focal stars */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: Array.from({length: 12}, () => 
                `radial-gradient(${Math.random() * 2 + 1}px ${Math.random() * 2 + 1}px at ${
                  Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 255, 255, ${
                  Math.random() * 0.4 + 0.3}) 0%, transparent 100%)`
              ).join(','),
              filter: 'blur(0.2px)'
            }}
          />
          
          <style>
            {`
              @keyframes subtleNebula {
                0%, 100% {
                  opacity: 0.5;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.55;
                  transform: scale(1.001);
                }
              }

              @keyframes subtleStars {
                0%, 100% {
                  opacity: 0.8;
                }
                50% {
                  opacity: 0.7;
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
