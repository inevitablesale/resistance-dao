
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { WalletInfo } from "@/components/WalletInfo";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface HeroContentProps {
  scrollProgress: number;
}

export const HeroContent = ({ scrollProgress }: HeroContentProps) => {
  const { setShowAuthFlow } = useDynamicContext();

  return (
    <div className="relative z-20 h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 max-w-5xl mx-auto">
          <h1 
            className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight"
            style={{
              opacity: 1 - scrollProgress * 2,
              transform: `translateY(${scrollProgress * -100}px)`
            }}
          >
            The future of accounting<br />belongs to you
          </h1>
          <p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
            style={{
              opacity: 1 - scrollProgress * 2,
              transform: `translateY(${scrollProgress * -50}px)`
            }}
          >
            Licensed accountants can participate in fractional ownership of accounting firms through our decentralized autonomous organization (DAO)
          </p>

          <div 
            className="flex flex-col md:flex-row gap-4 justify-center mb-16"
            style={{
              opacity: 1 - scrollProgress * 2,
              transform: `translateY(${scrollProgress * -25}px)`
            }}
          >
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

          <div 
            className="max-w-md mx-auto"
            style={{
              opacity: 1 - scrollProgress * 2,
              transform: `translateY(${scrollProgress * -25}px)`
            }}
          >
            <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
              <div className="flex justify-center mb-8">
                <DynamicWidget />
              </div>
              <WalletInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

