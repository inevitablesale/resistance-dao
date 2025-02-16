import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Nav from "@/components/Nav";
import { FileText, AlertTriangle, Info, Clock, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ethers } from "ethers";

// Contract constants
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
    complexStructures: boolean;
    drivers: string;
    additionalCriteria: string;
  };
}

const ThesisSubmission = () => {
  const { toast } = useToast();
  const { isConnected, address, connect } = useWalletConnection();
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
    paymentTerms: [], // Initialize as empty array
    strategies: {
      operational: [], // Initialize as empty array
      growth: [], // Initialize as empty array
      integration: [] // Initialize as empty array
    },
    investment: {
      targetCapital: "",
      complexStructures: false,
      drivers: "",
      additionalCriteria: ""
    }
  });

  const [votingDuration, setVotingDuration] = useState<number>(MIN_VOTING_DURATION);

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

    // Validate target capital
    const targetCapital = ethers.utils.parseEther(formData.investment.targetCapital);
    if (targetCapital.lt(MIN_TARGET_CAPITAL) || targetCapital.gt(MAX_TARGET_CAPITAL)) {
      toast({
        title: "Invalid Target Capital",
        description: `Target capital must be between 1,000 and 25,000,000 LGR`,
        variant: "destructive"
      });
      return;
    }

    // Validate strategies
    if (!validateStrategies('operational') || !validateStrategies('growth') || !validateStrategies('integration')) {
      toast({
        title: "Too Many Strategies",
        description: `Maximum ${MAX_STRATEGIES_PER_CATEGORY} strategies per category allowed`,
        variant: "destructive"
      });
      return;
    }

    // Validate payment terms
    if (!validatePaymentTerms()) {
      toast({
        title: "Too Many Payment Terms",
        description: "Maximum 5 payment terms allowed",
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload metadata to IPFS (implementation needed)
      const ipfsHash = "QmExample"; // Placeholder

      // Create proposal
      // Contract integration needed here
      
      toast({
        title: "Success",
        description: "Your investment thesis has been submitted",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit thesis",
        variant: "destructive"
      });
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
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              LedgerFund DAO – Investment Thesis Submission
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Share your investment analysis and insights with the community
            </p>
          </div>

          {/* Updated Fee Information Card */}
          <Card className="p-6 bg-black/50 border border-white/10 backdrop-blur-xl mb-8">
            <div className="flex items-start space-x-4">
              <CreditCard className="w-6 h-6 text-purple-400 mt-1" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Required Fees</h3>
                <div className="space-y-1">
                  <p className="text-gray-400">
                    Submission Fee: 250 LGR
                  </p>
                  <p className="text-gray-400">
                    Voting Fee: 10 LGR per vote
                  </p>
                </div>
                {!isConnected && (
                  <Button 
                    onClick={connect}
                    className="mt-2 bg-purple-500 hover:bg-purple-600"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-black/50 border border-white/10 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Thesis Title */}
              <div>
                <label className="text-lg font-medium text-white mb-2 block">
                  Thesis Title
                </label>
                <p className="text-sm text-gray-400 mb-2">
                  📌 Provide a concise name for the investment strategy (e.g., "Regional CPA Roll-Up Strategy" or "Boutique Tax Firm Acquisition")
                </p>
                <Input
                  placeholder="Enter thesis title"
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Voting Duration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-medium text-white">Voting Duration</Label>
                    <p className="text-sm text-gray-400">Set how long the community can vote on your thesis</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">{votingDuration}</span>
                    <span className="text-gray-400 ml-2">days</span>
                  </div>
                </div>
                <Slider
                  value={[votingDuration]}
                  min={MIN_VOTING_DURATION}
                  max={MAX_VOTING_DURATION}
                  step={1}
                  className="w-full"
                  onValueChange={(value) => setVotingDuration(value[0])}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{MIN_VOTING_DURATION} days</span>
                  <span>{MAX_VOTING_DURATION} days</span>
                </div>
              </div>

              {/* Target Firm Criteria */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Target Firm Criteria</h2>
                
                <div>
                  <Label className="text-gray-200 mb-2 block">Industry Focus</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="accounting" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <label htmlFor="accounting" className="text-gray-200">
                      Accounting
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-200 mb-2 block">Preferred Firm Size (Revenue)</Label>
                  <RadioGroup defaultValue="below-1m" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="below-1m" id="below-1m" className="border-white text-white" />
                      <Label htmlFor="below-1m">Below $1M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1m-5m" id="1m-5m" className="border-white text-white" />
                      <Label htmlFor="1m-5m">$1M–$5M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5m-10m" id="5m-10m" className="border-white text-white" />
                      <Label htmlFor="5m-10m">$5M–$10M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10m-plus" id="10m-plus" className="border-white text-white" />
                      <Label htmlFor="10m-plus">$10M+</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-gray-200 mb-2 block">Geographic Focus</Label>
                  <RadioGroup defaultValue="local" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="local" id="local" className="border-white text-white" />
                      <Label htmlFor="local">Local</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regional" id="regional" className="border-white text-white" />
                      <Label htmlFor="regional">Regional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="national" id="national" className="border-white text-white" />
                      <Label htmlFor="national">National</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="remote" id="remote" className="border-white text-white" />
                      <Label htmlFor="remote">Remote/Digital</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Payment Terms */}
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
                    />
                    <label htmlFor="seller-financing" className="text-gray-200">Seller Financing</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="earnout" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <label htmlFor="earnout" className="text-gray-200">Earnout</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="equity-rollover" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <label htmlFor="equity-rollover" className="text-gray-200">Equity Rollover</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="bank-financing" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <label htmlFor="bank-financing" className="text-gray-200">Bank Financing</label>
                  </div>
                </div>
              </div>

              {/* Post-Strategy */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Post-Acquisition Strategy</h2>
                
                {/* Operational Strategies */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Operational Strategies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="tech-modernization" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="tech-modernization" className="text-gray-200">Technology Modernization</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="process-standardization" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="process-standardization" className="text-gray-200">Process Standardization</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="staff-retention" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="staff-retention" className="text-gray-200">Staff Retention/Development</label>
                    </div>
                  </div>
                </div>

                {/* Growth Strategies */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Growth Strategies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="geographic-expansion" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="geographic-expansion" className="text-gray-200">Geographic Expansion</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="service-expansion" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="service-expansion" className="text-gray-200">Service Line Expansion</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="client-growth" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="client-growth" className="text-gray-200">Client Base Growth</label>
                    </div>
                  </div>
                </div>

                {/* Integration Strategies */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Integration Strategies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="merging-operations" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="merging-operations" className="text-gray-200">Merging Operations</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="culture-integration" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="culture-integration" className="text-gray-200">Culture Integration</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="systems-consolidation" 
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor="systems-consolidation" className="text-gray-200">Systems Consolidation</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Structure */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Investment Structure</h2>
                
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

                <div>
                  <Label className="text-gray-200 mb-2 block">Complex Deal Structures?</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="complex-structures" 
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      checked={formData.investment.complexStructures}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, investment: { ...prev.investment, complexStructures: !!checked } }))}
                    />
                    <label htmlFor="complex-structures" className="text-gray-200">
                      Willing to consider complex deal structures
                    </label>
                  </div>
                </div>
              </div>

              {/* Key Investment Drivers */}
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

              {/* Additional Investment Criteria */}
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
                  )}>
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

              {/* Submit Section */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center text-sm text-yellow-400 mb-6">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  All submissions will be reviewed by the LedgerFund DAO community, with investment allocations determined by LGR token holders
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  Submit Investment Thesis
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
