
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
        {/* James Webb-inspired Space Background */}
        <div className="absolute inset-0">
          {/* Deep space base layer */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #0a1929 0%, #000000 100%)',
              opacity: 0.98
            }}
          />
          
          {/* Distant nebulae and cosmic structures */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 20% 30%, rgba(133, 98, 63, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse at 60% 40%, rgba(92, 76, 61, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse at 80% 40%, rgba(82, 58, 36, 0.12) 0%, transparent 70%),
                radial-gradient(circle at 50% 50%, rgba(28, 45, 90, 0.1) 0%, transparent 80%)
              `,
              animation: 'nebulaPulse 45s ease-in-out infinite alternate',
              mixBlendMode: 'screen'
            }}
          />
          
          {/* Mid-distance cosmic dust and gas */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 40%, rgba(185, 145, 105, 0.12) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 50%, rgba(165, 120, 85, 0.12) 0%, transparent 60%),
                radial-gradient(ellipse at 40% 60%, rgba(145, 95, 65, 0.12) 0%, transparent 60%)
              `,
              animation: 'nebulaGlow 40s ease-in-out infinite alternate',
              mixBlendMode: 'soft-light'
            }}
          />
          
          {/* Star field with varying sizes */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(1.5px 1.5px at 20% 20%, rgba(255, 255, 255, 0.85) 100%, transparent),
                radial-gradient(1px 1px at 30% 30%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(2px 2px at 40% 40%, rgba(255, 255, 255, 0.85) 100%, transparent),
                radial-gradient(1.5px 1.5px at 50% 50%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(2.5px 2.5px at 60% 60%, rgba(255, 255, 255, 0.85) 100%, transparent),
                radial-gradient(2px 2px at 70% 70%, rgba(255, 255, 255, 0.8) 100%, transparent),
                radial-gradient(3px 3px at 80% 80%, rgba(255, 255, 255, 0.85) 100%, transparent)
              `,
              backgroundSize: '400% 400%',
              animation: 'starTwinkle 60s ease-in-out infinite',
              opacity: 0.7
            }}
          />
          
          {/* Bright star accents */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(2px 2px at 25% 25%, rgba(255, 255, 255, 0.9) 100%, transparent),
                radial-gradient(2.5px 2.5px at 45% 45%, rgba(255, 255, 255, 0.9) 100%, transparent),
                radial-gradient(2px 2px at 65% 65%, rgba(255, 255, 255, 0.9) 100%, transparent),
                radial-gradient(3px 3px at 85% 85%, rgba(255, 255, 255, 0.9) 100%, transparent)
              `,
              backgroundSize: '200% 200%',
              animation: 'starGlow 50s ease-in-out infinite alternate',
              opacity: 0.6,
              filter: 'blur(0.3px)'
            }}
          />
          
          <style>
            {`
              @keyframes nebulaPulse {
                0%, 100% {
                  opacity: 0.5;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.6;
                  transform: scale(1.01);
                }
              }

              @keyframes nebulaGlow {
                0%, 100% {
                  opacity: 0.4;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.5;
                  transform: scale(1.02);
                }
              }

              @keyframes starTwinkle {
                0%, 100% {
                  opacity: 0.7;
                  background-position: 0% 0%;
                }
                25% {
                  opacity: 0.8;
                  background-position: 25% 25%;
                }
                50% {
                  opacity: 0.6;
                  background-position: 50% 50%;
                }
                75% {
                  opacity: 0.8;
                  background-position: 75% 75%;
                }
              }

              @keyframes starGlow {
                0%, 100% {
                  opacity: 0.5;
                  filter: blur(0.3px);
                }
                50% {
                  opacity: 0.7;
                  filter: blur(0.5px);
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
