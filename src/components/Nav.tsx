
import { Link } from "react-router-dom";
import { useDynamicContext, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import Twitter from "./icons/Twitter";
import Linked from "./icons/Linked";
import WalletAssets from "./wallet/WalletAssets";

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
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400">
            LedgerFund
          </Link>

          <div className="flex items-center gap-6">
            <a 
              href="https://x.com/LedgerFundDAO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors duration-300"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/company/ledgerfund-dao/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors duration-300"
            >
              <Linked className="w-6 h-6" />
            </a>
            <div className="relative">
              <DynamicWidget />
              {primaryWallet?.address && (
                <div className="absolute top-full right-0 mt-2 w-72 p-4 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl">
                  <WalletAssets />
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
