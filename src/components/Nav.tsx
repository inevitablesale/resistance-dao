
import { Link } from "react-router-dom";
import { useDynamicContext, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { useBalanceMonitor } from "@/hooks/use-balance-monitor";
import Twitter from "./icons/Twitter";
import Discord from "./icons/Discord";

const Nav = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  
  // Initialize balance monitoring
  useBalanceMonitor();

  const handleLaunchApp = async () => {
    window.open('https://docs.ledgerfund.finance', '_blank');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg border-b border-white/10" />
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 via-teal-400 to-yellow-400 rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                LGR
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400">
                  LedgerFund
                </span>
                <span className="text-xs text-yellow-500/80 font-medium tracking-wider">
                  DAO
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a 
              href="https://twitter.com/ledgerfund" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors transform transition-all duration-300 hover:scale-105 hover:rotate-3"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a 
              href="https://discord.gg/ledgerfund" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors transform transition-all duration-300 hover:scale-105 hover:rotate-3"
            >
              <Discord className="w-6 h-6" />
            </a>
            <button 
              disabled
              className="px-6 py-2 bg-gray-600/30 text-gray-400 rounded-lg font-medium cursor-not-allowed"
            >
              Litepaper
            </button>
            <DynamicWidget />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
