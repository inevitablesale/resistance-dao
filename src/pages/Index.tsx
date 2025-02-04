
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
        {/* Enhanced Space Background with Realistic Ships */}
        <div className="absolute inset-0">
          {/* Deep space base with proper atmospheric glow */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)',
              opacity: 0.98
            }}
          />
          
          {/* Planet atmosphere and surface details */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 70%, rgba(51, 153, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(51, 153, 255, 0.1) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(51, 153, 255, 0.05) 0%, transparent 55%)
              `,
              animation: 'atmosphereGlow 30s ease-in-out infinite'
            }}
          />
          
          {/* Realistic star field with depth */}
          <div 
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(1.5px 1.5px at 20% 20%, rgba(255, 255, 255, 0.7) 100%, transparent),
                radial-gradient(1px 1px at 30% 30%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(2px 2px at 40% 40%, rgba(255, 255, 255, 0.6) 100%, transparent),
                radial-gradient(1.5px 1.5px at 50% 50%, rgba(255, 255, 255, 0.7) 100%, transparent)
              `,
              backgroundSize: '400% 400%',
              animation: 'starParallax 240s ease-in-out infinite'
            }}
          />
          
          {/* Refugee ships with engine glow */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="absolute animate-spacecraft"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 8}%`,
                  width: '120px',
                  height: '40px',
                  background: `linear-gradient(45deg, 
                    rgba(255,255,255,0.9) 0%,
                    rgba(200,215,255,0.8) 50%,
                    rgba(150,180,255,0.7) 100%
                  )`,
                  boxShadow: `
                    0 0 20px rgba(51,153,255,0.3),
                    0 0 40px rgba(51,153,255,0.2),
                    0 0 60px rgba(51,153,255,0.1)
                  `,
                  clipPath: 'polygon(0 50%, 20% 0, 90% 0, 100% 50%, 90% 100%, 20% 100%)',
                  transform: 'rotate(-15deg)',
                  animation: `
                    spacecraft${index + 1} ${20 + index * 2}s linear infinite,
                    engineGlow ${1 + index * 0.2}s ease-in-out infinite alternate
                  `
                }}
              />
            ))}
          </div>
          
          <style>
            {`
              @keyframes atmosphereGlow {
                0%, 100% {
                  opacity: 0.7;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.9;
                  transform: scale(1.02);
                }
              }

              @keyframes starParallax {
                0%, 100% {
                  transform: scale(1) rotate(0deg);
                  opacity: 0.8;
                }
                50% {
                  transform: scale(1.1) rotate(0.5deg);
                  opacity: 1;
                }
              }

              @keyframes engineGlow {
                0%, 100% {
                  box-shadow: 0 0 20px rgba(51,153,255,0.3),
                             0 0 40px rgba(51,153,255,0.2);
                }
                50% {
                  box-shadow: 0 0 30px rgba(51,153,255,0.4),
                             0 0 60px rgba(51,153,255,0.3);
                }
              }

              @keyframes spacecraft1 {
                0% { transform: translate(0, 0) rotate(-15deg); }
                100% { transform: translate(-200px, 100px) rotate(-15deg); }
              }

              @keyframes spacecraft2 {
                0% { transform: translate(50px, -20px) rotate(-15deg); }
                100% { transform: translate(-150px, 80px) rotate(-15deg); }
              }

              @keyframes spacecraft3 {
                0% { transform: translate(100px, -40px) rotate(-15deg); }
                100% { transform: translate(-100px, 60px) rotate(-15deg); }
              }

              @keyframes spacecraft4 {
                0% { transform: translate(150px, -60px) rotate(-15deg); }
                100% { transform: translate(-50px, 40px) rotate(-15deg); }
              }

              @keyframes spacecraft5 {
                0% { transform: translate(200px, -80px) rotate(-15deg); }
                100% { transform: translate(0px, 20px) rotate(-15deg); }
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
