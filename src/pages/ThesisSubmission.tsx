import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { 
  FirmSize, 
  DealType, 
  GeographicFocus, 
  PaymentTerm, 
  OperationalStrategy,
  GrowthStrategy,
  IntegrationStrategy,
  ProposalMetadata,
  StoredProposal,
  ProposalConfig
} from "@/types/proposals";

const FACTORY_ADDRESS = "0xF3a201c101bfefDdB3C840a135E1573B1b8e7765";
const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const FACTORY_ABI = ["function createProposal(string memory ipfsMetadata, uint256 targetCapital, uint256 votingDuration) external returns (address)", "function submissionFee() public view returns (uint256)", "event ProposalCreated(uint256 indexed tokenId, address proposalContract, address creator, bool isTest)"];
const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000");
const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000");
const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
const SUBMISSION_FEE = ethers.utils.parseEther("250");
const VOTING_FEE = ethers.utils.parseEther("10");
const MAX_STRATEGIES_PER_CATEGORY = 3;
const MAX_SUMMARY_LENGTH = 500;
const MAX_PAYMENT_TERMS = 5;

interface SubmissionStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
}

const US_STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

const SUBMISSION_STEPS: SubmissionStep[] = [{
  id: 'thesis',
  title: 'Investment Thesis',
  status: 'pending',
  description: 'Fill out your investment thesis details'
}, {
  id: 'strategy',
  title: 'Strategy Selection',
  status: 'pending',
  description: 'Select your post-acquisition strategies'
}, {
  id: 'approval',
  title: 'Token Approval',
  status: 'pending',
  description: 'Approve LGR tokens for submission'
}, {
  id: 'submission',
  title: 'Thesis Submission',
  status: 'pending',
  description: 'Submit your thesis to the blockchain'
}];

const TEST_FORM_DATA: ProposalMetadata = {
  title: "Test Proposal - Automated Backend Services Firm",
  firmCriteria: {
    size: FirmSize.BELOW_1M,
    location: "California",
    dealType: DealType.ACQUISITION,
    geographicFocus: GeographicFocus.LOCAL
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
    targetCapital: "2500000",
    drivers: "Strong recurring revenue from established client base. High potential for automation and scalability. Strategic alignment with emerging tech markets.",
    additionalCriteria: "Preference for firms with existing cloud infrastructure and established compliance frameworks."
  },
  votingDuration: MIN_VOTING_DURATION,
  linkedInURL: "",
  isTestMode: true,
  submissionTimestamp: Date.now(),
  submitter: ""
};

const isValidLinkedInURL = (url: string): boolean => {
  return url.startsWith('https://www.linkedin.com/') || url.startsWith('https://linkedin.com/');
};

