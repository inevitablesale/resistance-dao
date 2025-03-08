import { Link, useLocation } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { Terminal, Radiation, Shield, Lock } from "lucide-react";
import { ToxicBadge } from "@/components/ui/toxic-badge";
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
                  className="bg-toxic-dark border border-toxic-neon text-toxic-neon hover:bg-toxic-neon/20 relative group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-toxic-neon/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <Lock className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  <span className="mr-2">HACK MAINFRAME</span>
                  <ToxicBadge variant="secondary" className="text-[0.65rem] py-0 px-1.5">ACCESS</ToxicBadge>
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
