
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { Progress } from "@/components/ui/progress";

const ReferralRedirect = () => {
  const { referrerAddress } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useCustomWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: number;
    
    // Start the progress animation
    if (referrerAddress) {
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
  }, []);

  useEffect(() => {
    // If progress reaches 100%, redirect
    if (progress === 100) {
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  }, [progress, navigate]);

  useEffect(() => {
    const processReferral = async () => {
      // Store the referrer address in localStorage if it's valid
      if (referrerAddress && referrerAddress.length > 0) {
        console.log("Storing referrer address:", referrerAddress);
        localStorage.setItem("referrer_address", referrerAddress);
        
        toast({
          title: "Welcome to Resistance DAO!",
          description: "You've been referred by a Bounty Hunter.",
        });
      }
    };
    
    processReferral();
  }, [referrerAddress, address, isConnected, toast]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md p-8 rounded-xl bg-black/50 border border-toxic-neon/30 shadow-[0_0_30px_rgba(57,255,20,0.2)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-toxic-neon mb-4">Welcome to Resistance DAO</h1>
          <p className="text-white mb-6">Processing your Bounty Hunter referral...</p>
          
          <div className="w-full mb-6">
            <Progress value={progress} className="h-2" />
          </div>
          
          <p className="text-white/60 text-sm">
            You're being referred by a Bounty Hunter from the wasteland. 
            They'll earn rewards when you purchase an NFT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralRedirect;
