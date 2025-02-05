
import { Link, useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const Nav = () => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLaunchApp = async () => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to launch the app.",
        variant: "destructive",
      });
      return;
    }

    const isConnected = await primaryWallet.isConnected();
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to launch the app.",
        variant: "destructive",
      });
      return;
    }

    navigate('/mint-nft');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg border-b border-white/10" />
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#8247E5] font-bold">
                LF
              </div>
              <span className="text-white font-semibold text-xl">LedgerFund</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Overview
            </Link>
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Presale
            </Link>
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Why Now
            </Link>
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Roadmap
            </Link>
          </div>

          <div className="hidden md:block">
            <DynamicWidget />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
