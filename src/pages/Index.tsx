
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState, useRef } from 'react';
import Nav from "@/components/Nav";
import { SpaceScene } from "@/components/SpaceScene";
import { HeroContent } from "@/components/HeroContent";

const IndexContent = () => {
  const { user } = useDynamicContext();
  const [scrollProgress, setScrollProgress] = useState(0);
  const spaceSceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (spaceSceneRef.current) {
        const scrollHeight = spaceSceneRef.current.scrollHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  return (
    <div ref={spaceSceneRef} className="relative min-h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <SpaceScene scrollProgress={scrollProgress} />
        <HeroContent scrollProgress={scrollProgress} />
      </div>
    </div>
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
        <Nav />
        <IndexContent />
      </div>
    </DynamicContextProvider>
  );
};

export default Index;

