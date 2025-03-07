import { Link, useLocation } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import Twitter from "./icons/Twitter";
import Linked from "./icons/Linked";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Nav = () => {
  const { primaryWallet } = useDynamicContext();
  const { setShowAuthFlow, isConnected, isPendingInitialization } = useWalletConnection();
  const location = useLocation();
  
  const hideHomeRoutes = ['/', '/thesis'];

  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    if (path === '/proposals') {
      return (
        <Breadcrumb>
          <BreadcrumbList className="text-white/60">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="hover:text-white">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">All Fund Proposals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    if (path.startsWith('/proposals/')) {
      return (
        <Breadcrumb>
          <BreadcrumbList className="text-white/60">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="hover:text-white">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/proposals" className="hover:text-white">All Fund Proposals</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Proposal Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    if (path === '/thesis') {
      return (
        <Breadcrumb>
          <BreadcrumbList className="text-white/60">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="hover:text-white">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/proposals" className="hover:text-white">All Fund Proposals</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Create a Fund Proposal</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    return null;
  };

  const handleLaunchClick = () => {
    setShowAuthFlow(true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md border-b border-white/5" />
      <div className="container h-full mx-auto px-4 relative">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            {location.pathname === '/' ? null : (
              hideHomeRoutes.includes(location.pathname) ? (
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              ) : (
                getBreadcrumbs()
              )
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
              href="https://www.linkedin.com/groups/12657922/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors transform hover:scale-105 duration-200"
            >
              <Linked className="w-5 h-5" />
            </a>
            <div className="relative z-[101] flex items-center pointer-events-auto">
              {isPendingInitialization ? (
                <Button disabled className="opacity-50">
                  Initializing...
                </Button>
              ) : isConnected ? (
                <DynamicWidget />
              ) : (
                <Button 
                  onClick={handleLaunchClick}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-105"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Launch dApp
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
