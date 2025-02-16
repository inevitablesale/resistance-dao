
import { Link } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import WalletAssets from "./wallet/WalletAssets";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Twitter, Linkedin } from 'lucide-react';

const Nav = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const hasWallet = !!primaryWallet?.address;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg border-b border-white/10" />
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white hover:text-white/80 transition-colors">
              Home
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
              <Linkedin className="w-6 h-6" />
            </a>
            <div className="relative">
              <DynamicWidget />
              {hasWallet && (
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
