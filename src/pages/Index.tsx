import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { WalletInfo } from "@/components/WalletInfo";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const IndexContent = () => {
  const { user } = useDynamicContext();

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  return (
    <>
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
          The future of Web3
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Connect your wallet to participate in the decentralized future of finance through our platform
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
          <div className="flex justify-center mb-8">
            <DynamicWidget />
          </div>
          <WalletInfo />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-4">
            New to Web3? Learn how to get started with our comprehensive guide
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-2 bg-polygon-primary hover:bg-polygon-primary/80 text-white rounded-lg transition-colors">
              Learn More
            </button>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              View Docs
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Index = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "2b74d425-6827-4ff1-af57-f9543d71cca0",
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-[#2D1B69] to-black overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwMCIgaGVpZ2h0PSIyMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9Im5vaXNlIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-50"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <IndexContent />
        </div>
      </div>
    </DynamicContextProvider>
  );
};

export default Index;