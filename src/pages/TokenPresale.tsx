
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import Nav from "@/components/Nav";
import { useToast } from "@/hooks/use-toast";

const TokenPresaleContent = () => {
  const { user, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();

  useEffect(() => {
    // Automatically open the auth flow when component mounts if user is not connected
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
        Connect your wallet to participate in the LedgerFund token presale. Get early access to governance rights and shape the future of decentralized accounting.
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
          <div className="flex justify-center mb-8">
            <DynamicWidget />
          </div>
          <div className="space-y-6 text-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-[#8247E5]">10M</p>
                <p className="text-sm text-gray-400">Total Supply</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-2xl font-bold text-[#8247E5]">$0.10</p>
                <p className="text-sm text-gray-400">Price Per Token</p>
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
