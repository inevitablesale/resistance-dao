
import { Link, useNavigate } from "react-router-dom";
import { useDynamicContext, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { useBalanceMonitor } from "@/hooks/use-balance-monitor";

const Nav = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#join-our-vision" className="text-white/80 hover:text-white transition-colors">
              Presale
            </a>
            <a href="#private-equity-impact" className="text-white/80 hover:text-white transition-colors">
              Why Now
            </a>
            <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#roadmap" className="text-white/80 hover:text-white transition-colors">
              Roadmap
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={handleLaunchApp}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-lg font-medium transition-all hover:scale-105"
            >
              Download Whitepaper
            </button>
            <DynamicWidget />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
