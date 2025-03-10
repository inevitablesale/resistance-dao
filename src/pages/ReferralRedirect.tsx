
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { Progress } from "@/components/ui/progress";
import { createReferral, initNFTPolling } from "@/services/referralService";
import { checkBountyHunterOwnership } from "@/services/alchemyNFTService";

const ReferralRedirect = () => {
  const { referrerAddress } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useCustomWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isValidReferrer, setIsValidReferrer] = useState<boolean | null>(null);

  // Verify that the referrer has a Bounty Hunter NFT
  useEffect(() => {
    const verifyReferrer = async () => {
      if (referrerAddress) {
        try {
          console.log("Verifying referrer address:", referrerAddress);
          const isValid = await checkBountyHunterOwnership(referrerAddress);
          console.log("Referrer validation result:", isValid);
          setIsValidReferrer(isValid);
          
          if (!isValid) {
            toast({
              title: "Invalid Referrer",
              description: "This referrer does not own a Bounty Hunter NFT.",
              variant: "destructive"
            });
            
            // Redirect after a short delay
            setTimeout(() => {
              navigate("/");
            }, 3000);
          }
        } catch (error) {
          console.error("Error verifying referrer:", error);
          setIsValidReferrer(false);
          toast({
            title: "Verification Error",
            description: "Could not verify the referrer. Try again later.",
            variant: "destructive"
          });
          setTimeout(() => navigate("/"), 3000);
        }
      }
    };
    
    verifyReferrer();
  }, [referrerAddress, toast, navigate]);

  // Animation effect
  useEffect(() => {
    let intervalId: number;
    
    // Start the progress animation
    if (referrerAddress && isValidReferrer !== false) {
      setIsProcessing(true);
      
      intervalId = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 50);
    }
    
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [referrerAddress, isValidReferrer]);

  // Redirect after progress animation completes
  useEffect(() => {
    // If progress reaches 100%, redirect
    if (progress === 100) {
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  }, [progress, navigate]);

  // Process referral
  useEffect(() => {
    const processReferral = async () => {
      // Store the referrer address in localStorage if it's valid
      if (referrerAddress && referrerAddress.length > 0 && isValidReferrer) {
        console.log("Storing referrer address:", referrerAddress);
        localStorage.setItem("referrer_address", referrerAddress);
        
        // Initialize NFT polling service
        initNFTPolling();
        
        // If user is connected, record the referral in Supabase
        if (isConnected && address) {
          try {
            console.log("Recording referral:", referrerAddress, "->", address);
            // Record the referral using our service
            const result = await createReferral(referrerAddress, address);
            
            if (result.success) {
              console.log("Referral recorded successfully");
            } else if (result.error !== "This referral already exists") {
              console.error("Error recording referral:", result.error);
            }
          } catch (error) {
            console.error("Error processing referral:", error);
          }
        }
        
        toast({
          title: "Welcome to Resistance DAO!",
          description: "You've been referred by a Bounty Hunter.",
        });
      }
    };
    
    if (isValidReferrer) {
      processReferral();
    }
  }, [referrerAddress, address, isConnected, toast, isValidReferrer]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md p-8 rounded-xl bg-black/50 border border-toxic-neon/30 shadow-[0_0_30px_rgba(57,255,20,0.2)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-toxic-neon mb-4">Welcome to Resistance DAO</h1>
          
          {isValidReferrer === false ? (
            <p className="text-red-400 mb-6">Invalid referrer. Redirecting you to the homepage...</p>
          ) : (
            <>
              <p className="text-white mb-6">Processing your Bounty Hunter referral...</p>
              
              <div className="w-full mb-6">
                <Progress value={progress} className="h-2" />
              </div>
              
              <p className="text-white/60 text-sm">
                You're being referred by a Bounty Hunter from the wasteland. 
                They'll earn rewards when you purchase an NFT.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralRedirect;
