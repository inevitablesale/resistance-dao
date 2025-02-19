<lov-code>
import { useState, useEffect } from "react";
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

// Contract-aligned constants
const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds (matches contract)
const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds (matches contract)
const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000"); // 1,000 LGR (matches contract)
const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000"); // 25M LGR (matches contract)
const SUBMISSION_FEE = ethers.utils.parseEther("250"); // 250 LGR
const VOTING_FEE = ethers.utils.parseEther("10"); // 10 LGR
const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";

// Text length constraints (matching contract)
const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 100;
const INVESTMENT_DRIVERS_MIN_LENGTH = 50;
const INVESTMENT_DRIVERS_MAX_LENGTH = 500;
const ADDITIONAL_CRITERIA_MAX_LENGTH = 500;
const LINKEDIN_URL_MAX_LENGTH = 200;

// Strategy constraints
const MAX_STRATEGIES_PER_CATEGORY = 3;
const MAX_PAYMENT_TERMS = 5;

const SUBMISSION_STEPS = [{
  id: 'thesis',
  title: 'Investment Thesis',
  status: 'pending',
  description: 'Fill out your investment thesis details'
}, {
  id: 'firm',
  title: 'Firm Details',
  status: 'pending',
  description: 'Define your target firm criteria'
}, {
  id: 'strategy',
  title: 'Strategy Selection',
  status: 'pending',
  description: 'Select your post-acquisition strategies'
}, {
  id: 'terms',
  title: 'Payment Terms',
  status: 'pending',
  description: 'Define your payment structure'
}];

const validateTitle = (title: string): string[] => {
  const errors: string[] = [];
  if (!title) {
    errors.push('Title is required');
  } else if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
    errors.push(`Title must be between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters`);
  }
  return errors;
};

const validateInvestmentDrivers = (drivers: string): string[] => {
  const errors: string[] = [];
  if (!drivers) {
    errors.push('Investment drivers are required');
  } else if (drivers.length < INVESTMENT_DRIVERS_MIN_LENGTH || drivers.length > INVESTMENT_DRIVERS_MAX_LENGTH) {
    errors.push(`Investment drivers must be between ${INVESTMENT_DRIVERS_MIN_LENGTH} and ${INVESTMENT_DRIVERS_MAX_LENGTH} characters`);
  }
  return errors;
};

const validateAdditionalCriteria = (criteria: string): string[] => {
  const errors: string[] = [];
  if (criteria && criteria.length > ADDITIONAL_CRITERIA_MAX_LENGTH) {
    errors.push(`Additional criteria must not exceed ${ADDITIONAL_CRITERIA_MAX_LENGTH} characters`);
  }
  return errors;
};