const ThesisSubmission = () => {
  const { toast } = useToast();
  const { isConnected, address, connect, approveLGR, wallet, toggleTestMode } = useWalletConnection();
  const { user } = useDynamicContext();
  const { tokenBalances } = useTokenBalances({
    networkId: 137,
    accountAddress: address,
    includeFiat: false,
    includeNativeBalance: false,
    tokenAddresses: [LGR_TOKEN_ADDRESS]
  });

  const [isTestMode, setIsTestMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [activeStep, setActiveStep] = useState<string>('thesis');
  const [steps, setSteps] = useState<SubmissionStep[]>(SUBMISSION_STEPS);
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [votingDuration, setVotingDuration] = useState<number>(MIN_VOTING_DURATION);
  const [formData, setFormData] = useState<ProposalMetadata>({
    title: "",
    firmCriteria: {
      size: FirmSize.BELOW_1M,
      location: "",
      dealType: DealType.ACQUISITION,
      geographicFocus: GeographicFocus.LOCAL
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
    },
    votingDuration: MIN_VOTING_DURATION,
    linkedInURL: "",
    isTestMode: false
  });
  const [isThesisOpen, setIsThesisOpen] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  useEffect(() => {
    setFormData(isTestMode ? {
      title: TEST_FORM_DATA.title,
      firmCriteria: TEST_FORM_DATA.firmCriteria,
      paymentTerms: TEST_FORM_DATA.paymentTerms,
      strategies: TEST_FORM_DATA.strategies,
      investment: TEST_FORM_DATA.investment,
      votingDuration: MIN_VOTING_DURATION,
      linkedInURL: user?.metadata?.["LinkedIn Profile URL"] || "",
      isTestMode: true,
      submissionTimestamp: Date.now(),
      submitter: address
    } : {
      title: "",
      firmCriteria: {
        size: FirmSize.BELOW_1M,
        location: "",
        dealType: DealType.ACQUISITION,
        geographicFocus: GeographicFocus.LOCAL
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
      },
      votingDuration: MIN_VOTING_DURATION,
      linkedInURL: user?.metadata?.["LinkedIn Profile URL"] || "",
      isTestMode: false,
      submissionTimestamp: Date.now(),
      submitter: address
    });
  }, [isTestMode, user, address]);

  useEffect(() => {
    const linkedInURL = user?.metadata?.["LinkedIn Profile URL"] as string;
    if (!linkedInURL && isConnected) {
      toast({
        title: "LinkedIn Profile Required",
        description: "Please add your LinkedIn URL in your wallet settings to submit a thesis",
        variant: "default"
      });
    }
  }, [user, isConnected, toast]);

  const validateLinkedInURL = (): boolean => {
    const linkedInURL = user?.metadata?.["LinkedIn Profile URL"] as string;
    if (!linkedInURL) {
      setFormErrors(prev => ({
        ...prev,
        linkedInURL: ['LinkedIn URL is required. Please add it in your wallet settings.']
      }));
      return false;
    }
    if (!isValidLinkedInURL(linkedInURL)) {
      setFormErrors(prev => ({
        ...prev,
        linkedInURL: ['Invalid LinkedIn URL format. Please update it in your wallet settings.']
      }));
      return false;
    }
    return true;
  };

  const updateStepStatus = (stepId: string, status: SubmissionStep['status']) => {
    setSteps(prev => prev.map(step => step.id === stepId ? {
      ...step,
      status
    } : step));
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

  const handleStrategyChange = (category: "operational" | "growth" | "integration", value: string[]) => {
    handleFormDataChange(`strategies.${category}`, value);
  };

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      const fields = field.split('.');
      
      let current: any = newData;
      
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }
      
      const lastField = fields[fields.length - 1];
      current[lastField] = value;
      
      return newData;
    });
  };

  const handleVotingDurationChange = (value: number[]) => {
    setVotingDuration(value[0]);
  };

  const getButtonText = () => {
    if (isSubmitting) {
      return <div className="flex items-center justify-center">
          <span className="mr-2">Submitting...</span>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
        </div>;
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
        handleSubmit(e);
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

      if (!validateLinkedInURL()) {
        throw new Error("Please add a valid LinkedIn URL in your wallet settings");
      }

      updateStepStatus('thesis', 'completed');
      updateStepStatus('strategy', 'completed');
      updateStepStatus('approval', 'completed');
      setActiveStep('submission');

      if (!wallet) {
        throw new Error("No wallet connected");
      }

      const linkedInURL = user?.metadata?.["LinkedIn Profile URL"] as string;
      console.log('Retrieved LinkedIn URL:', linkedInURL);

      const updatedFormData = {
        ...formData,
        votingDuration,
        linkedInURL,
        submissionTimestamp: Date.now(),
        submitter: address
      };

      console.log('Uploading metadata to IPFS...', { isTestMode });
      const ipfsUri = await uploadMetadataToPinata(updatedFormData);
      const ipfsHash = ipfsUri.replace('ipfs://', '');
      
      if (!validateIPFSHash(ipfsHash)) {
        throw new Error("Invalid IPFS hash format");
      }

      console.log('Estimating gas for proposal creation...', { isTestMode });
      const targetCapitalWei = ethers.utils.parseEther(
        isTestMode ? TEST_FORM_DATA.investment.targetCapital : formData.investment.targetCapital
      );

      const proposalConfig: ProposalConfig = {
        targetCapital: targetCapitalWei,
        votingDuration,
        ipfsHash,
        metadata: updatedFormData,
        linkedInURL
      };

      const gasEstimate = await estimateProposalGas(proposalConfig, wallet);
      console.log('Creating proposal...', proposalConfig);
      const result = await createProposal(proposalConfig, wallet);

      const userProposals: StoredProposal[] = JSON.parse(localStorage.getItem('userProposals') || '[]');
      const newProposal: StoredProposal = {
        hash: result.hash,
        ipfsHash,
        timestamp: new Date().toISOString(),
        title: isTestMode ? TEST_FORM_DATA.title : formData.title,
        targetCapital: targetCapitalWei.toString(),
        status: 'pending'
      };
      userProposals.push(newProposal);
      localStorage.setItem('userProposals', JSON.stringify(userProposals));

      updateStepStatus('submission', 'completed');
      toast({
        title: `${isTestMode ? 'Test Proposal' : 'Proposal'} Submitted`,
        description: `Your ${isTestMode ? 'test ' : ''}investment thesis has been submitted successfully!`
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

  const handleApprovalComplete = async (formData: any, approvalTx?: ethers.ContractTransaction) => {
    try {
      updateStepStatus('approval', 'completed');
      setActiveStep('submission');
      
      const syntheticEvent = {
        preventDefault: () => {},
        target: null,
        currentTarget: null,
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: true,
        nativeEvent: new Event('submit'),
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        isDefaultPrevented: () => false,
        type: 'submit'
      } as React.FormEvent<HTMLFormElement>;

      await handleSubmit(syntheticEvent);
    } catch (error) {
      console.error("Error during submission:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit thesis",
        variant: "destructive"
      });
      updateStepStatus('submission', 'failed');
    }
  };

  const hasRequiredBalance = (tokenBalances?.find(token => token.symbol === "LGR")?.balance || 0) >= Number(ethers.utils.formatEther(SUBMISSION_FEE));

  const renderContinueButton = (
    onClick: () => void,
    isLastSection: boolean = false
  ) => (
    <Button 
      onClick={onClick} 
      disabled={isSubmitting}
      className={cn(
        "h-12 px-6 min-w-[200px] mt-6",
        "bg-gradient-to-r from-polygon-primary to-polygon-secondary",
        "hover:from-polygon-secondary hover:to-polygon-primary",
        "text-white font-medium",
        "transition-all duration-300",
        "disabled:opacity-50",
        "flex items-center justify-center gap-2"
      )}
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>{isLastSection ? 'Submit Thesis' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </Button>
  );

  const handleRentAdSpace = (frequency: 'week' | 'month') => {
    // Implement ad space rental logic here
  };

  const handleTestModeToggle = async (enabled: boolean) => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to toggle test mode",
        variant: "destructive"
      });
      connect();
      return;
    }
    
    const success = await toggleTestMode(enabled);
    if (success) {
      setIsTestMode(enabled);
      if (enabled) {
        setFormData(TEST_FORM_DATA);
        setIsThesisOpen(false);
        setIsStrategyOpen(false);
        setIsApprovalOpen(false);
        setIsSubmissionOpen(true);
        setSteps(prev => prev.map(step => ({
          ...step,
          status: 'completed'
        })));
        toast({
          title: "Test Mode Enabled",
          description: "Form pre-filled with test data",
        });
      } else {
        setFormData({
          title: "",
          firmCriteria: {
            size: FirmSize.BELOW_1M,
            location: "",
            dealType: DealType.ACQUISITION,
            geographicFocus: GeographicFocus.LOCAL
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
          },
          votingDuration: MIN_VOTING_DURATION,
          linkedInURL: "",
          isTestMode: false,
          submissionTimestamp: Date.now(),
          submitter: address
        });
        setIsThesisOpen(true);
        setIsStrategyOpen(false);
        setIsApprovalOpen(false);
        setIsSubmissionOpen(false);
        setSteps(SUBMISSION_STEPS);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-3xl md:text-4xl font-bold text-white"
              >
                Transform Accounting Firm Ownership
              </motion.h1>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="test-mode" className="text-sm text-white/60">
                  Test Mode
                </Label>
                <Switch
                  id="test-mode"
                  checked={isTestMode}
                  onCheckedChange={handleTestModeToggle}
                  className={cn(
                    "data-[state=checked]:bg-yellow-500",
                    !isConnected && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!isConnected}
                />
              </div>
            </div>

            <Card className="bg-black/40 border-white/5 backdrop-blur-sm overflow-hidden">
              <div className="border-b border-white/5">
                <div className="p-6 space-y-3">
                  <p className="text-gray-200 text-lg">
                    Ready to revolutionize how accounting practices are acquired? Your investment proposal could be the key to unlocking collaborative firm ownership.
                  </p>
                  <p className="text-gray-400">
                    Follow these steps to present your vision to our community of forward-thinking investors.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <Collapsible open={isThesisOpen} onOpenChange={setIsThesisOpen} className="w-full">
                  <CollapsibleTrigger asChild>
                    <button type="button" className="w-full text-left">
                      <div className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold">
                          1
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                            Basic Thesis Information
                          </h2>
                          <p className="text-sm text-white/60">
                            Title and investment details
                          </p>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 text-white/60 transition-transform duration-200", isThesisOpen && "transform rotate-180")} />
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 px-4 pb-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-white">
                          Thesis Title
                        </Label>
                        <Input placeholder="Enter a clear, descriptive title" className="bg-black/50 border-white/10 text-white placeholder:text-white/40 h-12" value={formData.title} onChange={e => handleFormDataChange('title', e.target.value)} />
                        {formErrors.title && <p className="text-red-400 text-sm">{formErrors.title[0]}</p>}
                      </div>

                      <TargetCapitalInput value={formData.investment.targetCapital} onChange={value => handleFormDataChange('investment.targetCapital', value)} error={formErrors['investment.targetCapital']} />

                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-white">
                          Investment Drivers
                        </Label>
                        <textarea placeholder="Describe the key drivers behind this investment thesis..." className="w-full h-32 bg-black/50 border-white/10 text-white placeholder:text-white/40 rounded-md p-3" value={formData.investment.drivers} onChange={e => handleFormDataChange('investment.drivers', e.target.value)} />
                        {formErrors['investment.drivers'] && <p className="text-red-400 text-sm">{formErrors['investment.drivers'][0]}</p>}
                      </div>
                    </div>
                    {isThesisOpen && renderContinueButton(() => {
                      if (validateBasicsTab()) {
                        setIsThesisOpen(false);
                        setIsStrategyOpen(true);
                      }
                    })}
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={isStrategyOpen} onOpenChange={setIsStrategyOpen} className="w-full">
                  <CollapsibleTrigger asChild>
                    <button type="button" className="w-full text-left">
                      <div className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold">
                          2
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                            Target Company Profile
                          </h2>
                          <p className="text-sm text-white/60">
                            Size, location, and deal structure
                          </p>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 text-white/60 transition-transform duration-200", isStrategyOpen && "transform rotate-180")} />
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 px-4 pb-6">
                    <FirmCriteriaSection 
                      formData={{
                        firmCriteria: {
                          size: formData.firmCriteria.size,
                          location: formData.firmCriteria.location,
                          dealType: formData.firmCriteria.dealType,
                          geographicFocus: formData.firmCriteria.geographicFocus
                        }
                      }}
                      formErrors={formErrors}
                      onChange={(field, value) => handleFormDataChange(`firmCriteria.${field}`, value)}
                    />
                    {isStrategyOpen && renderContinueButton(() => {
                      if (validateFirmTab()) {
                        setIsStrategyOpen(false);
                        setIsApprovalOpen(true);
                      }
                    })}
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={isApprovalOpen} onOpenChange={setIsApprovalOpen} className="w-full">
                  <CollapsibleTrigger asChild>
                    <button type="button" className="w-full text-left">
                      <div className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-semibold">
                          3
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-green-400 group-hover:text-green-300 transition-colors">
                            Deal Structure
                          </h2>
                          <p className="text-sm text-white/60">
                            Payment terms and post-acquisition strategies
                          </p>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 text-white/60 transition-transform duration-200", isApprovalOpen && "transform rotate-180")} />
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 px-4 pb-6">
                    <PaymentTermsSection
                      paymentTerms={formData.paymentTerms}
                      onChange={value => handleFormDataChange('paymentTerms', value)}
                      error={formErrors.paymentTerms}
                    />
                    <StrategiesSection
                      strategies={formData.strategies}
                      formErrors={formErrors}
                      onStrategyChange={handleStrategyChange}
                    />
                    <div className="space-y-4">
                      <Label className="text-lg font-medium text-white">
                        Additional Requirements
                      </Label>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
