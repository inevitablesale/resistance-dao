import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, AlertCircle, FileText, Target, Link, Users, Wallet, 
  Rocket, ArrowRight, Database 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FirmCriteriaSection } from "@/components/thesis/form-sections/FirmCriteriaSection";
import { StrategiesSection } from "@/components/thesis/form-sections/StrategiesSection";
import { PaymentTermsSection } from "@/components/thesis/form-sections/PaymentTermsSection";
import { TransactionStatus } from "@/components/thesis/TransactionStatus";
import { WalletConnectionOverlay } from "@/components/thesis/WalletConnectionOverlay";
import { Button } from "@/components/ui/button";
import { uploadJSONToIPFS } from "@/services/pinataService";
import { createProposal } from "@/services/proposalContractService";
import { validateProposal } from "@/services/proposalValidationService";
import { LGRWalletDisplay } from "@/components/thesis/LGRWalletDisplay";
import { TransactionBreakdown } from "@/components/thesis/TransactionBreakdown";
import { SubmissionProgress } from "@/components/thesis/SubmissionProgress";
import { ProposalMetadata, SubmissionStepType } from "@/types/proposals";
import { MIN_LGR_REQUIRED } from "@/lib/constants";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { SmartWalletStatus } from "@/components/thesis/SmartWalletStatus";
import { ContractApprovalStatus } from "@/components/thesis/ContractApprovalStatus";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput } from "@/components/thesis/TargetCapitalInput";
import { getTokenBalance, hasTokenApproval } from "@/services/tokenService";
import { GasSponsorshipModal } from "@/components/thesis/GasSponsorshipModal";
import { SubmissionFeeDisplay } from "@/components/thesis/SubmissionFeeDisplay";

// Form schema for proposal submission
const projectSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string(),
  blockchain: z.array(z.string()).min(1, { message: "Select at least one blockchain" }),
  investment: z.object({
    description: z.string().min(20, { message: "Investment description must be at least 20 characters" }),
    targetCapital: z.string().min(1, { message: "Target capital is required" }),
    implementation: z.string().optional(),
  }),
  team: z.array(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      role: z.string().min(1, { message: "Role is required" }),
      linkedin: z.string().optional(),
    })
  ).min(1, { message: "At least one team member is required" }),
  socials: z.object({
    website: z.string().optional(),
    twitter: z.string().optional(),
    discord: z.string().optional(),
    telegram: z.string().optional(),
  }),
  fundingBreakdown: z.array(
    z.object({
      category: z.string().min(1, { message: "Category is required" }),
      amount: z.string().min(1, { message: "Amount is required" }),
    })
  ).optional(),
  strategicVision: z.string().optional(),
  votingDuration: z.number().min(7 * 24 * 60 * 60).max(90 * 24 * 60 * 60),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Main component for thesis submission
