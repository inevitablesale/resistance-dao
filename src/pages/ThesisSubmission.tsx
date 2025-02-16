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
import Nav from "@/components/Nav";
import { FileText, AlertTriangle, Clock, CreditCard, Wallet, Building2, Target, Briefcase } from "lucide-react";
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
    <div className="min-h-screen bg-[#030712] overflow-hidden relative">
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
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
              Investment Thesis Submission
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Share your investment strategy with the LedgerFund DAO community
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <Card className="cyber-box border-white/10">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Investment Thesis</h2>
                      <p className="text-sm text-white/60">Share your investment strategy</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-white mb-2">Title</Label>
                      <Input
                        placeholder="Enter thesis title"
                        className="bg-black/50 border-white/10 text-white"
                        value={formData.title}
                        onChange={(e) => handleFormDataChange('title', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2">Target Capital (USD)</Label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Enter amount"
                          className="bg-black/50 border-white/10 text-white pl-8"
                          value={formData.investment.targetCapital}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleFormDataChange('investment.targetCapital', value);
                          }}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">$</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="cyber-box border-white/10">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Target Company</h2>
                      <p className="text-sm text-white/60">Define your ideal acquisition</p>
                    </div>
                  </div>

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

              <Card className="cyber-box border-white/10">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Investment Strategy</h2>
                      <p className="text-sm text-white/60">Define your approach</p>
                    </div>
                  </div>

                  <StrategiesSection 
                    formData={formData}
                    formErrors={formErrors}
                    onChange={handleStrategyChange}
                  />

                  <div className="mt-8">
                    <Label className="text-white mb-2">Key Investment Drivers</Label>
                    <Textarea
                      placeholder="Describe earnings stability, strong client base, scalability..."
                      className="bg-black/50 border-white/10 text-white min-h-[120px]"
                      value={formData.investment.drivers}
                      onChange={(e) => handleFormDataChange('investment.drivers', e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              <Card className="cyber-box border-white/10">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Voting Period</h2>
                      <p className="text-sm text-white/60">Set community voting duration</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">
                        {Math.floor(votingDuration / (24 * 60 * 60))}
                      </span>
                      <span className="text-white/60">days</span>
                    </div>
                    <Slider
                      value={[votingDuration]}
                      min={MIN_VOTING_DURATION}
                      max={MAX_VOTING_DURATION}
                      step={24 * 60 * 60}
                      onValueChange={handleVotingDurationChange}
                    />
                    <div className="flex justify-between text-sm text-white/60">
                      <span>7 days</span>
                      <span>90 days</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:w-[380px] space-y-6">
              <Card className="cyber-box border-white/10 sticky top-8">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Submission Fee</h2>
                      <p className="text-sm text-white/60">Pay with LGR tokens</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SubmissionFeeDisplay 
                      submissionFee={SUBMISSION_FEE.toString()}
                      currentBalance={tokenBalances?.find(token => token.symbol === "LGR")?.balance}
                    />

                    <div className="pt-6 border-t border-white/10">
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#4F46E5] transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <span className="mr-2">Submitting...</span>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                          </div>
                        ) : (
                          "Submit Thesis"
                        )}
                      </Button>

                      <div className="mt-4 flex items-center text-sm text-yellow-400">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>Requires DAO community review</span>
                      </div>
                    </div>
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
