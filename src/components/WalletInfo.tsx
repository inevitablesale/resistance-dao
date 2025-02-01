import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight } from "lucide-react";
import { analyzeLinkedInProfile } from "@/services/linkedinService";
import { useToast } from "@/components/ui/use-toast";

export const WalletInfo = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      const profileData = await analyzeLinkedInProfile(linkedInUrl);
      
      if (profileData.success) {
        console.log('Analysis completed successfully:', {
          name: profileData.nftMetadata.fullName,
          specialty: profileData.nftMetadata.attributes.find(a => a.trait_type === "Specialty")?.value,
          experienceLevel: profileData.nftMetadata.attributes.find(a => a.trait_type === "Experience Level")?.value,
          serviceExpertise: profileData.nftMetadata.attributes.find(a => a.trait_type === "Service Line Expertise")?.value
        });
        
        setProgress(50);
        toast({
          title: "Profile Analysis Complete",
          description: "Your professional NFT attributes are being generated.",
        });
      }
    } catch (error) {
      console.error('Profile analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze LinkedIn profile. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      console.groupEnd();
    }
  };

  if (!isWalletConnected) {
    return null;
  }

  const steps = [
    { name: "Wallet Created", status: "complete" },
    { name: "Generate NFT", status: "current" },
    { name: "KYC / AMLY", status: "upcoming" },
    { name: "Complete", status: "upcoming" }
  ];

  return (
    <div className="mt-6 space-y-6 animate-fade-in">
      <Progress value={progress} className="h-2 bg-white/10" />
      
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div 
            key={step.name}
            className={`flex flex-col items-center text-center space-y-2 ${
              index === 1 ? "text-polygon-primary" : 
              index === 0 ? "text-white" : 
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
            disabled={isAnalyzing}
            className={`${
              isAnalyzing ? 'bg-polygon-primary/50' : 'bg-polygon-primary hover:bg-polygon-primary/90'
            } text-white px-6 py-3 rounded-lg transition-colors`}
          >
            {isAnalyzing ? (
              <div className="animate-pulse-slow">Analyzing Profile...</div>
            ) : (
              'Generate NFT'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};