const ThesisSubmission = () => {
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('strategy');
  const [hasWalletBeenConnected, setHasWalletBeenConnected] = useState(false);
  const [showGasSponsorshipModal, setShowGasSponsorshipModal] = useState(false);
  const [transactionState, setTransactionState] = useState<{
    status: 'idle' | 'preparing' | 'ipfs' | 'approval' | 'confirming' | 'complete' | 'error';
    message: string;
    error?: string;
    txHash?: string;
    ipfsHash?: string;
    tokenId?: string;
  }>({
    status: 'idle',
    message: '',
  });

  // Create the form with validation
  const methods = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'defi',
      blockchain: ['ethereum'],
      investment: {
        description: '',
        targetCapital: '',
        implementation: '',
      },
      team: [{ name: '', role: '', linkedin: '' }],
      socials: {
        website: '',
        twitter: '',
        discord: '',
        telegram: ''
      },
      fundingBreakdown: [{ category: '', amount: '' }],
      strategicVision: '',
      votingDuration: 30 * 24 * 60 * 60, // 30 days in seconds
    },
  });

  const { 
    watch, 
    trigger, 
    formState: { errors, isValid, isSubmitting } 
  } = methods;

  // Form state watchers
  const formValues = watch();

  // Check if wallet has been connected
  useEffect(() => {
    if (isConnected && !hasWalletBeenConnected) {
      setHasWalletBeenConnected(true);
    }
  }, [isConnected, hasWalletBeenConnected]);

  // Steps configuration
  const steps: SubmissionStepType[] = [
    {
      id: 'strategy',
      title: 'Project Strategy',
      description: 'Define your investment thesis and strategy',
      icon: <FileText className="h-5 w-5" />,
      status: errors.title || errors.description || errors.category ? 'error' : 
              (formValues.title && formValues.description) ? 'complete' : 'pending'
    },
    {
      id: 'target',
      title: 'Capital Target',
      description: 'Set your funding goals',
      icon: <Target className="h-5 w-5" />,
      status: errors.investment?.targetCapital || errors.investment?.description ? 'error' : 
              (formValues.investment?.targetCapital && formValues.investment?.description) ? 'complete' : 'pending'
    },
    {
      id: 'team',
      title: 'Team & Resources',
      description: 'Add your team members',
      icon: <Users className="h-5 w-5" />,
      status: errors.team ? 'error' : 
              formValues.team && formValues.team.length > 0 && formValues.team[0].name ? 'complete' : 'pending'
    },
    {
      id: 'connect',
      title: 'Links',
      description: 'Add project links and socials',
      icon: <Link className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'submit',
      title: 'Review & Submit',
      description: 'Submit your project to the DAO',
      icon: <Rocket className="h-5 w-5" />,
      status: 'pending'
    }
  ];

  // Navigation between steps
  const goToNextStep = async () => {
    const currentStepId = steps[activeStep].id;
    
    let isStepValid = false;
    
    switch (currentStepId) {
      case 'strategy':
        isStepValid = await trigger(['title', 'description', 'category']);
        break;
      case 'target':
        isStepValid = await trigger(['investment.targetCapital', 'investment.description']);
        break;
      case 'team':
        isStepValid = await trigger('team');
        break;
      case 'connect':
        // Connect step doesn't require validation
        isStepValid = true;
        break;
      default:
        isStepValid = false;
    }
    
    if (isStepValid) {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
        setActiveTab(steps[activeStep + 1].id);
      }
    } else {
      toast({
        title: "Missing fields",
        description: "Please complete all required fields before proceeding",
        variant: "destructive",
      });
    }
  };

  const goToPreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setActiveTab(steps[activeStep - 1].id);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= activeStep || steps[stepIndex].status === 'complete') {
      setActiveStep(stepIndex);
      setActiveTab(steps[stepIndex].id);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newStepIndex = steps.findIndex(step => step.id === value);
    if (newStepIndex !== -1) {
      setActiveStep(newStepIndex);
    }
  };

  const resetTransactionState = () => {
    setTransactionState({
      status: 'idle',
      message: '',
    });
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit a project",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate the proposal data
      setTransactionState({
        status: 'preparing',
        message: 'Validating project data...',
      });

      const validationResult = validateProposal(data);
      
      if (!validationResult.isValid) {
        toast({
          title: "Validation Failed",
          description: validationResult.errorMessage || "Please check your project information",
          variant: "destructive",
        });
        setTransactionState({
          status: 'error',
          message: 'Project validation failed.',
          error: validationResult.errorMessage,
        });
        return;
      }

      // Get wallet provider
      const walletProvider = await getProvider();
      
      if (!walletProvider) {
        throw new Error("Could not get wallet provider");
      }

      // Check LGR token balance
      const lgBalance = await getTokenBalance(address, walletProvider.provider);
      const minimumRequired = MIN_LGR_REQUIRED;
      
      if (ethers.utils.parseEther(lgBalance).lt(ethers.utils.parseEther(minimumRequired))) {
        toast({
          title: "Insufficient LGR Tokens",
          description: `You need at least ${minimumRequired} LGR tokens to submit a project`,
          variant: "destructive",
        });
        setTransactionState({
          status: 'error',
          message: `Insufficient LGR balance. Minimum required: ${minimumRequired} LGR`,
        });
        return;
      }

      // Generate proposal metadata
      const metadata: ProposalMetadata = {
        title: data.title,
        description: data.description,
        category: data.category,
        blockchain: data.blockchain,
        investment: {
          description: data.investment.description,
          targetCapital: data.investment.targetCapital,
          implementation: data.investment.implementation,
        },
        team: data.team,
        socials: data.socials,
        fundingBreakdown: data.fundingBreakdown,
        strategicVision: data.strategicVision,
        submissionTimestamp: Math.floor(Date.now() / 1000),
        votingDuration: data.votingDuration,
      };

      // Upload to IPFS
      setTransactionState({
        status: 'ipfs',
        message: 'Uploading project data to IPFS...',
      });

      const ipfsResult = await uploadJSONToIPFS({
        metadata,
        type: 'proposal', 
        creatorAddress: address
      });

      if (!ipfsResult.success || !ipfsResult.ipfsHash) {
        throw new Error("Failed to upload project data to IPFS");
      }

      setTransactionState({
        status: 'approval',
        message: 'Checking token approvals...',
        ipfsHash: ipfsResult.ipfsHash,
      });

      // Check if contract has approval
      const hasApproval = await hasTokenApproval(
        address, 
        walletProvider.provider,
        ethers.utils.parseEther(MIN_LGR_REQUIRED)
      );

      if (!hasApproval) {
        setTransactionState({
          status: 'approval',
          message: 'Waiting for token approval...',
          ipfsHash: ipfsResult.ipfsHash,
        });
      }

      // Create proposal
      setTransactionState({
        status: 'confirming',
        message: 'Submitting project to blockchain...',
        ipfsHash: ipfsResult.ipfsHash,
      });

      const result = await createProposal(
        ipfsResult.ipfsHash,
        data.investment.targetCapital,
        walletProvider.provider,
        (txHash: string) => {
          setTransactionState(prev => ({
            ...prev,
            status: 'confirming',
            message: 'Waiting for transaction confirmation...',
            txHash,
          }));
        }
      );

      if (!result.success) {
        throw new Error(result.error || "Transaction failed");
      }

      // Handle success
      setTransactionState({
        status: 'complete',
        message: 'Project submitted successfully!',
        ipfsHash: ipfsResult.ipfsHash,
        txHash: result.txHash,
        tokenId: result.tokenId,
      });

      toast({
        title: "Success!",
        description: "Your project has been submitted to the DAO",
      });

    } catch (error: any) {
      console.error("Submission error:", error);
      setTransactionState({
        status: 'error',
        message: 'Transaction failed.',
        error: error.message,
      });
      
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your project",
        variant: "destructive",
      });
    }
  };

  const handleViewProject = () => {
    if (transactionState.tokenId) {
      navigate(`/proposals/${transactionState.tokenId}`);
    }
  };

  if (!isConnected) {
    return <WalletConnectionOverlay onConnect={connect} />;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 relative">
      {showGasSponsorshipModal && (
        <GasSponsorshipModal onClose={() => setShowGasSponsorshipModal(false)} />
      )}
      
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 pt-32 relative">
        {transactionState.status === 'idle' ? (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left sidebar with steps */}
              <div className="lg:w-72">
                <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl backdrop-blur-sm sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Project Submission</h3>
                    <Stepper
                      steps={steps}
                      activeStep={activeStep}
                      onStepClick={handleStepClick}
                    />
                    
                    <div className="mt-8">
                      <SmartWalletStatus />
                    </div>
                    
                    <div className="mt-6">
                      <LGRWalletDisplay minRequired={MIN_LGR_REQUIRED} />
                    </div>
                    
                    <div className="mt-6">
                      <SubmissionFeeDisplay />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main content area */}
              <div className="flex-1">
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl backdrop-blur-sm">
                      <CardContent className="p-8">
                        <Tabs value={activeTab} onValueChange={handleTabChange}>
                          <TabsList className="grid grid-cols-5 mb-8">
                            <TabsTrigger value="strategy">Strategy</TabsTrigger>
                            <TabsTrigger value="target">Target</TabsTrigger>
                            <TabsTrigger value="team">Team</TabsTrigger>
                            <TabsTrigger value="connect">Links</TabsTrigger>
                            <TabsTrigger value="submit">Submit</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="strategy" className="space-y-8 animate-in fade-in-50">
                            <div className="space-y-2">
                              <h2 className="text-2xl font-bold">Project Strategy</h2>
                              <p className="text-zinc-400">Define the vision and strategy for your investment project</p>
                            </div>
                            
                            <StrategiesSection />
                            
                            <div className="flex justify-end">
                              <Button 
                                type="button" 
                                onClick={goToNextStep}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
                              >
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="target" className="space-y-8 animate-in fade-in-50">
                            <div className="space-y-2">
                              <h2 className="text-2xl font-bold">Investment Target</h2>
                              <p className="text-zinc-400">Define your investment targets and implementation strategy</p>
                            </div>
                            
                            <FirmCriteriaSection />
                            
                            <div className="space-y-8">
                              <TargetCapitalInput />
                              
                              <VotingDurationInput 
                                value={watch('votingDuration')}
                                onChange={(value) => methods.setValue('votingDuration', value[0])}
                                error={errors.votingDuration?.message ? [errors.votingDuration.message] : undefined}
                              />
                            </div>
                            
                            <div className="flex justify-between">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={goToPreviousStep}
                              >
                                Back
                              </Button>
                              <Button 
                                type="button" 
                                onClick={goToNextStep}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
                              >
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="team" className="space-y-8 animate-in fade-in-50">
                            <div className="space-y-2">
                              <h2 className="text-2xl font-bold">Team Information</h2>
                              <p className="text-zinc-400">Add details about your team members and their expertise</p>
                            </div>
                            
                            <PaymentTermsSection />
                            
                            <div className="flex justify-between">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={goToPreviousStep}
                              >
                                Back
                              </Button>
                              <Button 
                                type="button" 
                                onClick={goToNextStep}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
                              >
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="connect" className="space-y-8 animate-in fade-in-50">
                            <div className="space-y-2">
                              <h2 className="text-2xl font-bold">Project Links</h2>
                              <p className="text-zinc-400">Add links to your project website and social media channels</p>
                            </div>
                            
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-zinc-400">Website (Optional)</label>
                                  <input
                                    type="text"
                                    placeholder="https://yourproject.com"
                                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-white"
                                    {...methods.register("socials.website")}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-zinc-400">Twitter (Optional)</label>
                                  <input
                                    type="text"
                                    placeholder="https://twitter.com/yourproject"
                                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-white"
                                    {...methods.register("socials.twitter")}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-zinc-400">Discord (Optional)</label>
                                  <input
                                    type="text"
                                    placeholder="https://discord.gg/yourproject"
                                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-white"
                                    {...methods.register("socials.discord")}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-zinc-400">Telegram (Optional)</label>
                                  <input
                                    type="text"
                                    placeholder="https://t.me/yourproject"
                                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-white"
                                    {...methods.register("socials.telegram")}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={goToPreviousStep}
                              >
                                Back
                              </Button>
                              <Button 
                                type="button" 
                                onClick={goToNextStep}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
                              >
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="submit" className="space-y-8 animate-in fade-in-50">
                            <div className="space-y-2">
                              <h2 className="text-2xl font-bold">Review & Submit</h2>
                              <p className="text-zinc-400">Review your project information and submit to the blockchain</p>
                            </div>
                            
                            <Card className="border border-zinc-800 bg-zinc-900/60">
                              <CardContent className="p-6 space-y-4">
                                <h3 className="text-lg font-medium text-white">Project Summary</h3>
                                
                                <div className="space-y-3">
                                  <div>
                                    <span className="text-zinc-400">Title:</span>
                                    <p className="text-white font-medium">{formValues.title}</p>
                                  </div>
                                  
                                  <div>
                                    <span className="text-zinc-400">Category:</span>
                                    <p className="text-white font-medium">{formValues.category}</p>
                                  </div>
                                  
                                  <div>
                                    <span className="text-zinc-400">Target Capital:</span>
                                    <p className="text-white font-medium">{formValues.investment.targetCapital} RD</p>
                                  </div>
                                  
                                  <div>
                                    <span className="text-zinc-400">Team Size:</span>
                                    <p className="text-white font-medium">{formValues.team?.length || 0} member(s)</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                                <div>
                                  <h3 className="text-amber-400 font-medium">Important</h3>
                                  <p className="text-white text-sm">
                                    By submitting, you confirm that this information is accurate and you have the rights to submit this project.
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <TransactionBreakdown />
                            
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <Database className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                                <div>
                                  <h3 className="text-indigo-400 font-medium">Blockchain Storage</h3>
                                  <p className="text-white text-sm">
                                    Your project information will be stored on IPFS and referenced on the blockchain.
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-3 md:flex-row md:justify-between items-center">
                              <Button 
                                type="button"
                                variant="outline" 
                                onClick={goToPreviousStep}
                              >
                                Back
                              </Button>
                              
                              <div className="flex gap-3">
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  onClick={() => setShowGasSponsorshipModal(true)}
                                >
                                  <Wallet className="mr-2 h-4 w-4" />
                                  Gas Options
                                </Button>
                                
                                <Button 
                                  type="submit"
                                  disabled={!isValid || isSubmitting}
                                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Submitting...
                                    </>
                                  ) : (
                                    <>
                                      <Rocket className="mr-2 h-4 w-4" />
                                      Submit Project
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <TransactionStatus
              status={transactionState.status}
              message={transactionState.message}
              error={transactionState.error}
              txHash={transactionState.txHash}
              ipfsHash={transactionState.ipfsHash}
              tokenId={transactionState.tokenId}
              onRetry={resetTransactionState}
              onComplete={handleViewProject}
            />
            
            <div className="mt-8">
              <SubmissionProgress status={transactionState.status} />
            </div>
            
            {transactionState.status === 'approval' && (
              <div className="mt-8">
                <ContractApprovalStatus address={address} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThesisSubmission;
