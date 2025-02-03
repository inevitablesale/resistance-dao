import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight } from "lucide-react";
import { analyzeLinkedInProfile } from "@/services/linkedinService";
import { mintNFT } from "@/services/contractService";
import { useToast } from "@/components/ui/use-toast";

export const WalletInfo = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (primaryWallet) {
        const connected = await primaryWallet.isConnected();
        setIsWalletConnected(connected);
      } else {
        setIsWalletConnected(false);
      }
    };

    checkConnection();
  }, [primaryWallet]);

  const handleAnalyzeProfile = async () => {
    console.group('LinkedIn Profile Analysis and NFT Minting');
    console.log('Starting profile analysis...');
    
    const linkedInUrl = user?.metadata?.["LinkedIn Profile URL"];
    console.log('LinkedIn URL:', linkedInUrl);
    
    if (!linkedInUrl) {
      console.warn('LinkedIn Profile URL not found in metadata');
      toast({
        title: "LinkedIn Profile Not Found",
        description: "Please add your LinkedIn profile URL in your wallet settings.",
        variant: "destructive",
      });
      console.groupEnd();
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Fetching LinkedIn profile data...');
      const nftMetadata = await analyzeLinkedInProfile(linkedInUrl);
      setProgress(50);
      
      // Start minting process
      setIsMinting(true);
      console.log('Starting NFT minting process...');
      
      if (!primaryWallet?.address) {
        throw new Error('Wallet address not found');
      }

      const governancePowerLevel = 1; // This should be determined based on analysis
      const { tokenId } = await mintNFT(
        await primaryWallet.getWalletClient(),
        primaryWallet.address,
        governancePowerLevel
      );

      console.log('NFT minted successfully:', tokenId);
      setProgress(100);
      
      toast({
        title: "NFT Minted Successfully!",
        description: "Your Professional NFT has been minted and should appear in your wallet shortly.",
      });
    } catch (error) {
      console.error('Process failed:', error);
      toast({
        title: "Process Failed",
        description: error instanceof Error ? error.message : "Failed to complete the process. Please try again.",
        variant: "destructive",
      });
      setProgress(25);
    } finally {
      setIsAnalyzing(false);
      setIsMinting(false);
      console.groupEnd();
    }
  };

  if (!isWalletConnected) {
    return null;
  }

  const steps = [
    { name: "Wallet Created", status: "complete" },
    { name: "Generate NFT", status: progress >= 50 ? "complete" : "current" },
    { name: "KYC / AMLY", status: progress >= 75 ? "complete" : "upcoming" },
    { name: "Complete", status: progress === 100 ? "complete" : "upcoming" }
  ];

  return (
    <div className="mt-6 space-y-6 animate-fade-in">
      <Progress value={progress} className="h-2 bg-white/10" />
      
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div 
            key={step.name}
            className={`flex flex-col items-center text-center space-y-2 ${
              step.status === "complete" ? "text-polygon-primary" : 
              step.status === "current" ? "text-polygon-primary" : 
              "text-gray-500"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              step.status === "complete" ? "bg-polygon-primary border-polygon-primary" :
              step.status === "current" ? "border-polygon-primary" :
              "border-gray-500"
            }`}>
              {step.status === "complete" ? (
                <Check className="w-4 h-4 text-white" />
              ) : step.status === "current" ? (
                <ArrowRight className="w-4 h-4 text-polygon-primary" />
              ) : null}
            </div>
            <span className="text-xs font-medium">{step.name}</span>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-xl font-semibold text-white">Generate Your Professional NFT</h3>
        <p className="text-gray-400">
          Your LinkedIn profile will be analyzed to generate unique NFT attributes that represent your professional experience and qualifications.
        </p>
        <div className="flex items-center justify-center">
          <button
            onClick={handleAnalyzeProfile}
            disabled={isAnalyzing || isMinting}
            className={`${
              isAnalyzing || isMinting ? 'bg-polygon-primary/50' : 'bg-polygon-primary hover:bg-polygon-primary/90'
            } text-white px-6 py-3 rounded-lg transition-colors`}
          >
            {isAnalyzing ? 'Analyzing Profile...' :
             isMinting ? 'Minting NFT...' :
             'Generate NFT'}
          </button>
        </div>
      </div>
    </div>
  );
};