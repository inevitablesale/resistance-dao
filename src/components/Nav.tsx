
import { Link } from "react-router-dom";
import { useDynamicContext, DynamicWidget, DynamicUserProfile } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import Twitter from "./icons/Twitter";
import Linked from "./icons/Linked";

const Nav = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();

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
            <Link 
              to="/buyers" 
              className="text-white/80 hover:text-white transition-colors"
            >
              Buyers
            </Link>
            <Link 
              to="/sellers" 
              className="text-white/80 hover:text-white transition-colors"
            >
              Sellers
            </Link>
            <a 
              href="https://x.com/LedgerFundDAO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors transform transition-all duration-300 hover:scale-105 hover:rotate-3"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/company/ledgerfund-dao/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors transform transition-all duration-300 hover:scale-105 hover:rotate-3"
            >
              <Linked className="w-6 h-6" />
            </a>
            <div className="relative">
              <DynamicWidget />
              {primaryWallet?.address && (
                <div className="absolute top-full right-0 mt-2">
                  <DynamicUserProfile />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
