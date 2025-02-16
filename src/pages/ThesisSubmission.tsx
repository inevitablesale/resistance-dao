import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Nav from "@/components/Nav";
import { AlertTriangle, ArrowRight, CreditCard, Wallet } from "lucide-react";
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

const CHECKOUT_STEPS = [
  {
    id: 'investment-details',
    title: 'Investment Details',
    description: 'Basic information about your investment thesis'
  },
  {
    id: 'strategy',
    title: 'Strategy',
    description: 'Define your investment approach'
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Review and submit'
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

  const [activeStep, setActiveStep] = useState('investment-details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [votingDuration, setVotingDuration] = useState(MIN_VOTING_DURATION);
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

  const [hasShownBalanceWarning, setHasShownBalanceWarning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('thesis');
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [steps, setSteps] = useState<SubmissionStep[]>(SUBMISSION_STEPS);

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

  // Fix TypeScript error by ensuring votingDuration is treated as a number
  const handleVotingDurationChange = (value: number[]) => {
    setVotingDuration(value[0]);
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

  const nextStep = () => {
    if (activeStep === 'investment-details') setActiveStep('strategy');
    else if (activeStep === 'strategy') setActiveStep('payment');
  };

  const prevStep = () => {
    if (activeStep === 'payment') setActiveStep('strategy');
    else if (activeStep === 'strategy') setActiveStep('investment-details');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Nav />
      <LGRFloatingWidget />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center gap-4 mb-8">
              {CHECKOUT_STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className="flex-1"
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3",
                      activeStep === step.id ? "bg-polygon-primary text-white" :
                      index < CHECKOUT_STEPS.findIndex(s => s.id === activeStep) ? 
                        "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                    )}>
                      {index < CHECKOUT_STEPS.findIndex(s => s.id === activeStep) ? 
                        "✓" : index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{step.title}</p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                    {index < CHECKOUT_STEPS.length - 1 && (
                      <div className="flex-1 h-px bg-gray-200 mx-4 mt-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-lg border-0 p-6">
                {activeStep === 'investment-details' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-lg font-medium text-gray-900 mb-2 block">
                        Thesis Title
                      </label>
                      <Input
                        placeholder="Enter thesis title"
                        className={cn(
                          "border-gray-200",
                          formErrors.title ? "border-red-500" : ""
                        )}
                        required
                        value={formData.title}
                        onChange={(e) => handleFormDataChange('title', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-lg font-medium text-gray-900 mb-2 block">
                        Target Capital Raise (USD)
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Enter amount"
                          className="pl-8 border-gray-200"
                          required
                          value={formData.investment.targetCapital}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleFormDataChange('investment.targetCapital', value);
                          }}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      </div>
                    </div>

                    <IndustrySection 
                      formData={formData}
                      formErrors={formErrors}
                      onChange={handleFormDataChange}
                    />

                    <FirmCriteriaSection 
                      formData={formData}
                      formErrors={formErrors}
                      onChange={handleFormDataChange}
                    />
                  </motion.div>
                )}

                {activeStep === 'strategy' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <StrategiesSection 
                      formData={formData}
                      formErrors={formErrors}
                      onChange={handleStrategyChange}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-lg font-medium text-gray-900">
                          Key Investment Drivers
                        </label>
                        <span className="text-sm text-gray-500">
                          {formData.investment.drivers.length}/{MAX_SUMMARY_LENGTH}
                        </span>
                      </div>
                      <Textarea
                        placeholder="Describe earnings stability, strong client base, scalability..."
                        className="border-gray-200"
                        required
                        value={formData.investment.drivers}
                        onChange={(e) => handleFormDataChange('investment.drivers', e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                {activeStep === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Submit</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submission Fee</span>
                          <span className="font-medium">{ethers.utils.formatEther(SUBMISSION_FEE)} LGR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Target Capital</span>
                          <span className="font-medium">${formData.investment.targetCapital}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Voting Duration</span>
                          <span className="font-medium">{Math.floor(votingDuration / (24 * 60 * 60))} days</span>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between font-medium">
                            <span>Your LGR Balance</span>
                            <span className="text-polygon-primary">
                              {tokenBalances?.find(token => token.symbol === "LGR")?.balance || "0"} LGR
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                      <p className="text-sm text-yellow-700">
                        All submissions will be reviewed by the LedgerFund DAO community
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 flex justify-between">
                  {activeStep !== 'investment-details' && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                  )}
                  {activeStep !== 'payment' ? (
                    <Button
                      className="ml-auto bg-polygon-primary hover:bg-polygon-primary/90"
                      onClick={nextStep}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      className="ml-auto bg-polygon-primary hover:bg-polygon-primary/90"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <span className="mr-2">Submitting...</span>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                        </div>
                      ) : (
                        <>
                          Submit Thesis
                          <CreditCard className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <SubmissionFeeDisplay 
                submissionFee={SUBMISSION_FEE.toString()}
                currentBalance={tokenBalances?.find(token => token.symbol === "LGR")?.balance}
              />

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
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
