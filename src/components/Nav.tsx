
import { Link, useLocation } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import WalletAssets from "./wallet/WalletAssets";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Twitter from "./icons/Twitter";
import Linked from "./icons/Linked";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Nav = () => {
  const { primaryWallet, setShowOnRamp } = useDynamicContext();
  const { toast } = useToast();
  const location = useLocation();
  const hasWallet = !!primaryWallet?.address;
  const [isOpen, setIsOpen] = useState(false);
  
  const hideWalletRoutes = ['/', '/thesis'];
  const shouldShowWalletAssets = hasWallet && !hideWalletRoutes.includes(location.pathname);

  const mainRoutes = [
    { path: '/', label: 'Home' },
    { path: '/governance-voting', label: 'Governance' },
    { path: '/mint-nft', label: 'Mint NFT' },
    { path: '/share-to-earn', label: 'Share to Earn' },
    { path: '/litepaper', label: 'Litepaper' },
    { path: '/getting-started', label: 'Getting Started' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/content', label: 'Content Hub' },
    { path: '/thesis', label: 'Submit Thesis' },
  ];

  if (hasWallet) {
    mainRoutes.push({ path: '/proposals', label: 'Proposals' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-16">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md border-b border-white/5" />
      <div className="container h-full mx-auto px-4 relative">
        <div className="flex items-center justify-between h-full">
          <div className="hidden md:flex items-center gap-4">
            {mainRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`text-white/80 hover:text-white transition-colors ${
                  location.pathname === route.path ? 'text-white font-medium' : ''
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white p-2">
                  <Menu className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-black/90 border-white/10">
                {mainRoutes.map((route) => (
                  <DropdownMenuItem key={route.path} asChild>
                    <Link
                      to={route.path}
                      className={`w-full px-2 py-2 text-white/80 hover:text-white hover:bg-white/5 ${
                        location.pathname === route.path ? 'text-white font-medium bg-white/10' : ''
                      }`}
                    >
                      {route.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
