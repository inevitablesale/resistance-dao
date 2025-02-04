
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { WalletInfo } from "@/components/WalletInfo";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import BlackHoleAnimation from "@/components/BlackHoleAnimation";

const IndexContent = () => {
  const { user } = useDynamicContext();

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#4B0082] bg-opacity-90 px-6 py-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold">LedgerFund</div>
          <div className="flex gap-8 text-white">
            <a href="#" className="hover:text-purple-200">Overview</a>
            <a href="#" className="hover:text-purple-200">Get Investment Ready</a>
            <a href="#" className="hover:text-purple-200">Why Now</a>
            <a href="#" className="hover:text-purple-200">Roadmap</a>
            <DynamicWidget />
          </div>
        </div>
      </nav>

      <div className="text-center mt-32 mb-8">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">
          The future of accounting<br />belongs to you
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <button className="px-6 py-3 bg-[#8247E5] hover:bg-[#8247E5]/80 text-white rounded-lg transition-colors">
            Earn Rewards with Quests
          </button>
          <button className="px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-lg transition-colors">
            Mint Ledger NFT
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Check your eligibility to join the future of accounting
          </p>
        </div>

        <div className="mt-12">
          <WalletInfo />
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
        <div className="container mx-auto px-4 relative z-10">
          <IndexContent />
        </div>
      </div>
    </DynamicContextProvider>
  );
};

export default Index;
