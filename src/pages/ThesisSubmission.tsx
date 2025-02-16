
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
import { Switch } from "@/components/ui/switch";
import Nav from "@/components/Nav";
import { FileText, AlertTriangle, Info, Clock, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useTokenBalances } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { uploadMetadataToPinata } from "@/services/pinataService";
import { getContractStatus, estimateProposalGas, createProposal } from "@/services/proposalContractService";
import { validateProposalMetadata, validateIPFSHash, validateContractParameters } from "@/services/proposalValidationService";
import { executeTransaction } from "@/services/transactionManager";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";

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

const ThesisSubmission = () => {
  const { toast } = useToast();
  const { isConnected, address, connect, approveLGR, wallet } = useWalletConnection();
  const { tokenBalances, isLoading } = useTokenBalances({
    networkId: 137, // Polygon mainnet
    accountAddress: address,
    includeFiat: false,
    includeNativeBalance: false
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

  useEffect(() => {
    const checkLGRBalance = () => {
      if (isConnected && address && !hasShownBalanceWarning && !isLoading && tokenBalances) {
        // Find LGR token by both symbol and contract address
        const lgrBalance = tokenBalances.find(
          token => 
            token.symbol === "LGR" && 
            token.contractAddress?.toLowerCase() === LGR_TOKEN_ADDRESS.toLowerCase()
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

  const validateStrategies = (category: keyof typeof formData.strategies) => {
    const strategies = formData.strategies[category];
    if (!Array.isArray(strategies)) return false;
    return strategies.length <= MAX_STRATEGIES_PER_CATEGORY;
  };

  const validatePaymentTerms = () => {
    if (!Array.isArray(formData.paymentTerms)) return false;
    return formData.paymentTerms.length <= 5;
  };

  const handleStrategyChange = (category: keyof typeof formData.strategies, value: string) => {
    setFormData(prev => {
      const currentStrategies = [...(prev.strategies[category] || [])];
      const index = currentStrategies.indexOf(value);
      
      if (index === -1) {
        if (currentStrategies.length < MAX_STRATEGIES_PER_CATEGORY) {
          currentStrategies.push(value);
        }
      } else {
        currentStrategies.splice(index, 1);
      }

      return {
        ...prev,
        strategies: {
          ...prev.strategies,
          [category]: currentStrategies
        }
      };
    });
  };

  const handlePaymentTermChange = (value: string) => {
    setFormData(prev => {
      const currentTerms = [...prev.paymentTerms];
      const index = currentTerms.indexOf(value);
      
      if (index === -1) {
        if (currentTerms.length < MAX_PAYMENT_TERMS) {
          currentTerms.push(value);
        }
      } else {
        currentTerms.splice(index, 1);
      }

      return {
        ...prev,
        paymentTerms: currentTerms
      };
    });
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

      // 1. Validate proposal metadata
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

      // 2. Get contract status and validate
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

      // 3. First approve LGR tokens for submission fee
      console.log('Approving LGR tokens for submission...');
      const submissionFeeApproval = await approveLGR(contractStatus.submissionFee.toString());
      if (!submissionFeeApproval) {
        toast({
          title: "Approval Failed",
          description: "Failed to approve LGR tokens for submission",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Tokens Approved",
        description: "LGR tokens approved for submission",
      });

      // 4. Upload metadata to IPFS
      console.log('Uploading metadata to IPFS...');
      const ipfsUri = await uploadMetadataToPinata(formData);
      const ipfsHash = ipfsUri.replace('ipfs://', '');
      
      if (!validateIPFSHash(ipfsHash)) {
        toast({
          title: "IPFS Error",
          description: "Failed to upload metadata to IPFS",
          variant: "destructive"
        });
        return;
      }
      console.log('Metadata uploaded to IPFS:', ipfsHash);

      // 5. Validate contract parameters
      const targetCapital = ethers.utils.parseEther(formData.investment.targetCapital);
      const votingDurationSeconds = votingDuration;

      const paramValidation = validateContractParameters(
        { targetCapital, votingDuration: votingDurationSeconds },
        contractStatus
      );

      if (!paramValidation.isValid) {
        setFormErrors(paramValidation.errors);
        toast({
          title: "Contract Parameter Error",
          description: Object.values(paramValidation.errors).flat().join(", "),
          variant: "destructive"
        });
        return;
      }

      // 6. Create proposal with retry mechanism
      console.log('Creating proposal...');
      const result = await createProposal({
        targetCapital,
        votingDuration: votingDurationSeconds,
        ipfsHash
      }, wallet);

      // 8. Store proposal data in local storage for reference
      const userProposals = JSON.parse(localStorage.getItem('userProposals') || '[]');
      userProposals.push({
        hash: result.hash,
        ipfsHash,
        timestamp: Date.now()
      });
      localStorage.setItem('userProposals', JSON.stringify(userProposals));

      toast({
        title: "Success",
        description: "Your investment thesis has been submitted successfully",
      });

    } catch (error) {
      console.error("Submission error:", error);
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
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)', 
            opacity: 0.98 
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)'
          }} 
        />
      </div>
      
      <Nav />
      <LGRFloatingWidget />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-black/50 border border-white/10 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
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
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.title[0]}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-medium text-white">Voting Duration</Label>
                    <p className="text-sm text-gray-400">Set how long the community can vote on your thesis (7 to 90 days)</p>
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
                  step={24 * 60 * 60} // One day in seconds
                  className="w-full"
                  onValueChange={(value) => setVotingDuration(value[0])}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>7 days</span>
                  <span>90 days</span>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Target Firm Criteria</h2>
                
                <div>
                  <Label className="text-white mb-2 block">Preferred Firm Size (Revenue)</Label>
                  <RadioGroup defaultValue="below-1m" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="below-1m" 
                        id="below-1m" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
                      />
                      <Label htmlFor="below-1m" className="text-white">Below $1M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="1m-5m" 
                        id="1m-5m" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
                      />
                      <Label htmlFor="1m-5m" className="text-white">$1M–$5M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="5m-10m" 
                        id="5m-10m" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
                      />
                      <Label htmlFor="5m-10m" className="text-white">$5M–$10M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="10m-plus" 
                        id="10m-plus" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
                      />
                      <Label htmlFor="10m-plus" className="text-white">$10M+</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Geographic Focus</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white mb-2 block">Region Type</Label>
                      <RadioGroup defaultValue="local" className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="local" 
                            id="local" 
                            className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
                          />
                          <Label htmlFor="local" className="text-white">Local</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="regional" 
                            id="regional" 
                            className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
                          />
                          <Label htmlFor="regional" className="text-white">Regional</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="national" 
                            id="national" 
                            className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
                          />
                          <Label htmlFor="national" className="text-white">National</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="remote" 
                            id="remote" 
                            className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white" 
                          />
                          <Label htmlFor="remote" className="text-white">Remote/Digital</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label className="text-white mb-2 block">Primary State (Optional)</Label>
                      <select 
                        className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white"
                        value={formData.firmCriteria.location}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          firmCriteria: {
                            ...prev.firmCriteria,
                            location: e.target.value
                          }
                        }))}
                      >
                        <option value="">Select a state (optional)</option>
                        {US_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Payment Terms</h2>
                  <span className="text-sm text-gray-400">
                    Select 1-5 terms
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cash" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      checked={formData.paymentTerms.includes('cash')}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          paymentTerms: checked 
                            ? [...prev.paymentTerms, 'cash']
                            : prev.paymentTerms.filter(term => term !== 'cash')
                        }))
                      }}
                    />
                    <label htmlFor="cash" className="text-gray-200">Cash</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="seller-financing" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      checked={formData.paymentTerms.includes('seller-financing')}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          paymentTerms: checked 
                            ? [...prev.paymentTerms, 'seller-financing']
                            : prev.paymentTerms.filter(term => term !== 'seller-financing')
                        }))
                      }}
                    />
                    <label htmlFor="seller-financing" className="text-gray-200">Seller Financing</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="earnout" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      checked={formData.paymentTerms.includes('earnout')}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          paymentTerms: checked 
                            ? [...prev.paymentTerms, 'earnout']
                            : prev.paymentTerms.filter(term => term !== 'earnout')
                        }))
                      }}
                    />
                    <label htmlFor="earnout" className="text-gray-200">Earnout</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="equity-rollover" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      checked={formData.paymentTerms.includes('equity-rollover')}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          paymentTerms: checked 
                            ? [...prev.paymentTerms, 'equity-rollover']
                            : prev.paymentTerms.filter(term => term !== 'equity-rollover')
                        }))
                      }}
                    />
                    <label htmlFor="equity-rollover" className="text-gray-200">Equity Rollover</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="bank-financing" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      checked={formData.paymentTerms.includes('bank-financing')}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          paymentTerms: checked 
                            ? [...prev.paymentTerms, 'bank-financing']
                            : prev.paymentTerms.filter(term => term !== 'bank-financing')
                        }))
                      }}
                    />
                    <label htmlFor="bank-financing" className="text-gray-200">Bank Financing</label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Post-Acquisition Strategy</h2>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Operational Strategies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="tech-modernization" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.operational.includes('tech-modernization')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('operational', 'tech-modernization');
                        }}
                      />
                      <label htmlFor="tech-modernization" className="text-gray-200">Technology Modernization</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="process-standardization" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.operational.includes('process-standardization')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('operational', 'process-standardization');
                        }}
                      />
                      <label htmlFor="process-standardization" className="text-gray-200">Process Standardization</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="staff-retention" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.operational.includes('staff-retention')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('operational', 'staff-retention');
                        }}
                      />
                      <label htmlFor="staff-retention" className="text-gray-200">Staff Retention/Development</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Growth Strategies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="geographic-expansion" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.growth.includes('geographic-expansion')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('growth', 'geographic-expansion');
                        }}
                      />
                      <label htmlFor="geographic-expansion" className="text-gray-200">Geographic Expansion</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="service-expansion" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.growth.includes('service-expansion')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('growth', 'service-expansion');
                        }}
                      />
                      <label htmlFor="service-expansion" className="text-gray-200">Service Line Expansion</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="client-growth" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.growth.includes('client-growth')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('growth', 'client-growth');
                        }}
                      />
                      <label htmlFor="client-growth" className="text-gray-200">Client Base Growth</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Integration Strategies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="merging-operations" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.integration.includes('merging-operations')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('integration', 'merging-operations');
                        }}
                      />
                      <label htmlFor="merging-operations" className="text-gray-200">Merging Operations</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="culture-integration" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.integration.includes('culture-integration')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('integration', 'culture-integration');
                        }}
                      />
                      <label htmlFor="culture-integration" className="text-gray-200">Culture Integration</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="systems-consolidation" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        checked={formData.strategies.integration.includes('systems-consolidation')}
                        onCheckedChange={(checked) => {
                          handleStrategyChange('integration', 'systems-consolidation');
                        }}
                      />
                      <label htmlFor="systems-consolidation" className="text-gray-200">Systems Consolidation</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-gray-200 mb-2 block">Target Capital Raise (USD)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount in USD"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                    required
                    value={formData.investment.targetCapital}
                    onChange={(e) => setFormData(prev => ({ ...prev, investment: { ...prev.investment, targetCapital: e.target.value } }))}
                  />
                </div>
              </div>

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
                  )}
                  >
                    {formData.investment.drivers.length}/{MAX_SUMMARY_LENGTH}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  📌 Outline the primary factors that make this acquisition compelling
                </p>
                <Textarea
                  placeholder="Describe earnings stability, strong client base, scalability, cultural fit, technology adoption, etc."
                  className="bg-black/50 border-white/10 min-h-[150px] text-white placeholder:text-gray-500"
                  required
                  value={formData.investment.drivers}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment: { ...prev.investment, drivers: e.target.value } }))}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-lg font-medium text-white">
                    Additional Investment Criteria or Notes
                  </label>
                  <span className={cn(
                    "text-sm",
                    formData.investment.additionalCriteria.length > MAX_SUMMARY_LENGTH 
                      ? "text-red-400" 
                      : "text-gray-400"
                  )}
                  >
                    {formData.investment.additionalCriteria.length}/{MAX_SUMMARY_LENGTH}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  📌 Specify any must-have requirements or deal preferences
                </p>
                <Textarea
                  placeholder="EBITDA thresholds, firm specialization, geographic limitations, integration plans, etc."
                  className="bg-black/50 border-white/10 min-h-[150px] text-white placeholder:text-gray-500"
                  value={formData.investment.additionalCriteria}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment: { ...prev.investment, additionalCriteria: e.target.value } }))}
                />
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center text-sm text-yellow-400 mb-6">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  All submissions will be reviewed by the LedgerFund DAO community
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  )}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">Submitting...</span>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                    </div>
                  ) : (
                    "Submit Investment Thesis"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
