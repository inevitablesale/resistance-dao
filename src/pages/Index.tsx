import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WalletInfo } from "@/components/WalletInfo";

const Index = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "2b74d425-6827-4ff1-af57-f9543d71cca0",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8 text-polygon-primary">
            Web3 Polygon App
          </h1>
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-8">
              <DynamicWidget />
            </div>
            <WalletInfo />
          </div>
        </div>
      </div>
    </DynamicContextProvider>
  );
};

export default Index;