const validateLinkedInURL = (url: string): string[] => {
  const errors: string[] = [];
  if (!url) {
    errors.push('LinkedIn URL is required');
  } else if (url.length > LINKEDIN_URL_MAX_LENGTH) {
    errors.push(`LinkedIn URL must not exceed ${LINKEDIN_URL_MAX_LENGTH} characters`);
  } else if (!url.startsWith('https://www.linkedin.com/') && !url.startsWith('https://linkedin.com/')) {
    errors.push('Invalid LinkedIn URL format');
  }
  return errors;
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

  const isTestMode = true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [activeStep, setActiveStep] = useState<string>('thesis');
  const [steps, setSteps] = useState(SUBMISSION_STEPS);
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
  const [votingDuration, setVotingDuration] = useState(MIN_VOTING_DURATION);
  
  // Initialize form data with test mode flag matching constant
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
    isTestMode: true // Matching the constant
  });

  // Clear form errors when changing steps
  useEffect(() => {
    setFormErrors({});
  }, [activeStep]);

  // LinkedIn URL validation
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

  const validateLinkedInURLFromProfile = (): boolean => {
    const linkedInURL = user?.metadata?.["LinkedIn Profile URL"] as string;
    if (!linkedInURL) {
      setFormErrors(prev => ({
        ...prev,
        linkedInURL: ['LinkedIn URL is required. Please add it in your wallet settings.']
      }));
      return false;
    }
    if (!linkedInURL.startsWith('https://www.linkedin.com/') && !linkedInURL.startsWith('https://linkedin.com/')) {
      setFormErrors(prev => ({
        ...prev,
        linkedInURL: ['Invalid LinkedIn URL format. Please update it in your wallet settings.']
      }));
      return false;
    }
    return true;
  };

  const updateStepStatus = (stepId: string, status: 'pending' | 'processing' | 'completed' | 'failed') => {
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

  const validateBasicsTab = (): boolean => {
    let isValid = true;
    const titleErrors = validateTitle(formData.title);
    const investmentDriversErrors = validateInvestmentDrivers(formData.investment.drivers);
    const additionalCriteriaErrors = validateAdditionalCriteria(formData.investment.additionalCriteria);
    const linkedInErrors = validateLinkedInURL(formData.linkedInURL);
  
    const errors: Record<string, string[]> = {};
  
    if (titleErrors.length) {
      errors.title = titleErrors;
      isValid = false;
    }
    if (investmentDriversErrors.length) {
      errors['investment.drivers'] = investmentDriversErrors;
      isValid = false;
    }
    if (additionalCriteriaErrors.length) {
      errors['investment.additionalCriteria'] = additionalCriteriaErrors;
      isValid = false;
    }
    if (linkedInErrors.length) {
      errors.linkedInURL = linkedInErrors;
      isValid = false;
    }
  
    if (!formData.investment.targetCapital) {
      errors['investment.targetCapital'] = ['Target capital is required'];
      isValid = false;
    } else {
      try {
        const targetCapitalWei = ethers.utils.parseEther(formData.investment.targetCapital);
        if (targetCapitalWei.lt(MIN_TARGET_CAPITAL)) {
          errors['investment.targetCapital'] = [`Minimum target capital is ${ethers.utils.formatEther(MIN_TARGET_CAPITAL)} LGR`];
          isValid = false;
        }
        if (targetCapitalWei.gt(MAX_TARGET_CAPITAL)) {
          errors['investment.targetCapital'] = [`Maximum target capital is ${ethers.utils.formatEther(MAX_TARGET_CAPITAL)} LGR`];
          isValid = false;
        }
      } catch (error) {
        errors['investment.targetCapital'] = ['Invalid target capital amount'];
        isValid = false;
      }
    }
  
    setFormErrors(errors);
    return isValid;
  };

  const validateFirmTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    let isValid = true;
    if (!formData.firmCriteria.size) {
      errors['firmCriteria.size'] = ['Please select a firm size'];
      isValid = false;
    }
    if (!formData.firmCriteria.dealType) {
      errors['firmCriteria.dealType'] = ['Please select a deal type'];
      isValid = false;
    }
    if (!formData.firmCriteria.geographicFocus) {
      errors['firmCriteria.geographicFocus'] = ['Please select a geographic focus'];
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const validateStrategyTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    let isValid = true;
    
    if (!formData.strategies.operational.length) {
      errors['strategies.operational'] = ['Please select at least one operational strategy'];
      isValid = false;
    } else if (formData.strategies.operational.length > 3) {
      errors['strategies.operational'] = ['Maximum 3 operational strategies allowed'];
      isValid = false;
    }
    
    if (!formData.strategies.growth.length) {
      errors['strategies.growth'] = ['Please select at least one growth strategy'];
      isValid = false;
    } else if (formData.strategies.growth.length > 3) {
      errors['strategies.growth'] = ['Maximum 3 growth strategies allowed'];
      isValid = false;
    }
    
    if (!formData.strategies.integration.length) {
      errors['strategies.integration'] = ['Please select at least one integration strategy'];
      isValid = false;
    } else if (formData.strategies.integration.length > 3) {
      errors['strategies.integration'] = ['Maximum 3 integration strategies allowed'];
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const validateTermsTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    let isValid = true;
    if (!formData.paymentTerms.length) {
      errors.paymentTerms = ['Please select at least one payment term'];
      isValid = false;
    }
    if (formData.paymentTerms.length > 5) {
      errors.paymentTerms = [`Maximum of 5 payment terms allowed`];
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
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

  const handleFormDataChange = (field: keyof ProposalMetadata | string, value: any) => {
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

    const nextStepMap: Record<string, string> = {
      'thesis': 'firm',
      'firm': 'strategy',
      'strategy': 'terms'
    };

    const nextStep = nextStepMap[activeStep];
    if (nextStep) {
      updateStepStatus(activeStep, 'completed');
      setActiveStep(nextStep);
    } else if (activeStep === 'terms' && validateTermsTab()) {
      handleSubmit(e);
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

      if (!validateLinkedInURLFromProfile()) {
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
        isTestMode ? "2500000" : formData?.investment.targetCapital || ""
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
        title: isTestMode ? "Test Proposal - Automated Backend Services Firm" : formData?.title || "",
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

  const handleApprovalComplete = async (formData: any, approvalTx?: ethers.ContractTransaction, isTestMode?: boolean) => {
    try {
      setIsSubmitting(true);
      setFormErrors({});

      if (!validateLinkedInURLFromProfile()) {
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

      const effectiveFormData = isTestMode ? {
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
      } : formData;

      console.log('Preparing data for IPFS submission:', { 
        isTestMode,
        effectiveFormData,
        linkedInURL,
        submitter: address,
        timestamp: Date.now()
      });
      
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
        isTestMode ? "2500000" : effectiveFormData.investment.targetCapital
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

      if (receipt.status === 1) { // Transaction successful
        setSubmissionComplete(true);
        updateStepStatus('submission', 'completed');

        toast({
          title: `${isTestMode ? 'Test Proposal' : 'Proposal'} Submitted`,
          description: `Your ${isTestMode ? 'test ' : ''}investment thesis has been submitted successfully!`
        });

        // Store proposal in local storage
        const userProposals: StoredProposal[] = JSON.parse(localStorage.getItem('userProposals') || '[]');
        const newProposal: StoredProposal = {
          hash: result.hash,
          ipfsHash,
          timestamp: new Date().toISOString(),
          title: isTestMode ? "Test Proposal - Automated Backend Services Firm" : effectiveFormData.title,
          targetCapital: targetCapitalWei.toString(),
          status: 'pending'
        };
        userProposals.push(newProposal);
        localStorage.setItem('userProposals', JSON.stringify(userProposals));

        // Redirect after a short delay to allow the user to see the success state
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
          onClick={() => handleContinue(new Event('click') as any)}
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

  const renderContinueButton = (
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
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

  const handlePromotionSelect = (frequency: 'weekly' | 'monthly') => {
    // Implement promotion selection logic here
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
                <Link to="/proposals" className="hover:text-white">All Fund Proposals</Link>
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
          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Validate your strategy risk-free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Find aligned co-investors early</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Build momentum before launch</span>
            </div>
          </div>
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {activeStep === 'thesis' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-white">Thesis Title</Label>
                        <Input 
                          placeholder="Enter a clear, descriptive title"
                          className="bg-black/50 border-white/10 text-white placeholder:text-white/40 h-12 focus:border-yellow-500/50"
                          value={formData.title}
                          onChange={e => handleFormDataChange('title', e.target.value)}
                        />
                        {formErrors.title && (
                          <p className="text-red-400 text-sm">{formErrors.
