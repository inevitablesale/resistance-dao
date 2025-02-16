import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput } from "@/components/thesis/TargetCapitalInput";
import { ContractApprovalStatus } from "@/components/thesis/ContractApprovalStatus";
import Nav from "@/components/Nav";
import { FileText, AlertTriangle, Clock, CreditCard, Wallet, Building2, Target, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { uploadMetadataToPinata } from "@/services/pinataService";
import { getContractStatus, estimateProposalGas, createProposal } from "@/services/proposalContractService";
import { validateProposalMetadata, validateIPFSHash } from "@/services/proposalValidationService";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { SubmissionProgress } from "@/components/thesis/SubmissionProgress";
import { SubmissionFeeDisplay } from "@/components/thesis/SubmissionFeeDisplay";
import { ProposalsHistory } from "@/components/thesis/ProposalsHistory";
import { TransactionStatus } from "@/components/thesis/TransactionStatus";
import { IndustrySection } from "@/components/thesis/form-sections/IndustrySection";
import { FirmCriteriaSection } from "@/components/thesis/form-sections/FirmCriteriaSection";
import { PaymentTermsSection } from "@/components/thesis/form-sections/PaymentTermsSection";
import { StrategiesSection } from "@/components/thesis/form-sections/StrategiesSection";
import { motion } from "framer-motion";
import { StoredProposal } from "@/types/proposals";
import type { SubmissionStep } from "@/components/thesis/SubmissionProgress";

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
      setCurrentStep('submission');

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
      <LGRFloatingWidget />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
              Investment Thesis Submission
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Share your investment strategy with the LedgerFund DAO community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
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

                <div className="mt-6">
                  <TabsContent value="basics">
                    <Card className="bg-black/40 border-white/10 text-white">
                      <div className="p-6 space-y-6">
                        <div>
                          <Label className="text-lg font-medium text-white mb-2">
                            Thesis Title
                          </Label>
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

                        <ContractApprovalStatus
                          onApprovalComplete={() => updateStepStatus('approval', 'completed')}
                          requiredAmount={SUBMISSION_FEE.toString()}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="firm" className="m-0">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                      <div className="p-6">
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
                      <div className="p-6">
                        <StrategiesSection 
                          formData={formData}
                          formErrors={formErrors}
                          onChange={handleStrategyChange}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="terms" className="m-0">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                      <div className="p-6">
                        <PaymentTermsSection 
                          formData={formData}
                          formErrors={formErrors}
                          onChange={handleFormDataChange}
                        />
                      </div>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>

              <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
                <Button
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-300"
                >
                  {getButtonText()}
                </Button>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
