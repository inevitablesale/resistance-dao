import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, Eye } from "lucide-react";
import { analyzeLinkedInProfile } from "@/services/linkedinService";
import { mintNFT } from "@/services/contractService";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { getGovernanceImageCID } from "@/utils/governancePowerMapping";
import { cn } from "@/lib/utils";

interface NFTPreview {
  fullName: string;
  profilePicCID?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export const WalletInfo = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nftPreview, setNFTPreview] = useState<NFTPreview | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
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
    console.group('LinkedIn Profile Analysis');
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
      
      // Convert the metadata to NFTPreview format
      const preview: NFTPreview = {
        fullName: nftMetadata.fullName,
        profilePicCID: nftMetadata.profilePicCID,
        attributes: nftMetadata.attributes.map(attr => ({
          trait_type: attr.trait_type,
          value: String(attr.value) // Convert all values to strings
        }))
      };
      
      // Set preview image URL based on profile pic or governance power
      if (nftMetadata.profilePicCID) {
        setPreviewImageUrl(`https://ipfs.io/ipfs/${nftMetadata.profilePicCID}`);
      } else {
        const governancePowerAttr = preview.attributes.find(
          attr => attr.trait_type === "Governance Power"
        );
        if (governancePowerAttr) {
          const imageCID = getGovernanceImageCID(governancePowerAttr.value);
          setPreviewImageUrl(`https://ipfs.io/ipfs/${imageCID}`);
        }
      }
      
      setNFTPreview(preview);
      toast({
        title: "Analysis Complete",
        description: "Preview your NFT before minting.",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze profile. Please try again.",
        variant: "destructive",
      });
      setProgress(25);
    } finally {
      setIsAnalyzing(false);
      console.groupEnd();
    }
  };

  const handleMintNFT = async () => {
    if (!nftPreview) return;
    
    setIsMinting(true);
    try {
      console.log('Starting NFT minting process...');
      
      if (!primaryWallet?.address) {
        throw new Error('Wallet address not found');
      }

      const result = await mintNFT(
        await primaryWallet.getWalletClient(),
        primaryWallet.address,
        nftPreview
      );

      console.log('NFT minted successfully:', result);
      setProgress(100);
      
      toast({
        title: "NFT Minted Successfully!",
        description: `Your Professional NFT has been minted and stored on IPFS at ${result.tokenURI}`,
      });
    } catch (error) {
      console.error('Minting failed:', error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  if (!isWalletConnected) {
    return null;
  }

  const getStepStatus = (stepIndex: number) => {
    if (progress === 100) return "complete";
    if (progress >= stepIndex * 25) return "complete";
    if (progress >= (stepIndex - 1) * 25) return "current";
    return "upcoming";
  };

  const steps = [
    { name: "Connect Wallet", status: getStepStatus(1) },
    { name: "Preview NFT", status: getStepStatus(2) },
    { name: "Verify Profile", status: getStepStatus(3) },
    { name: "Mint NFT", status: getStepStatus(4) }
  ];

  return (
    <div className="mt-6 space-y-6 animate-fade-in">
      <Progress value={progress} className="h-2 bg-white/10" />
      
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div 
            key={step.name}
            className={cn(
              "flex flex-col items-center text-center space-y-2",
              step.status === "complete" ? "text-polygon-primary" : 
              step.status === "current" ? "text-polygon-primary" : 
              "text-gray-500"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300",
              step.status === "complete" ? "bg-polygon-primary border-polygon-primary" :
              step.status === "current" ? "border-polygon-primary" :
              "border-gray-500"
            )}>
              {step.status === "complete" ? (
                <Check className="w-4 h-4 text-white animate-scale-in" />
              ) : step.status === "current" ? (
                <ArrowRight className="w-4 h-4 text-polygon-primary animate-pulse" />
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
        
        {nftPreview ? (
          <div className="animate-fade-in">
            <Card className={cn(
              "relative overflow-hidden transition-all duration-500",
              "bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]",
              "border border-polygon-primary/20",
              "hover:border-polygon-primary/40",
              "group"
            )}>
              <div className="absolute inset-0 bg-gradient-to-r from-polygon-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-8 grid grid-cols-12 gap-8">
                {/* Image Section with Animation - 4 columns */}
                {previewImageUrl && (
                  <div className="col-span-4 relative flex items-center justify-center animate-fade-in">
                    <div className="absolute inset-0 bg-polygon-primary/20 rounded-full blur-2xl animate-pulse-slow" />
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-polygon-primary to-polygon-secondary rounded-full blur animate-pulse-slow" />
                      <img 
                        src={previewImageUrl} 
                        alt="NFT Preview" 
                        className="relative rounded-full aspect-square object-cover w-full max-w-[300px] border-4 border-white/10"
                      />
                    </div>
                  </div>
                )}

                {/* Content Section with Staggered Animation - 8 columns */}
                <div className="col-span-8 space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-bold bg-gradient-to-r from-white to-polygon-primary bg-clip-text text-transparent">
                      {nftPreview.fullName}'s Professional NFT
                    </h4>
                    <p className="text-xl text-gray-400">Professional Identity Token</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {nftPreview.attributes.map((attr, index) => (
                      <div 
                        key={index}
                        className="animate-fade-in"
                        style={{ animationDelay: `${150 + index * 100}ms` }}
                      >
                        <div className="flex flex-col p-4 rounded-lg bg-black/20 border border-white/5 hover:border-polygon-primary/20 transition-colors">
                          <span className="text-sm text-gray-400 mb-1">{attr.trait_type}</span>
                          <span className="text-lg font-semibold text-white">{attr.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleMintNFT}
                    disabled={isMinting}
                    className={cn(
                      "w-full py-4 px-6 rounded-lg font-semibold",
                      "bg-gradient-to-r from-polygon-primary to-polygon-secondary",
                      "text-white shadow-lg",
                      "transition-all duration-300",
                      "hover:shadow-polygon-primary/20 hover:scale-[1.02]",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                      "animate-fade-in delay-300"
                    )}
                  >
                    {isMinting ? 'Minting NFT...' : 'Mint NFT'}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={handleAnalyzeProfile}
              disabled={isAnalyzing}
              className={cn(
                isAnalyzing ? 'bg-polygon-primary/50' : 'bg-polygon-primary hover:bg-polygon-primary/90',
                'text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2'
              )}
            >
              <Eye className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing Profile...' : 'Preview NFT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};