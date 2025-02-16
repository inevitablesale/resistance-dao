
import { Link, useLocation } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import WalletAssets from "./wallet/WalletAssets";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Twitter from "./icons/Twitter";
import Linked from "./icons/Linked";

const Nav = () => {
  const { primaryWallet, setShowOnRamp } = useDynamicContext();
  const { toast } = useToast();
  const location = useLocation();
  const hasWallet = !!primaryWallet?.address;
  
  // Define routes where we don't want to show wallet assets
  const hideWalletRoutes = ['/thesis'];
  const shouldShowWalletAssets = hasWallet && !hideWalletRoutes.includes(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg border-b border-white/10" />
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white hover:text-white/80 transition-colors font-semibold">
              Home
            </Link>
            <Link to="/governance-voting" className="text-white/80 hover:text-white transition-colors">
              Governance
            </Link>
            <Link to="/mint-nft" className="text-white/80 hover:text-white transition-colors">
              Mint NFT
            </Link>
            <Link to="/marketplace" className="text-white/80 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link to="/content" className="text-white/80 hover:text-white transition-colors">
              Content
            </Link>
            <Link to="/litepaper" className="text-white/80 hover:text-white transition-colors">
              Litepaper
            </Link>
          </div>

          <div className="flex items-center gap-6">
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
              {shouldShowWalletAssets && (
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
