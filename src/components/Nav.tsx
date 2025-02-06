
import { Link, useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";

const Nav = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLaunchApp = async () => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
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
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                LD
              </div>
              <span className="text-white font-semibold text-xl">LedgerDAO</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#join-our-vision" className="text-white/80 hover:text-white transition-colors">
              Presale
            </a>
            <a href="#private-equity-impact" className="text-white/80 hover:text-white transition-colors">
              Why Now
            </a>
            <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#roadmap" className="text-white/80 hover:text-white transition-colors">
              Roadmap
            </a>
          </div>

          <button 
            onClick={handleLaunchApp}
            className="hidden md:block px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-lg font-medium transition-all hover:scale-105"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

