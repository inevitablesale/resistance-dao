
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
