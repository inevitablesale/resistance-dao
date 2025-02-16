import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Nav from "@/components/Nav";
import { FileText, AlertTriangle, Clock, CreditCard, Wallet, Building2, Target, Briefcase, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { uploadMetadataToPinata } from "@/services/pinataService";
import { getContractStatus, estimateProposalGas, createProposal } from "@/services/proposalContractService";
import { validateProposalMetadata, validateIPFSHash, validateContractParameters } from "@/services/proposalValidationService";
import { executeTransaction } from "@/services/transactionManager";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { SubmissionProgress, SubmissionStep } from "@/components/thesis/SubmissionProgress";
import { SubmissionFeeDisplay } from "@/components/thesis/SubmissionFeeDisplay";
import { ProposalsHistory } from "@/components/thesis/ProposalsHistory";
import { TransactionStatus } from "@/components/thesis/TransactionStatus";
import { IndustrySection } from "@/components/thesis/form-sections/IndustrySection";
import { FirmCriteriaSection } from "@/components/thesis/form-sections/FirmCriteriaSection";
import { PaymentTermsSection } from "@/components/thesis/form-sections/PaymentTermsSection";
import { StrategiesSection } from "@/components/thesis/form-sections/StrategiesSection";
import { motion } from "framer-motion";
import { StoredProposal } from "@/types/proposals";

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
  industry: {
    focus: string;
    other?: string;
  };
  firmCriteria: {
    size: string;
    location: string;
    dealType: string;
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
  const { tokenBalances, isLoading } = useTokenBalances({
    networkId: 137,
    accountAddress: address,
    includeFiat: false,
    includeNativeBalance: false,
    tokenAddresses: [LGR_TOKEN_ADDRESS]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<ProposalMetadata>({
    title: "",
    industry: {
      focus: "",
      other: ""
    },
    firmCriteria: {
      size: "",
      location: "",
      dealType: ""
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

  const [votingDuration, setVotingDuration] = useState<number>(MIN_VOTING_DURATION);
  const [hasShownBalanceWarning, setHasShownBalanceWarning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('thesis');
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [steps, setSteps] = useState<SubmissionStep[]>(SUBMISSION_STEPS);
  const [activeTab, setActiveTab] = useState("basics");

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

    switch (activeTab) {
      case 'basics':
        return "Continue to Firm Details";
      case 'firm':
        return "Continue to Strategy";
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

    if (!formData.investment.targetCapital || !/^\d+(\.\d{1,2})?$/.test(formData.investment.targetCapital)) {
      errors['investment.targetCapital'] = ['Please enter a valid target capital amount'];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFirmTab = (): boolean => {
    const errors: Record<string, string[]> = {};
    
    if (!formData.industry.focus) {
      errors['industry.focus'] = ['Please select an industry focus'];
    }
    if (formData.industry.focus === 'other' && !formData.industry.other) {
      errors['industry.other'] = ['Please specify the industry'];
    }
    if (!formData.firmCriteria.size) {
      errors['firmCriteria.size'] = ['Please select a firm size'];
    }
    if (!formData.firmCriteria.location) {
      errors['firmCriteria.location'] = ['Please select a location'];
    }
    if (!formData.firmCriteria.dealType) {
      errors['firmCriteria.dealType'] = ['Please select a deal type'];
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

    switch (activeTab) {
      case 'basics':
        isValid = validateBasicsTab();
        if (isValid) setActiveTab('firm');
        break;
      case 'firm':
        isValid = validateFirmTab();
        if (isValid) setActiveTab('strategy');
        break;
      case 'strategy':
        isValid = validateStrategyTab();
        if (isValid) setActiveTab('terms');
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

  useEffect(() => {
    const checkLGRBalance = () => {
      if (isConnected && address && !hasShownBalanceWarning && !isLoading && tokenBalances) {
        const lgrBalance = tokenBalances.find(
          token => token.symbol === "LGR"
        );
        
        if (!lgrBalance || Number(lgrBalance.balance) < Number(ethers.utils.formatEther(SUBMISSION_FEE))) {
          toast({
            title: "Insufficient LGR Balance",
            description: `You'll need ${ethers.utils.formatEther(SUBMISSION_FEE)} LGR tokens to submit a thesis. You can continue filling out the form and purchase tokens before submission.`,
            variant: "destructive"
          });
          setHasShownBalanceWarning(true);
        }
      }
    };

    checkLGRBalance();
  }, [isConnected, address, tokenBalances, isLoading, toast, hasShownBalanceWarning]);

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
      setCurrentStep('approval');

      // Validate proposal metadata
      const validationResult = validateProposalMetadata(formData);
      if (!validationResult.isValid) {
        setFormErrors(validationResult.errors);
        toast({
          title: "Validation Error",
          description: "Please fix the highlighted fields",
          variant: "destructive"
        });
        return;
      }

      // Get contract status and validate
      if (!wallet) {
        throw new Error("No wallet connected");
      }
      const contractStatus = await getContractStatus(wallet);
      
      if (contractStatus.isPaused) {
        toast({
          title: "Contract Paused",
          description: "The contract is currently paused for maintenance",
          variant: "destructive"
        });
        return;
      }

      // Approve LGR tokens
      console.log('Approving LGR tokens for submission...');
      const submissionFeeApproval = await approveLGR(contractStatus.submissionFee.toString());
      if (!submissionFeeApproval) {
        updateStepStatus('approval', 'failed');
        toast({
          title: "Approval Failed",
          description: "Failed to approve LGR tokens for submission",
          variant: "destructive"
        });
        return;
      }

      updateStepStatus('approval', 'completed');
      updateStepStatus('submission', 'processing');
      setCurrentStep('submission');

      // Upload metadata to IPFS
      console.log('Uploading metadata to IPFS...');
      const ipfsUri = await uploadMetadataToPinata(formData);
      const ipfsHash = ipfsUri.replace('ipfs://', '');
      
      if (!validateIPFSHash(ipfsHash)) {
        updateStepStatus('submission', 'failed');
        toast({
          title: "IPFS Error",
          description: "Failed to upload metadata to IPFS",
          variant: "destructive"
        });
        return;
      }
      console.log('Metadata uploaded to IPFS:', ipfsHash);

      // Convert targetCapital to BigNumber
      const targetCapitalString = formData.investment.targetCapital;
      const targetCapital = ethers.utils.parseEther(targetCapitalString);
      
      const paramValidation = validateContractParameters(
        { targetCapital, votingDuration },
        contractStatus
      );

      if (!paramValidation.isValid) {
        setFormErrors(paramValidation.errors);
        updateStepStatus('submission', 'failed');
        toast({
          title: "Contract Parameter Error",
          description: Object.values(paramValidation.errors).flat().join(", "),
          variant: "destructive"
        });
        return;
      }

      // Create proposal
      console.log('Creating proposal...');
      const result = await createProposal({
        targetCapital,
        votingDuration,
        ipfsHash
      }, wallet);

      // Store proposal data
      const userProposals: StoredProposal[] = JSON.parse(localStorage.getItem('userProposals') || '[]');
      const newProposal: StoredProposal = {
        hash: result.hash,
        ipfsHash,
        timestamp: new Date().toISOString(),
        title: formData.title,
        targetCapital: formData.investment.targetCapital,
        status: 'pending'
      };
      userProposals.push(newProposal);
      localStorage.setItem('userProposals', JSON.stringify(userProposals));

      updateStepStatus('submission', 'completed');
      toast({
        title: "Success",
        description: "Your investment thesis has been submitted successfully",
      });

    } catch (error) {
      console.error("Submission error:", error);
      updateStepStatus(currentStep, 'failed');
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
    <div className="min-h-screen bg-[#030712] overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#0F172A] to-[#030712]"
          style={{ 
            maskImage: 'radial-gradient(circle at center, black, transparent)'
          }} 
        />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8 md:space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
              Investment Thesis Submission
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto px-4">
              Share your investment strategy with the LedgerFund DAO community
            </p>
          </div>

          
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          <div className="block lg:hidden mb-4 px-4">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Step {(['basics', 'firm', 'strategy', 'terms'].indexOf(activeTab) + 1).toString()} of 4</span>
              <span className="text-white font-medium">
                {activeTab === 'basics' ? 'Basic Details' :
                 activeTab === 'firm' ? 'Firm Details' :
                 activeTab === 'strategy' ? 'Strategy' : 'Terms'}
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full mt-2">
              <div 
                className="h-full bg-polygon-primary rounded-full transition-all duration-300"
                style={{ 
                  width: `${((['basics', 'firm', 'strategy', 'terms'].indexOf(activeTab) + 1) / 4 * 100).toString()}%` 
                }}
              />
            </div>
          </div>

          
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="hidden lg:grid grid-cols-4 gap-4 bg-transparent">
            <TabsTrigger
              value="basics"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Basics
            </TabsTrigger>
            <TabsTrigger
              value="firm"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Firm
            </TabsTrigger>
            <TabsTrigger
              value="strategy"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Strategy
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Terms
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 md:mt-6">
            <TabsContent value="basics" className="m-0">
              <Card className="bg-black/40 border-white/10 text-white">
                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                  <div>
                    <label className="text-lg font-medium text-white mb-2 block">
                      Thesis Title
                    </label>
                    <p className="text-sm text-gray-400 mb-2">
                      📌 Provide a concise name for the investment strategy
                    </p>
                    <Input
                      placeholder="Enter thesis title"
                      className={cn(
                        "bg-black/50 border-white/10 text-white placeholder:text-gray-500",
                        formErrors.title ? "border-red-500" : ""
                      )}
                      required
                      value={formData.title}
                      onChange={(e) => handleFormDataChange('title', e.target.value)}
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.title[0]}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-lg font-medium text-white">Voting Duration</Label>
                        <p className="text-sm text-gray-400">Set how long the community can vote on your thesis</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">
                          {Math.floor(votingDuration / (24 * 60 * 60))}
                        </span>
                        <span className="text-gray-400 ml-2">days</span>
                      </div>
                    </div>
                    <Slider
                      value={[votingDuration]}
                      min={MIN_VOTING_DURATION}
                      max={MAX_VOTING_DURATION}
                      step={24 * 60 * 60}
                      className="w-full"
                      onValueChange={handleVotingDurationChange}
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>7 days</span>
                      <span>90 days</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-medium text-white mb-2 block">Target Capital Raise (USD)</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter amount in USD"
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 pl-12"
                        required
                        value={formData.investment.targetCapital}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          handleFormDataChange('investment.targetCapital', value);
                        }}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="firm" className="m-0">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <div className="p-4 md:p-6">
                  <IndustrySection 
                    formData={formData}
                    formErrors={formErrors}
                    onChange={handleFormDataChange}
                  />
                  <div className="mt-8">
                    <FirmCriteriaSection 
                      formData={formData}
                      formErrors={formErrors}
                      onChange={handleFormDataChange}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="strategy" className="m-0">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <div className="p-4 md:p-6">
                  <StrategiesSection 
                    formData={formData}
                    formErrors={formErrors}
                    onChange={handleStrategyChange}
                  />
                  <div className="mt-8 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-lg font-medium text-white">
                          Key Investment Drivers
                        </label>
                        <span className={cn(
                          "text-sm",
                          formData.investment.drivers.length > MAX_SUMMARY_LENGTH 
                            ? "text-red-400" 
                            : "text-gray-400"
                        )}>
                          {formData.investment.drivers.length}/{MAX_SUMMARY_LENGTH}
                        </span>
                      </div>
                      <Textarea
                        placeholder="Describe earnings stability, strong client base, scalability, cultural fit, technology adoption, etc."
                        className="bg-black/50 border-white/10 min-h-[150px] text-white placeholder:text-gray-500"
                        required
                        value={formData.investment.drivers}
                        onChange={(e) => handleFormDataChange('investment.drivers', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="m-0">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <div className="p-4 md:p-6">
                  <PaymentTermsSection 
                    formData={formData}
                    formErrors={formErrors}
                    onChange={handleFormDataChange}
                  />
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-lg font-medium text-white">
                        Additional Investment Criteria
                      </label>
                      <span className={cn(
                        "text-sm",
                        formData.investment.additionalCriteria.length > MAX_SUMMARY_LENGTH 
                          ? "text-red-400" 
                            : "text-gray-400"
                      )}>
                        {formData.investment.additionalCriteria.length}/{MAX_SUMMARY_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      placeholder="EBITDA thresholds, firm specialization, geographic limitations, integration plans, etc."
                      className="bg-black/50 border-white/10 min-h-[150px] text-white placeholder:text-gray-500"
                      value={formData.investment.additionalCriteria}
                      onChange={(e) => handleFormDataChange('investment.additionalCriteria', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-white/10 lg:hidden">
        <div className="flex gap-4 max-w-md mx-auto">
          {activeTab !== 'basics' && (
            <Button
              onClick={() => {
                const tabs = ['basics', 'firm', 'strategy', 'terms'];
                const currentIndex = tabs.indexOf(activeTab);
                setActiveTab(tabs[currentIndex - 1]);
              }}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-300"
          >
            {getButtonText()}
          </Button>
        </div>
      </div>

      <Card className="hidden lg:block bg-black/40 border-white/10 backdrop-blur-sm p-6">
        <Button
          onClick={handleContinue}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-300"
        >
          {getButtonText()}
        </Button>
      </Card>
    </div>

    <div className="hidden lg:block lg:col-span-4 space-y-6">
      <SubmissionFeeDisplay 
        submissionFee={SUBMISSION_FEE.toString()}
        currentBalance={tokenBalances?.find(token => token.symbol === "LGR")?.balance}
      />

      <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Submission Progress</h2>
        <SubmissionProgress 
          steps={steps}
          currentStepId={currentStep}
        />
      </Card>

      {currentTxId && (
        <TransactionStatus
          transactionId={currentTxId}
          onComplete={() => setCurrentTxId(null)}
          onError={(error) => {
            toast({
              title: "Transaction Failed",
              description: error,
              variant: "destructive"
            });
          }}
        />
      )}

      <ProposalsHistory />
    </div>

    
      
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="fixed bottom-24 right-4 rounded-full w-12 h-12 p-0 bg-black/80 backdrop-blur-md border-white/10"
            >
              <Info className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] bg-black/95 border-white/10">
            <div className="h-full overflow-auto space-y-6 pb-24">
              <SubmissionFeeDisplay 
                submissionFee={SUBMISSION_FEE.toString()}
                currentBalance={tokenBalances?.find(token => token.symbol === "LGR")?.balance}
              />
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Submission Progress</h2>
                <SubmissionProgress 
                  steps={steps}
                  currentStepId={currentStep}
                />
              </Card>
              {currentTxId && (
                <TransactionStatus
                  transactionId={currentTxId}
                  onComplete={() => setCurrentTxId(null)}
                  onError={(error) => {
                    toast({
                      title: "Transaction Failed",
                      description: error,
                      variant: "destructive"
                    });
                  }}
                />
              )}
              <ProposalsHistory />
            </div>
          </Sheet
