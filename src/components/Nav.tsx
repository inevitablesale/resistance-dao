
import { Link } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Radar, Zap, ScrollText, Map, Rocket, Menu } from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    label: "Fleet Status",
    href: "/",
    icon: Radar,
    description: "Monitor quantum fleet deployment"
  },
  {
    label: "Quantum Integration",
    href: "/",
    icon: Zap,
    description: "Prepare for consciousness transfer"
  },
  {
    label: "Mission Brief",
    href: "/",
    icon: ScrollText,
    description: "Understand our quantum mission"
  },
  {
    label: "Flight Path",
    href: "/",
    icon: Map,
    description: "View our expansion trajectory"
  }
];

const Nav = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLaunchApp = async () => {
    if (!primaryWallet) {
      toast({
        title: "Quantum Bridge Inactive",
        description: "Please connect your quantum bridge (wallet) to proceed.",
        variant: "destructive",
      });
      return;
    }

    const isConnected = await primaryWallet.isConnected();
    if (!isConnected) {
      toast({
        title: "Quantum Bridge Disconnected",
        description: "Please reconnect your quantum bridge to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Quantum Systems Loading",
      description: "Initializing neural interface...",
    });
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 quantum-nav-glass"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="quantum-float relative w-10 h-10 rounded-lg overflow-hidden">
              <div className="absolute inset-0 quantum-glow bg-gradient-to-br from-polygon-primary to-polygon-secondary opacity-80" />
              <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-bold">
                LF
              </div>
            </div>
            <span className="quantum-text-gradient font-semibold text-xl">LedgerFund</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={item.href}
                  className="quantum-link group flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.button 
              onClick={handleLaunchApp}
              className="quantum-button px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 relative z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="w-4 h-4" />
              <span className="relative z-10">Launch Bridge</span>
            </motion.button>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden quantum-button p-2 rounded-lg"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden quantum-nav-glass"
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="quantum-link flex items-center gap-2 text-white/80 hover:text-white py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          <motion.button 
            onClick={handleLaunchApp}
            className="quantum-button w-full px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="w-4 h-4" />
            <span className="relative z-10">Launch Bridge</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Nav;
