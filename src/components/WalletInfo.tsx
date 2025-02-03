import { useEffect, useState } from "react";
import { useDynamicContext, DynamicEmbeddedWalletPreview } from "@dynamic-labs/sdk-react-core";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, Eye } from "lucide-react";
import { analyzeLinkedInProfile } from "@/services/linkedinService";
import { mintNFT } from "@/services/contractService";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { getGovernanceImageCID } from "@/utils/governancePowerMapping";

interface NFTAttribute {
  trait_type: string;
  value: string;
}

interface NFTPreviewData {
  fullName: string;
  attributes: NFTAttribute[];
}

export const WalletInfo = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nftPreview, setNFTPreview] = useState<NFTPreviewData | null>(null);
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
      console.log('Received NFT metadata:', nftMetadata);
      setProgress(50);
      
      const governancePowerAttr = nftMetadata.attributes.find(
        attr => attr.trait_type === "Governance Power"
      );
      console.log('Found Governance Power attribute:', governancePowerAttr);
      
      if (governancePowerAttr) {
        const imageCID = getGovernanceImageCID(String(governancePowerAttr.value));
        console.log('Generated Image CID:', imageCID);
        setPreviewImageUrl(`https://ipfs.io/ipfs/${imageCID}`);
      }
      
      // Convert all attribute values to strings
      const formattedMetadata: NFTPreviewData = {
        fullName: nftMetadata.fullName,
        attributes: nftMetadata.attributes.map(attr => ({
          trait_type: attr.trait_type,
          value: String(attr.value)
        }))
      };
      
      console.log('Formatted metadata for preview:', formattedMetadata);
      setNFTPreview(formattedMetadata);
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
        
        {nftPreview ? (
          <Card className="p-6 bg-black/20 border border-white/10 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <DynamicEmbeddedWalletPreview
                  metadata={{
                    name: `${nftPreview.fullName}'s Professional NFT`,
                    description: "Professional NFT representing verified credentials and experience",
                    image: previewImageUrl,
                    attributes: nftPreview.attributes
                  }}
                  showFullMetadata={true}
                  className="w-full max-w-[300px]"
                />
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">{nftPreview.fullName}'s Professional NFT</h4>
                <div className="space-y-2">
                  {nftPreview.attributes.map((attr, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-400">{attr.trait_type}:</span>
                      <span className="text-white">{attr.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className={`${
                    isMinting ? 'bg-polygon-primary/50' : 'bg-polygon-primary hover:bg-polygon-primary/90'
                  } w-full text-white px-6 py-3 rounded-lg transition-colors mt-4`}
                >
                  {isMinting ? 'Minting NFT...' : 'Mint NFT'}
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={handleAnalyzeProfile}
              disabled={isAnalyzing}
              className={`${
                isAnalyzing ? 'bg-polygon-primary/50' : 'bg-polygon-primary hover:bg-polygon-primary/90'
              } text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2`}
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