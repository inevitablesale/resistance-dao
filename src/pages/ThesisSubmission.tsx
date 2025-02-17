import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput } from "@/components/thesis/TargetCapitalInput";
import { ContractApprovalStatus } from "@/components/thesis/ContractApprovalStatus";
import Nav from "@/components/Nav";
import { FileText, AlertTriangle, Clock, CreditCard, Wallet, Building2, Target, Briefcase, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { uploadMetadataToPinata } from "@/services/pinataService";
import { getContractStatus, estimateProposalGas, createProposal } from "@/services/proposalContractService";
import { validateProposalMetadata, validateIPFSHash } from "@/services/proposalValidationService";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { SubmissionProgress } from "@/components/thesis/SubmissionProgress";
import { LGRWalletDisplay } from "@/components/thesis/LGRWalletDisplay";
import { TransactionStatus } from "@/components/thesis/TransactionStatus";
import { FirmCriteriaSection } from "@/components/thesis/form-sections/FirmCriteriaSection";
import { PaymentTermsSection } from "@/components/thesis/form-sections/PaymentTermsSection";
import { StrategiesSection } from "@/components/thesis/form-sections/StrategiesSection";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";

const TEST_FORM_DATA = {
  title: "Test Proposal - Small Accounting Firm Acquisition",
  firmCriteria: {
    size: "Small (5-20 employees)",
    location: "California",
    dealType: "Full Acquisition",
    geographicFocus: "West Coast"
  },
  paymentTerms: [
    "Initial payment of 30% upon signing",
    "Monthly installments over 24 months",
    "Performance-based earnout over 3 years"
  ],
  strategies: {
    operational: [
      "Implement cloud-based workflow automation",
      "Standardize service delivery processes"
    ],
    growth: [
      "Expand service offerings to include AI solutions",
      "Target enterprise clients"
    ],
    integration: [
      "Retain key technical personnel",
      "Gradual systems migration"
    ]
  },
  investment: {
    targetCapital: "2500.00", // Reduced from 250000.00 to 2500.00 for test mode
    drivers: "Strong recurring revenue from established client base. High potential for automation and scalability.",
    additionalCriteria: "Preference for firms with existing cloud infrastructure."
  }
};

const SUBMISSION_STEPS = [
  {
    id: 'contract-status',
    title: 'Contract Status',
    status: 'pending',
    description: 'Checking the status of the proposal contract.'
  },
  {
    id: 'token-approval',
    title: 'Token Approval',
    status: 'pending',
    description: 'Approve LGR tokens for proposal submission fee.'
  },
  {
    id: 'upload-metadata',
    title: 'Upload Metadata',
    status: 'pending',
    description: 'Uploading proposal metadata to IPFS.'
  },
  {
    id: 'create-proposal',
    title: 'Create Proposal',
    status: 'pending',
    description: 'Submitting proposal to the contract.'
  }
];

export const ThesisSubmission = () => {
  const { toast } = useToast();
  const { isConnected, address, approveLGR, setShowAuthFlow } = useWalletConnection();
  const { data: tokenBalances } = useTokenBalances({ address });
  const [isTestMode, setIsTestMode] = useState(true);
  const [contractStatus, setContractStatus] = useState<any>(null);
  const [votingDuration, setVotingDuration] = useState(14);
  const [targetCapital, setTargetCapital] = useState("250000.00");
  const [isApproving, setIsApproving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metadataHash, setMetadataHash] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string>('contract-status');
  const [isFormVisible, setIsFormVisible] = useState(true);

  const lgrBalance = tokenBalances?.find((token) => token.symbol === "LGR")?.amount || "0";
  const submissionFee = contractStatus?.submissionFee ? ethers.utils.formatEther(contractStatus.submissionFee) : "0";
  const votingFee = contractStatus?.votingFee ? ethers.utils.formatEther(contractStatus.votingFee) : "0";
  const hasSufficientLGR = parseFloat(lgrBalance) >= parseFloat(submissionFee);

  useEffect(() => {
    const fetchContractStatus = async () => {
      try {
        setCurrentStepId('contract-status');
        const status = await getContractStatus();
        setContractStatus(status);
      } catch (error: any) {
        console.error("Failed to fetch contract status:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch contract status.",
          variant: "destructive",
        });
      }
    };

    fetchContractStatus();
  }, []);

  const handleApproveLGR = async () => {
    if (!contractStatus) {
      toast({
        title: "Error",
        description: "Contract status not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!submissionFee) {
      toast({
        title: "Error",
        description: "Submission fee not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsApproving(true);
      setCurrentStepId('token-approval');
      const amount = ethers.utils.parseEther(submissionFee).toString();
      const tx = await approveLGR(amount, isTestMode);
      setTransactionId('token-approval');
      console.log("Transaction executed:", tx);
    } catch (error: any) {
      console.error("Approval error:", error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve LGR tokens.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleSubmitProposal = async () => {
    if (!isConnected) {
      setShowAuthFlow?.(true);
      return;
    }

    if (!contractStatus) {
      toast({
        title: "Error",
        description: "Contract status not loaded. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!hasSufficientLGR) {
      toast({
        title: "Insufficient LGR",
        description: `You need at least ${submissionFee} LGR to submit a proposal.`,
        variant: "destructive",
      });
      return;
    }

    const metadata = {
      title: TEST_FORM_DATA.title,
      description: "Acquisition of a small accounting firm with growth potential.",
      category: "Acquisition",
      firmCriteria: TEST_FORM_DATA.firmCriteria,
      paymentTerms: TEST_FORM_DATA.paymentTerms,
      strategies: TEST_FORM_DATA.strategies,
      investment: {
        targetCapital: targetCapital,
        drivers: TEST_FORM_DATA.investment.drivers,
        additionalCriteria: TEST_FORM_DATA.investment.additionalCriteria
      }
    };

    try {
      // Validate form data
      validateProposalMetadata(metadata);

      // Convert target capital to wei
      const targetCapitalInWei = ethers.utils.parseEther(targetCapital);

      // Set up proposal config
      const proposalConfig = {
        targetCapital: targetCapitalInWei,
        votingDuration: votingDuration,
        metadata
      };

      setIsSubmitting(true);
      setCurrentStepId('upload-metadata');

      // Upload metadata to IPFS
      console.log("Uploading metadata to IPFS...");
      const ipfsHash = await uploadMetadataToPinata(metadata);
      console.log("IPFS hash:", ipfsHash);

      // Validate IPFS hash
      validateIPFSHash(ipfsHash);
      setMetadataHash(ipfsHash);
      setCurrentStepId('create-proposal');

      // Estimate gas before submission
      console.log("Estimating gas before submission...");
      const gasEstimate = await estimateProposalGas({
        targetCapital: targetCapitalInWei,
        votingDuration: votingDuration,
        ipfsHash: ipfsHash
      });
      console.log("Gas estimate:", gasEstimate);

      // Create proposal
      console.log("Creating proposal...");
      const tx = await createProposal({
        targetCapital: targetCapitalInWei,
        votingDuration: votingDuration,
        ipfsHash: ipfsHash
      });

      setTransactionId('create-proposal');
      console.log("Transaction executed:", tx);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmissionError(error.message || "An error occurred during submission.");
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit proposal.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (stepId: string) => {
    if (submissionError) return 'failed';
    if (transactionId === stepId) return 'processing';
    if (currentStepId === stepId) return 'processing';
    if (SUBMISSION_STEPS.findIndex(step => step.id === stepId) < SUBMISSION_STEPS.findIndex(step => step.id === currentStepId)) return 'completed';
    return 'pending';
  };

  const steps = SUBMISSION_STEPS.map(step => ({
    ...step,
    status: getStepStatus(step.id)
  }));

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
          <div className="lg:col-span-4">
            <LGRWalletDisplay />
            <SubmissionProgress
              steps={steps}
              currentStepId={currentStepId}
            />
            <LGRFloatingWidget />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <ContractApprovalStatus
              contractStatus={contractStatus}
              lgrBalance={lgrBalance}
              submissionFee={submissionFee}
              isApproving={isApproving}
              onApprove={handleApproveLGR}
            />

            <AnimatePresence>
              {transactionId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TransactionStatus
                    transactionId={transactionId}
                    onComplete={() => {
                      toast({
                        title: "Transaction Complete",
                        description: "Transaction completed successfully.",
                      });
                    }}
                    onError={(error) => {
                      toast({
                        title: "Transaction Failed",
                        description: error || "Transaction failed.",
                        variant: "destructive",
                      });
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="bg-black/40 border-white/10">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Proposal Submission</h2>
                  <Label htmlFor="testMode" className="text-sm">
                    Test Mode
                  </Label>
                  <Switch
                    id="testMode"
                    checked={isTestMode}
                    onCheckedChange={setIsTestMode}
                  />
                </div>
                <FormDescription>
                  Submit your thesis proposal to the Legitimate platform.
                </FormDescription>

                <Collapsible defaultOpen={isFormVisible}>
                  <div className="rounded-md border p-4">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="justify-start w-full p-0 text-lg font-semibold">
                        Firm Criteria
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-300 peer-data-[state=open]:rotate-180" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 mt-4">
                      <FirmCriteriaSection formData={TEST_FORM_DATA.firmCriteria} />
                    </CollapsibleContent>
                  </div>

                  <div className="rounded-md border p-4">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="justify-start w-full p-0 text-lg font-semibold">
                        Payment Terms
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-300 peer-data-[state=open]:rotate-180" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 mt-4">
                      <PaymentTermsSection paymentTerms={TEST_FORM_DATA.paymentTerms} />
                    </CollapsibleContent>
                  </div>

                  <div className="rounded-md border p-4">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="justify-start w-full p-0 text-lg font-semibold">
                        Strategies
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-300 peer-data-[state=open]:rotate-180" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 mt-4">
                      <StrategiesSection strategies={TEST_FORM_DATA.strategies} />
                    </CollapsibleContent>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetCapital">Target Capital (USD)</Label>
                      <TargetCapitalInput
                        id="targetCapital"
                        value={targetCapital}
                        onValueChange={setTargetCapital}
                      />
                    </div>
                    <div>
                      <Label htmlFor="votingDuration">Voting Duration (Days)</Label>
                      <VotingDurationInput
                        id="votingDuration"
                        value={votingDuration}
                        onValueChange={setVotingDuration}
                      />
                    </div>
                  </div>
                </Collapsible>

                <Button
                  onClick={handleSubmitProposal}
                  disabled={isSubmitting || !isConnected || !hasSufficientLGR}
                  className={cn(
                    "w-full",
                    isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-polygon-primary/80"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      Submitting...
                      <Clock className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Submit Proposal"
                  )}
                </Button>

                {submissionError && (
                  <div className="text-red-500 mt-4">
                    <AlertTriangle className="mr-2 inline-block h-4 w-4" />
                    {submissionError}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
