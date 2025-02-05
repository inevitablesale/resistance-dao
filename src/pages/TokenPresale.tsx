
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import Nav from "@/components/Nav";
import { useToast } from "@/hooks/use-toast";
import { Wallet2 } from "lucide-react";

const TokenPresaleContent = () => {
  const { user, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setShowAuthFlow?.(true);
    }
  }, [user, setShowAuthFlow]);

  return (
    <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
      <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
        Join LedgerFund Presale
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
        You're about to participate in shaping the future of decentralized accounting. Follow the path below that matches your situation.
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
          <div className="flex justify-center mb-8">
            <DynamicWidget />
          </div>
          
          <div className="space-y-8 text-white">
            {/* Token Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-[#8247E5]">10M</p>
                <p className="text-sm text-gray-400">Total Supply</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-[#8247E5]">$0.10</p>
                <p className="text-sm text-gray-400">Price Per Token</p>
              </div>
            </div>

            {/* Participation Paths */}
            <div className="text-left space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Choose Your Path to Participate:</h3>
                
                {/* Path A: New to Crypto */}
                <div className="p-6 rounded-lg bg-white/5 space-y-4">
                  <h4 className="text-lg font-medium text-[#8247E5]">Path A: New to Crypto</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8247E5] flex items-center justify-center flex-shrink-0">1</div>
                      <p className="text-gray-300">Connect your wallet using the widget above</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8247E5] flex items-center justify-center flex-shrink-0">2</div>
                      <p className="text-gray-300">Click "Buy Crypto" in your wallet options</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8247E5] flex items-center justify-center flex-shrink-0">3</div>
                      <p className="text-gray-300">Complete one-time identity verification through Banxa (government ID required)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8247E5] flex items-center justify-center flex-shrink-0">4</div>
                      <p className="text-gray-300">Purchase MATIC using your preferred payment method</p>
                    </div>
                  </div>
                </div>

                {/* Path B: MetaMask Users */}
                <div className="p-6 rounded-lg bg-white/5 space-y-4">
                  <h4 className="text-lg font-medium text-[#8247E5]">Path B: MetaMask Users with MATIC</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8247E5] flex items-center justify-center flex-shrink-0">1</div>
                      <p className="text-gray-300">Connect your MetaMask wallet using the widget above</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8247E5] flex items-center justify-center flex-shrink-0">2</div>
                      <p className="text-gray-300">Switch to Polygon network if prompted</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8247E5] flex items-center justify-center flex-shrink-0">3</div>
                      <p className="text-gray-300">Enter the amount of tokens you wish to purchase</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#8247E5] flex items-center justify-center flex-shrink-0">4</div>
                      <p className="text-gray-300">Confirm the transaction in your MetaMask popup</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="p-6 rounded-lg bg-white/5">
                <h3 className="text-lg font-semibold mb-4">Token Holder Benefits:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Early access to governance rights</li>
                  <li>Participation in platform decision-making</li>
                  <li>Revenue sharing opportunities</li>
                  <li>Priority access to new features</li>
                </ul>
              </div>

              {/* Additional Details */}
              <div className="p-4 rounded-lg bg-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Wallet2 className="w-5 h-5 text-[#8247E5]" />
                  <span className="text-sm text-gray-300">Network: Polygon (MATIC)</span>
                </div>
                <p className="text-xs text-gray-400">Make sure you have enough MATIC for gas fees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TokenPresale = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)', opacity: 0.98 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)', animation: 'quantumField 30s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent), radial-gradient(2px 2px at 20% 20%, rgba(0, 255, 255, 0.7) 100%, transparent), radial-gradient(1.5px 1.5px at 30% 30%, rgba(147, 51, 255, 0.8) 100%, transparent), radial-gradient(2px 2px at 40% 40%, rgba(64, 156, 255, 0.6) 100%, transparent), radial-gradient(1.5px 1.5px at 50% 50%, rgba(255, 255, 255, 0.7) 100%, transparent)', backgroundSize: '400% 400%', animation: 'temporalWake 240s ease-in-out infinite' }} />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 relative z-10">
        <TokenPresaleContent />
      </div>
    </div>
  );
};

export default TokenPresale;
