import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput } from "@/components/thesis/TargetCapitalInput";
import { ContractApprovalStatus } from "@/components/thesis/ContractApprovalStatus";
import { FileText, AlertTriangle, Clock, CreditCard, Wallet, Building2, Target, Briefcase, ArrowRight, ChevronDown, ChevronUp, Check } from "lucide-react";
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
import { subscribeToProposalEvents, waitForProposalCreation } from "@/services/eventListenerService";
import { 
  FirmSize, 
  DealType, 
  GeographicFocus,
  PaymentTerm,
  OperationalStrategy,
  GrowthStrategy,
  IntegrationStrategy,
  ProposalMetadata,
  ProposalConfig,
  StoredProposal
} from "@/types/proposals";
import { WalletConnectionOverlay } from "@/components/thesis/WalletConnectionOverlay";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  title: 'Investment Details',
  status: 'pending',
  description: 'Define your investment thesis and target capital'
}, {
  id: 'firm',
  title: 'Firm Criteria',
  status: 'pending',
  description: 'Specify target firm characteristics'
}, {
  id: 'strategy',
  title: 'Growth Strategy',
  status: 'pending',
  description: 'Select operational and growth strategies'
}, {
  id: 'terms',
  title: 'Payment Terms',
  status: 'pending',
  description: 'Define acquisition payment structure'
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
    PaymentTerm.CASH,
    PaymentTerm.SELLER_FINANCING,
    PaymentTerm.EARNOUT
  ],
  strategies: {
    operational: [
      OperationalStrategy.TECH_MODERNIZATION,
      OperationalStrategy.PROCESS_STANDARDIZATION
    ],
    growth: [
      GrowthStrategy.SERVICE_EXPANSION,
      GrowthStrategy.CLIENT_GROWTH
    ],
    integration: [
      IntegrationStrategy.MERGING_OPERATIONS,
      IntegrationStrategy.SYSTEMS_CONSOLIDATION
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, address, connect, approveLGR, wallet } = useWalletConnection();
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
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [activeStep, setActiveStep] = useState<string>('thesis');
  const [steps, setSteps] = useState<SubmissionStep[]>(SUBMISSION_STEPS);
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
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

  useEffect(() => {
    if (isTestMode) {
      console.log("Setting test form data:", TEST_FORM_DATA);
      setFormData({
        ...TEST_FORM_DATA,
        linkedInURL: user?.metadata?.["LinkedIn Profile URL"] || "",
        submissionTimestamp: Date.now(),
        submitter: address
      });
    }
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

  const handleStrategyChange = (
    category: "operational" | "growth" | "integration",
    values: (OperationalStrategy | GrowthStrategy | IntegrationStrategy)[]
  ) => {
    setFormData(prev => ({
      ...prev,
      strategies: {
        ...prev.strategies,
        [category]: values
      }
    }));
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
      
      if (field === 'firmCriteria.size') {
        current[lastField] = Number(value) as FirmSize;
      } else if (field === 'firmCriteria.dealType') {
        current[lastField] = Number(value) as DealType;
      } else if (field === 'firmCriteria.geographicFocus') {
        current[lastField] = Number(value) as GeographicFocus;
      } else if (field.startsWith('strategies.')) {
        current[lastField] = value;
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
      return <div className="flex items-center justify-center">
          <span className="mr-2">Submitting...</span>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
        </div>;
    }
    switch (activeStep) {
      case 'thesis':
        return "Continue to Firm Details";
      case 'firm':
        return "Continue to Strategy Selection";
      case 'strategy':
        return "Continue to Payment Terms";
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
    if (formData.title.trim().length > 100) {
      errors.title = ['Title must not exceed 100 characters'];
    }
    if (!formData.investment.targetCapital) {
      errors['investment.targetCapital'] = ['Target capital is required'];
    } else {
      try {
        const targetCapitalWei = ethers.utils.parseEther(formData.investment.targetCapital);
        if (targetCapitalWei.lt(MIN_TARGET_CAPITAL)) {
          errors['investment.targetCapital'] = [`Minimum target capital is ${ethers.utils.formatEther(MIN_TARGET_CAPITAL)} LGR`];
        }
        if (targetCapitalWei.gt(MAX_TARGET_CAPITAL)) {
          errors['investment.targetCapital'] = [`Maximum target capital is ${ethers.utils.formatEther(MAX_TARGET_CAPITAL)} LGR`];
        }
      } catch (error) {
        errors['investment.targetCapital'] = ['Invalid target capital amount'];
      }
    }
    if (!formData.investment.drivers || formData.investment.drivers.trim().length < 50) {
      errors['investment.drivers'] = ['Investment drivers must be at least 50 characters'];
    }
    if (formData.investment.drivers.trim().length > 500) {
      errors['investment.drivers'] = ['Investment drivers must not exceed 500 characters'];
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFirmTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    if (!formData.firmCriteria.size) {
      errors['firmCriteria.size'] = ['Please select a firm size'];
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
    } else if (formData.strategies.operational.length > 3) {
      errors['strategies.operational'] = ['Maximum 3 operational strategies allowed'];
    }
    
    if (!formData.strategies.growth.length) {
      errors['strategies.growth'] = ['Please select at least one growth strategy'];
    } else if (formData.strategies.growth.length > 3) {
      errors['strategies.growth'] = ['Maximum 3 growth strategies allowed'];
    }
    
    if (!formData.strategies.integration.length) {
      errors['strategies.integration'] = ['Please select at least one integration strategy'];
    } else if (formData.strategies.integration.length > 3) {
      errors['strategies.integration'] = ['Maximum 3 integration strategies allowed'];
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

  const getCurrentValidator = () => {
    switch (activeStep) {
      case 'thesis':
        return validateBasicsTab;
      case 'firm':
        return validateFirmTab;
      case 'strategy':
        return validateStrategyTab;
      case 'terms':
        return validateTermsTab;
      default:
        return () => true;
    }
  };

  const handleStepChange = (newStep: string) => {
    const currentValidator = getCurrentValidator();
    if (currentValidator()) {
      updateStepStatus(activeStep, 'completed');
      setActiveStep(newStep);
    } else {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields before proceeding",
        variant: "destructive"
      });
    }
  };

  const renderSteps = () => (
    SUBMISSION_STEPS.map((step, index) => (
      <div 
        key={step.id}
        className={cn(
          "relative",
          index !== SUBMISSION_STEPS.length - 1 && "pb-8 after:absolute after:left-5 after:top-8 after:h-full after:w-0.5",
          step.status === 'completed' ? "after:bg-yellow-500" : "after:bg-white/10"
        )}
      >
        <button
          onClick={() => handleStepChange(step.id)}
          className={cn(
            "flex items-start gap-4 w-full rounded-lg p-4 transition-colors",
            step.id === activeStep ? "bg-white/5" : "hover:bg-white/5",
            formErrors && Object.keys(formErrors).length > 0 && step.id === activeStep ? "border border-red-500/50" : ""
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
            step.status === 'completed' ? "bg-yellow-500 text-white" :
            step.status === 'processing' ? "bg-teal-500 text-white animate-pulse" :
            step.id === activeStep ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500" :
            "bg-white/5 text-white/40"
          )}>
            {step.status === 'completed' ? (
              <Check className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </div>
          <div className="text-left">
            <p className={cn(
              "font-medium",
              step.id === activeStep ? "text-white" : "text-white/60"
            )}>
              {step.title}
            </p>
            <p className="text-sm text-white/40">
              {step.description}
            </p>
            {formErrors && Object.keys(formErrors).length > 0 && step.id === activeStep && (
              <p className="text-sm text-red-400 mt-2">
                Please fix validation errors before proceeding
              </p>
            )}
          </div>
        </button>
      </div>
    ))
  );

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentValidator = getCurrentValidator();
    
    if (!currentValidator()) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields before proceeding",
        variant: "destructive"
      });
      return;
    }

    switch (activeStep) {
      case 'thesis':
        handleStepChange('firm');
        break;
      case 'firm':
        handleStepChange('strategy');
        break;
      case 'strategy':
        handleStepChange('terms');
        break;
      case 'terms':
        if (validateTermsTab()) {
          handleSubmit(e as any, isTestMode);
        }
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent, isTestMode: boolean = false) => {
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

      const effectiveFormData = isTestMode ? TEST_FORM_DATA : formData;
      await handleApprovalComplete(effectiveFormData, undefined, isTestMode);

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

  const handleApprovalComplete = async (formData: ProposalMetadata, approvalTx?: ethers.ContractTransaction, isTestMode?: boolean) => {
    try {
      setIsSubmitting(true);
      setFormErrors({});

      if (!validateLinkedInURL()) {
        throw new Error("Please add a valid LinkedIn URL in your wallet settings");
      }

      updateStepStatus('thesis', 'completed');
      updateStepStatus('firm', 'completed');
      updateStepStatus('strategy', 'completed');
      updateStepStatus('terms', 'completed');
      setActiveStep('submission');

      if (!wallet) {
        throw new Error("No wallet connected");
      }

      const linkedInURL = user?.metadata?.["LinkedIn Profile URL"] as string;
      console.log('Retrieved LinkedIn URL:', linkedInURL);

      // Create complete proposal metadata
      const completeMetadata: ProposalMetadata = {
        title: isTestMode ? TEST_FORM_DATA.title : formData.title,
        firmCriteria: {
          size: isTestMode ? TEST_FORM_DATA.firmCriteria.size : formData.firmCriteria.size,
          location: isTestMode ? TEST_FORM_DATA.firmCriteria.location : formData.firmCriteria.location,
          dealType: isTestMode ? TEST_FORM_DATA.firmCriteria.dealType : formData.firmCriteria.dealType,
          geographicFocus: isTestMode ? TEST_FORM_DATA.firmCriteria.geographicFocus : formData.firmCriteria.geographicFocus
        },
        paymentTerms: isTestMode ? TEST_FORM_DATA.paymentTerms : formData.paymentTerms,
        strategies: {
          operational: isTestMode ? TEST_FORM_DATA.strategies.operational : formData.strategies.operational,
          growth: isTestMode ? TEST_FORM_DATA.strategies.growth : formData.strategies.growth,
          integration: isTestMode ? TEST_FORM_DATA.strategies.integration : formData.strategies.integration
        },
        investment: {
          targetCapital: isTestMode ? TEST_FORM_DATA.investment.targetCapital : formData.investment.targetCapital,
          drivers: isTestMode ? TEST_FORM_DATA.investment.drivers : formData.investment.drivers,
          additionalCriteria: isTestMode ? TEST_FORM_DATA.investment.additionalCriteria : formData.investment.additionalCriteria
        },
        votingDuration,
        linkedInURL,
        isTestMode,
        submissionTimestamp: Date.now(),
        submitter: address
      };

      console.log('Uploading metadata to IPFS...', { 
        isTestMode,
        metadata: completeMetadata 
      });
      
      const ipfsUri = await uploadMetadataToPinata(completeMetadata);
      const ipfsHash = ipfsUri.replace('ipfs://', '');
      
      if (!validateIPFSHash(ipfsHash)) {
        throw new Error("Invalid IPFS hash format");
      }

      console.log('Estimating gas for proposal creation...', { 
        isTestMode,
        ipfsHash,
        targetCapital: completeMetadata.investment.targetCapital
      });

      const targetCapitalWei = ethers.utils.parseEther(
        isTestMode ? TEST_FORM_DATA.investment.targetCapital : completeMetadata.investment.targetCapital
      );

      const proposalConfig: ProposalConfig = {
        targetCapital: targetCapitalWei,
        votingDuration,
        ipfsHash,
        metadata: completeMetadata,
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
        title: isTestMode ? TEST_FORM_DATA.title : completeMetadata.title,
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
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
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
    
    setIsTestMode(enabled);
    if (enabled) {
      setFormData(TEST_FORM_DATA);
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
    }
  };

  const handlePromotionSelect = (frequency: 'weekly' | 'monthly') => {
    // Implement promotion selection logic here
  };

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 'thesis':
        return (
          <Card className="w-full bg-black/40 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Investment Thesis Details</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">Investment Thesis Title</Label>
                  <Input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleFormDataChange('title', e.target.value)}
                    placeholder="e.g., Acquisition of High-Growth SaaS Company"
                  />
                  {formErrors.title && formErrors.title.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                  ))}
                </div>
                <div>
                  <Label htmlFor="targetCapital" className="text-white">Target Capital (LGR)</Label>
                  <Input
                    type="number"
                    id="targetCapital"
                    value={formData.investment.targetCapital}
                    onChange={(e) => handleFormDataChange('investment.targetCapital', e.target.value)}
                    placeholder="e.g., 2500000"
                  />
                  {formErrors['investment.targetCapital'] && formErrors['investment.targetCapital'].map((error, index) => (
                    <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                  ))}
                </div>
                <div>
                  <Label htmlFor="drivers" className="text-white">Investment Drivers</Label>
                  <Input
                    id="drivers"
                    value={formData.investment.drivers}
                    onChange={(e) => handleFormDataChange('investment.drivers', e.target.value)}
                    placeholder="e.g., Strong recurring revenue, high potential for automation"
                  />
                  {formErrors['investment.drivers'] && formErrors['investment.drivers'].map((error, index) => (
                    <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                  ))}
                </div>
                <div>
                  <Label htmlFor="additionalCriteria" className="text-white">Additional Criteria</Label>
                  <Input
                    id="additionalCriteria"
                    value={formData.investment.additionalCriteria}
                    onChange={(e) => handleFormDataChange('investment.additionalCriteria', e.target.value)}
                    placeholder="e.g., Preference for firms with existing cloud infrastructure"
                  />
                </div>
              </div>
              <Button
                onClick={handleContinue}
                className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 text-white"
              >
                Continue to Firm Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );
      case 'firm':
        return (
          <Card className="w-full bg-black/40 border-white/10">
            <CardContent className="p-6">
              <FirmCriteriaSection
                formData={formData}
                formErrors={formErrors}
                onChange={handleFormDataChange}
              />
              <Button
                onClick={handleContinue}
                className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 text-white"
              >
                Continue to Strategy Selection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );
      case 'strategy':
        return (
          <Card className="w-full bg-black/40 border-white/10">
            <CardContent className="p-6">
              <StrategiesSection
                formData={formData}
                formErrors={formErrors}
                onChange={handleStrategyChange}
              />
              <Button
                onClick={handleContinue}
                className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 text-white"
              >
                Continue to Payment Terms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );
      case 'terms':
        return (
          <Card className="w-full bg-black/40 border-white/10">
            <CardContent className="p-6">
              <PaymentTermsSection
                formData={formData}
                formErrors={formErrors}
                onChange={handleFormDataChange}
              />
              <Button
                onClick={handleContinue}
                className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600 text-white"
              >
                Submit Investment Thesis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {!isConnected && <WalletConnectionOverlay requiredAmount={SUBMISSION_FEE} />}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-teal-500/5 to-yellow-500/5 animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black" />

      <div className="container mx-auto px-4 relative z-10">
        <Breadcrumb className="pt-8 mb-8">
          <BreadcrumbList className="text-white/60">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="hover:text-white">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Test Your Investment Thesis</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-teal-500 mb-4">
            Test Your Investment Thesis
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Share your acquisition strategy to validate market interest and find aligned co-investors before committing resources to fund formation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
          <div className="space-y-4">
            {renderSteps()}
          </div>
          <div>
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
