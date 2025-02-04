
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { WalletInfo } from "@/components/WalletInfo";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { BlackHoleAnimation } from "@/components/BlackHoleAnimation";

const IndexContent = () => {
  const { user } = useDynamicContext();

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
          The future of accounting<br />belongs to you
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
        </p>
      </div>

      <div className="max-w-md mx-auto mt-8">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
          <div className="flex gap-4 justify-center mb-8">
            <DynamicWidget />
            <button className="px-6 py-2 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-colors">
              Earn Rewards with Quests
            </button>
          </div>
          <WalletInfo />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-4">
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
        <BlackHoleAnimation />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <IndexContent />
        </div>
      </div>
    </DynamicContextProvider>
  );
};

export default Index;
