import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput } from "@/components/thesis/TargetCapitalInput";
import Nav from "@/components/Nav";
import { ArrowRight, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import type { StoredProposal } from "@/types/proposals";
import { SubmissionStep } from "@/components/thesis/SubmissionProgress";
import { uploadMetadataToPinata } from "@/services/pinataService";
import { getContractStatus, estimateProposalGas, createProposal } from "@/services/proposalContractService";
import { validateIPFSHash } from "@/services/proposalValidationService";

const FACTORY_ADDRESS = "0xF3a201c101bfefDdB3C840a135E1573B1b8e7765";
const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const FACTORY_ABI = [
  "function createProposal(string memory ipfsMetadata, uint256 targetCapital, uint256 votingDuration) external returns (address)",
  "function submissionFee() public view returns (uint256)",
  "event ProposalCreated(uint256 indexed tokenId, address proposalContract, address creator, bool isTest)"
];

const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000");
const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000");
const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
const SUBMISSION_FEE = ethers.utils.parseEther("250");
const VOTING_FEE = ethers.utils.parseEther("10");
const MAX_STRATEGIES_PER_CATEGORY = 3;
const MAX_SUMMARY_LENGTH = 500;
const MAX_PAYMENT_TERMS = 5;

interface ProposalMetadata {
  title: string;
  firmCriteria: {
    size: string;
    location: string;
    dealType: string;
    geographicFocus: string;
  };
  paymentTerms: string[];
  strategies: {
    operational: string[];
    growth: string[];
    integration: string[];
  };
  investment: {
    targetCapital: string;
    drivers: string;
    additionalCriteria: string;
  };
}

interface ProposalConfig {
  targetCapital: ethers.BigNumber;
  votingDuration: number;
  ipfsHash: string;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

const SUBMISSION_STEPS: SubmissionStep[] = [
  {
    id: 'thesis',
    title: 'Investment Thesis',
    status: 'pending',
    description: 'Fill out your investment thesis details'
  },
  {
    id: 'strategy',
    title: 'Strategy Selection',
    status: 'pending',
    description: 'Select your post-acquisition strategies'
  },
  {
    id: 'approval',
    title: 'Token Approval',
    status: 'pending',
    description: 'Approve LGR tokens for submission'
  },
  {
    id: 'submission',
    title: 'Thesis Submission',
    status: 'pending',
    description: 'Submit your thesis to the blockchain'
  }
];

const ThesisSubmission = () => {
  const { toast } = useToast();
  const { isConnected, address, connect, approveLGR, wallet } = useWalletConnection();
  const { tokenBalances } = useTokenBalances({
    networkId: 137,
    accountAddress: address,
    includeFiat: false,
    includeNativeBalance: false,
    tokenAddresses: [LGR_TOKEN_ADDRESS]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [activeStep, setActiveStep] = useState<string>('thesis');
  const [steps, setSteps] = useState<SubmissionStep[]>(SUBMISSION_STEPS);
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [votingDuration, setVotingDuration] = useState<number>(MIN_VOTING_DURATION);
  const [formData, setFormData] = useState<ProposalMetadata>({
    title: "",
    firmCriteria: {
      size: "",
      location: "",
      dealType: "",
      geographicFocus: ""
    },
    paymentTerms: [],
    strategies: {
      operational: [],
      growth: [],
      integration: []
    },
    investment: {
      targetCapital: "",
      drivers: "",
      additionalCriteria: ""
    }
  });

  const updateStepStatus = (stepId: string, status: SubmissionStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const validateStrategies = (category: keyof typeof formData.strategies) => {
    const strategies = formData.strategies[category];
    if (!Array.isArray(strategies)) return false;
    return strategies.length <= MAX_STRATEGIES_PER_CATEGORY;
  };

  const validatePaymentTerms = () => {
    if (!Array.isArray(formData.paymentTerms)) return false;
    return formData.paymentTerms.length <= 5;
  };

  const handleStrategyChange = (category: keyof typeof formData.strategies, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      strategies: {
        ...prev.strategies,
        [category]: value
      }
    }));
  };

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const fields = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      
      const lastField = fields[fields.length - 1];
      if (lastField === 'targetCapital') {
        current[lastField] = value.toString();
      } else {
        current[lastField] = value;
      }
      
      return newData;
    });
  };

  const handleVotingDurationChange = (value: number[]) => {
    setVotingDuration(value[0]);
  };

  const getButtonText = () => {
    if (isSubmitting) {
      return (
        <div className="flex items-center justify-center">
          <span className="mr-2">Submitting...</span>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
        </div>
      );
    }

    switch (activeStep) {
      case 'thesis':
        return "Continue to Firm Details";
      case 'strategy':
        return "Continue to Terms";
      case 'terms':
        return "Submit Investment Thesis";
      default:
        return "Continue";
    }
  };

  const validateBasicsTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    
    if (!formData.title || formData.title.trim().length < 10) {
      errors.title = ['Title must be at least 10 characters long'];
    }

    if (!formData.investment.targetCapital) {
      errors['investment.targetCapital'] = ['Target capital is required'];
    } else {
      try {
        const targetCapitalWei = ethers.utils.parseEther(formData.investment.targetCapital);
        if (targetCapitalWei.lt(MIN_TARGET_CAPITAL)) {
          errors['investment.targetCapital'] = [`Minimum target capital is ${ethers.utils.formatEther(MIN_TARGET_CAPITAL)} ETH`];
        }
        if (targetCapitalWei.gt(MAX_TARGET_CAPITAL)) {
          errors['investment.targetCapital'] = [`Maximum target capital is ${ethers.utils.formatEther(MAX_TARGET_CAPITAL)} ETH`];
        }
      } catch (error) {
        errors['investment.targetCapital'] = ['Invalid target capital amount'];
      }
    }

    if (votingDuration < MIN_VOTING_DURATION) {
      errors.votingDuration = ['Minimum voting duration is 7 days'];
    }
    if (votingDuration > MAX_VOTING_DURATION) {
      errors.votingDuration = ['Maximum voting duration is 90 days'];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFirmTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    
    if (!formData.firmCriteria.size) {
      errors['firmCriteria.size'] = ['Please select a firm size'];
    }
    if (!formData.firmCriteria.location) {
      errors['firmCriteria.location'] = ['Please select a location'];
    }
    if (!formData.firmCriteria.dealType) {
      errors['firmCriteria.dealType'] = ['Please select a deal type'];
    }
    if (!formData.firmCriteria.geographicFocus) {
      errors['firmCriteria.geographicFocus'] = ['Please select a geographic focus'];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStrategyTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    
    if (!formData.strategies.operational.length) {
      errors['strategies.operational'] = ['Please select at least one operational strategy'];
    }
    if (!formData.strategies.growth.length) {
      errors['strategies.growth'] = ['Please select at least one growth strategy'];
    }
    if (!formData.strategies.integration.length) {
      errors['strategies.integration'] = ['Please select at least one integration strategy'];
    }
    if (!formData.investment.drivers || formData.investment.drivers.trim().length < 50) {
      errors['investment.drivers'] = ['Investment drivers must be at least 50 characters long'];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTermsTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    
    if (!formData.paymentTerms.length) {
      errors.paymentTerms = ['Please select at least one payment term'];
    }
    if (formData.paymentTerms.length > MAX_PAYMENT_TERMS) {
      errors.paymentTerms = [`Maximum of ${MAX_PAYMENT_TERMS} payment terms allowed`];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    let isValid = false;

    switch (activeStep) {
      case 'thesis':
        isValid = validateBasicsTab();
        if (isValid) setActiveStep('firm');
        break;
      case 'firm':
        isValid = validateFirmTab();
        if (isValid) setActiveStep('strategy');
        break;
      case 'strategy':
        isValid = validateStrategyTab();
        if (isValid) setActiveStep('terms');
        break;
      case 'terms':
        isValid = validateTermsTab();
        if (isValid) handleSubmit(e);
        break;
    }

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly before proceeding.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to submit a thesis",
        variant: "destructive"
      });
      connect();
      return;
    }

    try {
      setIsSubmitting(true);
      setFormErrors({});

      // Update step status
      updateStepStatus('thesis', 'completed');
      updateStepStatus('strategy', 'completed');
      updateStepStatus('approval', 'processing');
      setActiveStep('approval');

      // Get contract status and validate
      if (!wallet) {
        throw new Error("No wallet connected");
      }

      const contractStatus = await getContractStatus(wallet);
      
      if (contractStatus.isPaused) {
        toast({
          title: "Contract Paused",
          description: "The contract is currently paused for maintenance. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      // Validate all form fields against contract requirements
      const targetCapitalWei = ethers.utils.parseEther(formData.investment.targetCapital);
      if (targetCapitalWei.lt(contractStatus.minTargetCapital) || targetCapitalWei.gt(contractStatus.maxTargetCapital)) {
        throw new Error("Target capital out of allowed range");
      }

      if (votingDuration < contractStatus.minVotingDuration || votingDuration > contractStatus.maxVotingDuration) {
        throw new Error("Voting duration out of allowed range");
      }

      // Approve LGR tokens with exact amount from contract
      console.log('Approving LGR tokens for submission...');
      const submissionFeeApproval = await approveLGR(contractStatus.submissionFee.toString());
      if (!submissionFeeApproval) {
        updateStepStatus('approval', 'failed');
        toast({
          title: "Approval Failed",
          description: "Failed to approve LGR tokens for submission. Please try again.",
          variant: "destructive"
        });
        return;
      }

      updateStepStatus('approval', 'completed');
      updateStepStatus('submission', 'processing');
      setActiveStep('submission');

      // Upload metadata to IPFS
      console.log('Uploading metadata to IPFS...');
      const ipfsUri = await uploadMetadataToPinata(formData);
      const ipfsHash = ipfsUri.replace('ipfs://', '');
      
      if (!validateIPFSHash(ipfsHash)) {
        throw new Error("Invalid IPFS hash format");
      }

      // Estimate gas before submission
      const gasEstimate = await estimateProposalGas({
        targetCapital: targetCapitalWei,
        votingDuration,
        ipfsHash
      }, wallet);

      // Create proposal
      console.log('Creating proposal...');
      const result = await createProposal({
        targetCapital: targetCapitalWei,
        votingDuration,
        ipfsHash
      }, wallet);

      // Store proposal data with correct type for targetCapital
      const userProposals: StoredProposal[] = JSON.parse(localStorage.getItem('userProposals') || '[]');
      const newProposal: StoredProposal = {
        hash: result.hash,
        ipfsHash,
        timestamp: new Date().toISOString(),
        title: formData.title,
        targetCapital: formData.investment.targetCapital.toString(),
        status: 'pending'
      };
      userProposals.push(newProposal);
      localStorage.setItem('userProposals', JSON.stringify(userProposals));

      updateStepStatus('submission', 'completed');
      toast({
        title: "Success",
        description: "Your investment thesis has been submitted successfully!",
      });

    } catch (error) {
      console.error("Submission error:", error);
      updateStepStatus(activeStep, 'failed');
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit thesis",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F]">
      <Nav />
      
      <main className="relative z-10 pt-20 pb-20">
        <div className="container px-4 mx-auto max-w-[800px]">
          <div className="text-center mb-16 space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Submit Your Investment Thesis
            </h1>
            <p className="text-lg text-gray-400">
              Share your strategy with the DAO and start earning returns
            </p>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center max-w-[600px] mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      step.id === activeStep ? "bg-yellow-500" : 
                      steps.findIndex(s => s.id === activeStep) > index ? "bg-yellow-500/50" : 
                      "bg-gray-600"
                    )} />
                    <span className={cn(
                      "text-sm transition-colors whitespace-nowrap",
                      step.id === activeStep ? "text-yellow-500" : 
                      steps.findIndex(s => s.id === activeStep) > index ? "text-gray-400" : 
                      "text-gray-600"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "h-[1px] w-12 mx-4",
                      steps.findIndex(s => s.id === activeStep) > index ? "bg-yellow-500/50" : "bg-gray-700"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-[#0E1015] border-gray-800">
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-lg font-medium text-white">
                  Thesis Title
                </Label>
                <Input
                  placeholder="Enter a clear, descriptive title"
                  className="bg-[#161920] border-gray-800 text-white h-12"
                  value={formData.title}
                  onChange={(e) => handleFormDataChange('title', e.target.value)}
                />
              </div>

              <VotingDurationInput
                value={votingDuration}
                onChange={handleVotingDurationChange}
                error={formErrors.votingDuration}
              />

              <TargetCapitalInput
                value={formData.investment.targetCapital}
                onChange={(value) => handleFormDataChange('investment.targetCapital', value)}
                error={formErrors['investment.targetCapital']}
              />
            </div>
          </Card>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 h-12"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6">
        <Button
          variant="outline"
          size="sm"
          className="bg-[#161920] border-gray-800 text-white"
          onClick={() => !isConnected && connect()}
        >
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-gray-600"
            )} />
            <span>
              {isConnected ? 
                `${tokenBalances?.find(token => token.symbol === "LGR")?.balance?.toString() || "0"} LGR` : 
                "Connect Wallet"
              }
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ThesisSubmission;
