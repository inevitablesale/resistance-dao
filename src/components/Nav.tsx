
import { Link, useLocation } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Twitter from "./icons/Twitter";
import Linked from "./icons/Linked";

const Nav = () => {
  const { primaryWallet, setShowOnRamp } = useDynamicContext();
  const { toast } = useToast();
  const location = useLocation();
  const hasWallet = !!primaryWallet?.address;
  
  const hideHomeRoutes = ['/', '/thesis'];
  const shouldShowHomeLink = !hideHomeRoutes.includes(location.pathname);
  const shouldShowProposals = location.pathname !== '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-16">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md border-b border-white/5" />
      <div className="container h-full mx-auto px-4 relative">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            {shouldShowHomeLink && (
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </Link>
            )}
            {hasWallet && shouldShowProposals && (
              <Link to="/proposals" className="text-white/80 hover:text-white transition-colors">
                Proposals
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://x.com/LedgerFundDAO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors transform hover:scale-105 duration-200"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/company/ledgerfund-dao/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors transform hover:scale-105 duration-200"
            >
              <Linked className="w-5 h-5" />
            </a>
            <DynamicWidget />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
