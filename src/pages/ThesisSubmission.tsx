import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { subscribeToProposalEvents, waitForProposalCreation, EventConfig } from "@/services/eventListenerService";
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

  console.log("Token balances:", tokenBalances);
  
  const lgrToken = tokenBalances?.find(token => {
    console.log("Checking token:", token);
    return token.address?.toLowerCase() === LGR_TOKEN_ADDRESS.toLowerCase();
  });
  console.log("Found LGR token:", lgrToken);
  
  const lgrBalance = lgrToken?.balance?.toString() || "0";
  console.log("LGR balance:", lgrBalance);

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
    if (isSubmitting) return "Submitting...";
    if (activeStep === 'terms') return "Submit Thesis";
    return "Next Step";
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
          handleSubmit(new Event('submit') as any);
        }
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent, formData?: ProposalMetadata, isTestMode?: boolean) => {
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
        ...formData || formData,
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
        isTestMode ? TEST_FORM_DATA.investment.targetCapital : formData?.investment.targetCapital || ""
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
        title: isTestMode ? TEST_FORM_DATA.title : formData?.title || "",
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

  const handleApprovalComplete = async (submissionFormData: ProposalMetadata, approvalTx?: ethers.ContractTransaction, isTestMode?: boolean) => {
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

      const currentFormData = isTestMode ? TEST_FORM_DATA : formData;
      
      if (!currentFormData.investment.targetCapital) {
        throw new Error("Target capital is required");
      }

      console.log('Preparing data for IPFS submission:', { 
        isTestMode,
        formData: currentFormData,
        linkedInURL,
        submitter: address,
        timestamp: Date.now()
      });

      const effectiveFormData = {
        ...currentFormData,
        linkedInURL,
        submissionTimestamp: Date.now(),
        submitter: address
      };
      
      const ipfsUri = await uploadMetadataToPinata(effectiveFormData);
      console.log('IPFS upload result:', {
        ipfsUri,
        submittedData: effectiveFormData
      });

      const ipfsHash = ipfsUri.replace('ipfs://', '');
      
      if (!validateIPFSHash(ipfsHash)) {
        throw new Error("Invalid IPFS hash format");
      }

      const targetCapitalWei = ethers.utils.parseEther(
        isTestMode ? TEST_FORM_DATA.investment.targetCapital : effectiveFormData.investment.targetCapital
      );

      const proposalConfig: ProposalConfig = {
        targetCapital: targetCapitalWei,
        votingDuration,
        ipfsHash,
        metadata: effectiveFormData,
        linkedInURL
      };

      const result = await createProposal(proposalConfig, wallet);
      console.log('Proposal creation result:', result);
      setCurrentTxHash(result.hash);

      const provider = new ethers.providers.Web3Provider(await wallet.getWalletClient() as any);
      const receipt = await result.wait();
      console.log('Transaction receipt received:', receipt);

      if (receipt.status === 1) {
        setSubmissionComplete(true);
        updateStepStatus('submission', 'completed');

        toast({
          title: `${isTestMode ? 'Test Proposal' : 'Proposal'} Submitted`,
          description: `Your ${isTestMode ? 'test ' : ''}investment thesis has been submitted successfully!`
        });

        const userProposals: StoredProposal[] = JSON.parse(localStorage.getItem('userProposals') || '[]');
        const newProposal: StoredProposal = {
          hash: result.hash,
          ipfsHash,
          timestamp: new Date().toISOString(),
          title: isTestMode ? TEST_FORM_DATA.title : effectiveFormData.title,
          targetCapital: targetCapitalWei.toString(),
          status: 'pending'
        };
        userProposals.push(newProposal);
        localStorage.setItem('userProposals', JSON.stringify(userProposals));

        setTimeout(() => {
          navigate('/proposals');
        }, 2000);
      } else {
        throw new Error('Transaction failed');
      }

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

  const handleNextStep = () => {
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
        if (isValid) {
          handleSubmit(new Event('submit') as any);
        }
        break;
    }

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields before proceeding",
        variant: "destructive"
      });
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
              <BreadcrumbLink asChild>
                <Link to="/proposals" className="hover:text-white">Proposals</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Share Investment Strategy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-teal-500 mb-4">
            Share Your Investment Strategy
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Present your acquisition strategy to find co-investors who share your vision. Define your target profile, growth plans, and execution approach.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <div className="sticky top-32 space-y-4">
              {renderSteps()}
            </div>
          </div>

          <div className="col-span-6 space-y-6">
            <Card className={cn(
              "bg-black/40 border-white/5 backdrop-blur-sm overflow-hidden",
              formErrors && Object.keys(formErrors).length > 0 ? "border-red-500/20" : ""
            )}>
              <div className="p-6">
                {activeStep === 'thesis' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Investment Thesis Details</h2>
                    
                    <div>
                      <Label htmlFor="title" className="text-white mb-2 block">Thesis Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleFormDataChange('title', e.target.value)}
                        className="bg-black/50 border-white/10 text-white"
                        placeholder="Enter your investment thesis title"
                      />
                      {formErrors['title'] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors['title'][0]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="targetCapital" className="text-white mb-2 block">Target Capital (LGR)</Label>
                      <Input
                        id="targetCapital"
                        type="number"
                        value={formData.investment.targetCapital}
                        onChange={(e) => handleFormDataChange('investment.targetCapital', e.target.value)}
                        className="bg-black/50 border-white/10 text-white"
                        placeholder="Enter target capital amount"
                        min={ethers.utils.formatEther(MIN_TARGET_CAPITAL)}
                        max={ethers.utils.formatEther(MAX_TARGET_CAPITAL)}
                      />
                      {formErrors['investment.targetCapital'] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors['investment.targetCapital'][0]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="drivers" className="text-white mb-2 block">Investment Drivers</Label>
                      <textarea
                        id="drivers"
                        value={formData.investment.drivers}
                        onChange={(e) => handleFormDataChange('investment.drivers', e.target.value)}
                        className="w-full min-h-[100px] bg-black/50 border-white/10 text-white rounded-md p-3"
                        placeholder="Describe the key drivers for this investment"
                      />
                      {formErrors['investment.drivers'] && (
                        <p className="mt-1 text-sm text-red-500">{formErrors['investment.drivers'][0]}</p>
                      )}
                      <p className="text-sm text-white/60 mt-1">
                        {formData.investment.drivers.length}/500 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="additionalCriteria" className="text-white mb-2 block">Additional Criteria (Optional)</Label>
                      <textarea
                        id="additionalCriteria"
                        value={formData.investment.additionalCriteria}
                        onChange={(e) => handleFormDataChange('investment.additionalCriteria', e.target.value)}
                        className="w-full min-h-[100px] bg-black/50 border-white/10 text-white rounded-md p-3"
                        placeholder="Any additional criteria or requirements"
                      />
                      <p className="text-sm text-white/60 mt-1">
                        {formData.investment.additionalCriteria.length}/500 characters
                      </p>
                    </div>
                  </div>
                )}
                {activeStep === 'firm' && (
                  <FirmCriteriaSection
                    formData={formData}
                    onChange={handleFormDataChange}
                    formErrors={formErrors}
                  />
                )}
                {activeStep === 'strategy' && (
                  <StrategiesSection
                    formData={formData}
                    onChange={handleFormDataChange}
                    formErrors={formErrors}
                  />
                )}
                {activeStep === 'terms' && (
                  <PaymentTermsSection
                    formData={formData}
                    onChange={handleFormDataChange}
                    formErrors={formErrors}
                  />
                )}
                {activeStep === 'submission' && (
                  <ContractApprovalStatus
                    onApprovalComplete={handleApprovalComplete}
                    requiredAmount={SUBMISSION_FEE}
                    isTestMode={isTestMode}
                    currentFormData={formData}
                  />
                )}
              </div>
              <div className="p-6 border-t border-white/5">
                <Button
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full h-12",
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
                      <span>{getButtonText()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          <div className="col-span-3">
            <div className="sticky top-32 space-y-4">
              <LGRWalletDisplay 
                submissionFee={SUBMISSION_FEE}
                currentBalance={lgrBalance}
                walletAddress={address}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
