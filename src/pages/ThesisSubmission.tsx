import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Nav from "@/components/Nav";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getTokenBalance } from "@/services/tokenService";
import { LGRWalletDisplay } from "@/components/thesis/LGRWalletDisplay";
import { SubmissionFeeDisplay } from "@/components/thesis/SubmissionFeeDisplay";
import { ThesisForm } from "@/components/thesis/ThesisForm";

interface SubmissionStep {
  id: string;
  label: string;
}

const SUBMISSION_STEPS: SubmissionStep[] = [
  {
    id: 'thesis',
    label: 'Thesis Details'
  },
  {
    id: 'confirmation',
    label: 'Confirmation'
  }
];

const ThesisSubmission = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<string>('thesis');
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [lgrBalance, setLgrBalance] = useState<string>("0");
  const { toast } = useToast();
  const address = primaryWallet?.address;

  useEffect(() => {
    const fetchLgrBalance = async () => {
      if (!address) return;
      
      try {
        const balance = await getTokenBalance(
          "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00", // LGR token address
          address
        );
        setLgrBalance(balance);
      } catch (error) {
        console.error("Error fetching LGR balance:", error);
        toast({
          title: "Error",
          description: "Failed to fetch LGR balance",
          variant: "destructive"
        });
      }
    };

    fetchLgrBalance();
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchLgrBalance, 30000);
    return () => clearInterval(interval);
  }, [address, toast]);

  const handleContinue = () => {
    if (activeStep === 'thesis') {
      setActiveStep('confirmation');
    }
  };

  const handleBack = () => {
    if (activeStep === 'confirmation') {
      setActiveStep('thesis');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast({
      title: "Submission Complete",
      description: "Your thesis has been submitted successfully!",
    });
  };

  const submissionFee = "10000000000000000000"; // 10 LGR

  return (
    <div className="min-h-screen bg-[#030712]">
      <Nav />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <motion.h1
            className="text-3xl font-semibold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Thesis Submission
          </motion.h1>

          <SubmissionFeeDisplay
            submissionFee={submissionFee}
            currentBalance={lgrBalance}
          />

          <Card className="bg-black border-white/10">
            <div className="p-6 space-y-4">
              {activeStep === 'thesis' && (
                <ThesisForm />
              )}

              {activeStep === 'confirmation' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Confirmation</h2>
                  <p className="text-gray-400">Please confirm your thesis details before submitting.</p>
                  {/* Display thesis details here */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-polygon-primary hover:bg-polygon-primary/90 text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Thesis"}
                  </Button>
                  <Button variant="outline" onClick={handleBack} className="w-full text-white">
                    Back to Edit
                  </Button>
                </div>
              )}

              {activeStep === 'thesis' && (
                <Button onClick={handleContinue} className="w-full bg-polygon-primary hover:bg-polygon-primary/90 text-white">
                  Continue to Confirmation <ArrowRight className="ml-2" />
                </Button>
              )}
            </div>
          </Card>

          <LGRWalletDisplay
            submissionFee={submissionFee}
            currentBalance={lgrBalance}
            walletAddress={address}
          />
        </motion.div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-black/90 border-white/10 backdrop-blur-lg shadow-2xl text-white hover:bg-white/10 transition-colors"
            onClick={() => {
              if (!address) {
                setShowAuthFlow?.(true);
              } else {
                setShowWalletOptions(true);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                address ? "bg-green-500" : "bg-white/50"
              )} />
              <span className="text-sm">
                {address ? `${Number(lgrBalance).toFixed(2)} LGR` : "Connect Wallet"}
              </span>
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
