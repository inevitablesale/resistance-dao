import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FirmSize,
  DealType,
  GeographicFocus,
  PaymentTerm,
  OperationalStrategy,
  GrowthStrategy,
  IntegrationStrategy,
  ProposalMetadata,
} from "@/types/proposals";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ethers } from "ethers";
import { ProposalConfig } from "@/types/proposals";
import { gasOptimizer } from "@/services/gasOptimizationService";
import { useToast } from "@/hooks/use-toast";
import { TransactionStatus } from "@/components/thesis/TransactionStatus";
import { SubmissionProgress } from "@/components/thesis/SubmissionProgress";
import {
  createProposal,
  getContractStatus,
} from "@/services/proposalContractService";
import { handleDynamicError } from "@/services/dynamicErrorHandler";
import {
  subscribeToProposalEvents,
  waitForProposalCreation,
} from "@/services/eventListenerService";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Proposal title must be at least 2 characters.",
  }),
  firmSize: z.nativeEnum(FirmSize, {
    errorMap: () => ({ message: "Please select a firm size." }),
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  dealType: z.nativeEnum(DealType, {
    errorMap: () => ({ message: "Please select a deal type." }),
  }),
  geographicFocus: z.nativeEnum(GeographicFocus, {
    errorMap: () => ({ message: "Please select a geographic focus." }),
  }),
  paymentTerms: z.array(z.nativeEnum(PaymentTerm)).nonempty({
    message: "Please select at least one payment term.",
  }),
  operationalStrategies: z.array(z.nativeEnum(OperationalStrategy)).nonempty({
    message: "Please select at least one operational strategy.",
  }),
  growthStrategies: z.array(z.nativeEnum(GrowthStrategy)).nonempty({
    message: "Please select at least one growth strategy.",
  }),
  integrationStrategies: z.array(z.nativeEnum(IntegrationStrategy)).nonempty({
    message: "Please select at least one integration strategy.",
  }),
  targetCapital: z
    .string()
    .min(1, { message: "Target capital is required." })
    .refine((value) => {
      try {
        // Attempt to parse the value as a number
        const numValue = parseFloat(value);
        // Check if the parsed value is a valid number and is greater than zero
        return !isNaN(numValue) && numValue > 0;
      } catch (e) {
        return false; // Parsing failed, so it's not a valid number
      }
    }, "Target capital must be a valid number greater than zero."),
  investmentDrivers: z.string().min(10, {
    message: "Investment drivers must be at least 10 characters.",
  }),
  additionalCriteria: z.string().min(10, {
    message: "Additional criteria must be at least 10 characters.",
  }),
  votingDuration: z.number().min(MIN_VOTING_DURATION, {
    message: "Voting duration must be at least 7 days.",
  }),
  linkedInURL: z.string().url({ message: "Invalid LinkedIn URL" }),
});

const TEST_FORM_DATA: ProposalMetadata = {
  title: "Test Proposal - Automated Backend Services Firm",
  firmCriteria: {
    size: FirmSize.BELOW_1M,
    location: "California",
    dealType: DealType.ACQUISITION,
    geographicFocus: GeographicFocus.LOCAL,
  },
  paymentTerms: [
    PaymentTerm.CASH,
    PaymentTerm.SELLER_FINANCING,
    PaymentTerm.EARNOUT,
  ],
  strategies: {
    operational: [
      OperationalStrategy.TECH_MODERNIZATION,
      OperationalStrategy.PROCESS_STANDARDIZATION,
    ],
    growth: [GrowthStrategy.SERVICE_EXPANSION, GrowthStrategy.CLIENT_GROWTH],
    integration: [
      IntegrationStrategy.MERGING_OPERATIONS,
      IntegrationStrategy.SYSTEMS_CONSOLIDATION,
    ],
  },
  investment: {
    targetCapital: "2500000",
    drivers:
      "Strong recurring revenue from established client base. High potential for automation and scalability. Strategic alignment with emerging tech markets.",
    additionalCriteria:
      "Preference for firms with existing cloud infrastructure and established compliance frameworks.",
  },
  votingDuration: MIN_VOTING_DURATION,
  votingEnds: Math.floor(Date.now() / 1000) + MIN_VOTING_DURATION,
  linkedInURL: "",
  isTestMode: true,
  submissionTimestamp: Date.now(),
  submitter: "",
};

const ContractApprovalStatus = ({
  onApprovalComplete,
  requiredAmount,
  currentFormData,
}: {
  onApprovalComplete: () => void;
  requiredAmount: ethers.BigNumber;
  currentFormData: ProposalMetadata;
}) => {
  const { approveLGR } = useWalletConnection();
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const approvalTx = await approveLGR(
        requiredAmount.toString(),
        currentFormData.isTestMode
      );
      if (approvalTx) {
        toast({
          title: "Approval Transaction Sent",
          description: "Waiting for confirmation...",
        });
        await approvalTx.wait();
        toast({
          title: "Approval Successful",
          description: "You can now proceed with creating the proposal.",
        });
        onApprovalComplete();
      } else {
        throw new Error("Approval transaction failed or was not properly sent.");
      }
    } catch (error) {
      console.error("Approval error:", error);
      const proposalError = handleDynamicError(error);
      toast({
        title: "Approval Failed",
        description: proposalError.message,
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">
          Approve LGR Tokens for Proposal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400">
          To create a proposal, you need to approve the transfer of LGR tokens
          to the treasury.
        </p>
        <Button
          onClick={handleApprove}
          disabled={isApproving}
          className="w-full"
        >
          {isApproving ? "Approving..." : "Approve LGR Tokens"}
        </Button>
      </CardContent>
    </Card>
  );
};

const ProposalConfirmation = ({
  proposalConfig,
  onConfirm,
  onCancel,
}: {
  proposalConfig: ProposalConfig;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Confirm Proposal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400">
          Please review the details below before submitting your proposal.
        </p>
        <div className="flex justify-between">
          <span className="text-gray-400">Title:</span>
          <span className="text-white">{proposalConfig.metadata.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Target Capital:</span>
          <span className="text-white">
            {ethers.utils.formatEther(proposalConfig.targetCapital)} LGR
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Voting Duration:</span>
          <span className="text-white">
            {proposalConfig.metadata.votingDuration / (24 * 60 * 60)} days
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">LinkedIn URL:</span>
          <a
            href={proposalConfig.linkedInURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-polygon-primary hover:underline"
          >
            View Profile
          </a>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm & Submit</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ThesisSubmission = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useWalletConnection();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalConfig, setProposalConfig] = useState<ProposalConfig | null>(
    null
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isTestModeEnabled, setIsTestModeEnabled] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [currentFormData, setCurrentFormData] = useState<ProposalMetadata>(
    {} as ProposalMetadata
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      firmSize: FirmSize.BELOW_1M,
      location: "",
      dealType: DealType.ACQUISITION,
      geographicFocus: GeographicFocus.LOCAL,
      paymentTerms: [PaymentTerm.CASH],
      operationalStrategies: [OperationalStrategy.TECH_MODERNIZATION],
      growthStrategies: [GrowthStrategy.SERVICE_EXPANSION],
      integrationStrategies: [IntegrationStrategy.MERGING_OPERATIONS],
      targetCapital: "",
      investmentDrivers: "",
      additionalCriteria: "",
      votingDuration: MIN_VOTING_DURATION,
      linkedInURL: "",
    },
  });

  const { setValue, getValues } = form;

  useEffect(() => {
    if (isTestModeEnabled) {
      Object.entries(TEST_FORM_DATA).forEach(([key, value]) => {
        if (key === "votingDuration") {
          setValue(key as "votingDuration", value as number);
        } else if (
          key === "firmCriteria" &&
          typeof value === "object" &&
          value !== null
        ) {
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            setValue(nestedKey as keyof z.infer<typeof formSchema>, nestedValue);
          });
        } else if (key === "strategies" && typeof value === "object") {
          Object.entries(value).forEach(([strategyKey, strategyValue]) => {
            if (Array.isArray(strategyValue)) {
              setValue(strategyKey as keyof z.infer<typeof formSchema>, strategyValue);
            }
          });
        } else if (key !== "isTestMode") {
          setValue(key as keyof z.infer<typeof formSchema>, value);
        }
      });
    }
  }, [isTestModeEnabled, setValue]);

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  const targetCapitalBN = ethers.utils.parseEther(
    form.getValues("targetCapital") || "0"
  );

  const steps = [
    {
      id: "form",
      title: "Fill Proposal Details",
      status: step > 1 ? "completed" : "pending",
      description: "Provide all the necessary information for your proposal.",
    },
    {
      id: "approve",
      title: "Approve LGR Tokens",
      status: step > 2 ? "completed" : step === 2 ? "processing" : "pending",
      description: "Approve the transfer of LGR tokens for proposal creation.",
    },
    {
      id: "confirm",
      title: "Confirm Proposal",
      status: step > 3 ? "completed" : "pending",
      description: "Confirm all the details before submitting your proposal.",
    },
    {
      id: "submit",
      title: "Submit Proposal",
      status:
        transactionId && !submissionError
          ? "processing"
          : submissionError
          ? "failed"
          : "pending",
      description: "Submit your proposal to the blockchain.",
    },
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setCurrentFormData({
        title: values.title,
        firmCriteria: {
          size: values.firmSize,
          location: values.location,
          dealType: values.dealType,
          geographicFocus: values.geographicFocus,
        },
        paymentTerms: values.paymentTerms,
        strategies: {
          operational: values.operationalStrategies,
          growth: values.growthStrategies,
          integration: values.integrationStrategies,
        },
        investment: {
          targetCapital: values.targetCapital,
          drivers: values.investmentDrivers,
          additionalCriteria: values.additionalCriteria,
        },
        votingDuration: values.votingDuration,
        votingEnds: Math.floor(Date.now() / 1000) + values.votingDuration,
        linkedInURL: values.linkedInURL,
        isTestMode: isTestModeEnabled,
      });
      setStep(2);
    } catch (error) {
      console.error("Form submission error:", error);
      const proposalError = handleDynamicError(error);
      toast({
        title: "Form Submission Failed",
        description: proposalError.message,
        variant: "destructive",
      });
    }
  };

  const handleApprovalComplete = () => {
    setStep(3);
  };

  const handleConfirm = async () => {
    setIsConfirmationDialogOpen(false);
    setStep(4);

    const values = getValues();
    const metadata: ProposalMetadata = {
      title: values.title,
      firmCriteria: {
        size: values.firmSize,
        location: values.location,
        dealType: values.dealType,
        geographicFocus: values.geographicFocus,
      },
      paymentTerms: values.paymentTerms,
      strategies: {
        operational: values.operationalStrategies,
        growth: values.growthStrategies,
        integration: values.integrationStrategies,
      },
      investment: {
        targetCapital: values.targetCapital,
        drivers: values.investmentDrivers,
        additionalCriteria: values.additionalCriteria,
      },
      votingDuration: values.votingDuration,
      votingEnds: Math.floor(Date.now() / 1000) + values.votingDuration,
      linkedInURL: values.linkedInURL,
      isTestMode: isTestModeEnabled,
    };

    const proposalConfig: ProposalConfig = {
      targetCapital: targetCapitalBN,
      votingDuration: values.votingDuration,
      ipfsHash: "test_ipfs_hash", // Replace with actual IPFS hash
      metadata: metadata,
      linkedInURL: values.linkedInURL,
    };
    setProposalConfig(proposalConfig);

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const contractStatus = await getContractStatus();
      const optimizedGas = await gasOptimizer.getOptimizedGasPrice(
        contractStatus.provider
      );

      const tx = await createProposal(
        proposalConfig,
        optimizedGas,
        isTestModeEnabled
      );

      setTransactionId(tx.id);
    } catch (error) {
      console.error("Error during proposal submission:", error);
      const proposalError = handleDynamicError(error);
      setSubmissionError(proposalError.message);
      toast({
        title: "Proposal Submission Failed",
        description: proposalError.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationDialogOpen(false);
    setStep(3);
  };

  const handleProposalEvent = useCallback(
    (event) => {
      console.log("Proposal created event:", event);
      toast({
        title: "Proposal Created",
        description: `Proposal created with token ID: ${event.tokenId}`,
      });
      setIsSubmitting(false);
      navigate(`/proposals/${event.tokenId}`);
    },
    [navigate, toast]
  );

  useEffect(() => {
    if (transactionId) {
      const subscribe = async () => {
        try {
          const contractStatus = await getContractStatus();

          waitForProposalCreation(
            {
              provider: contractStatus.provider,
              contractAddress: contractStatus.contractAddress,
              abi: contractStatus.contractInterface.fragments.map((fragment) =>
                fragment.format(ethers.utils.FormatTypes.full)
              ),
              eventName: "ProposalCreated",
            },
            transactionId,
            300000
          )
            .then((event) => {
              handleProposalEvent(event);
            })
            .catch((error) => {
              console.error("Error waiting for proposal creation:", error);
              const proposalError = handleDynamicError(error);
              setSubmissionError(proposalError.message);
              toast({
                title: "Proposal Submission Failed",
                description: proposalError.message,
                variant: "destructive",
              });
              setIsSubmitting(false);
            });
        } catch (error) {
          console.error("Error setting up event listener:", error);
          const proposalError = handleDynamicError(error);
          setSubmissionError(proposalError.message);
          toast({
            title: "Event Listener Setup Failed",
            description: proposalError.message,
            variant: "destructive",
          });
          setIsSubmitting(false);
        }
      };

      subscribe();
    }
  }, [transactionId, handleProposalEvent, toast]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400 mb-8">
          Submit Your Thesis
        </h1>

        <SubmissionProgress steps={steps} currentStepId={steps[step - 1].id} />

        {step === 1 && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Proposal Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposal Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Name of the firm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firmSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firm Size</FormLabel>
                          <FormControl>
                            <select
                              defaultValue={FirmSize.BELOW_1M}
                              {...field}
                              className="bg-black/40 border border-white/10 rounded-md px-4 py-2 w-full"
                            >
                              <option value={FirmSize.BELOW_1M}>Below $1M</option>
                              <option value={FirmSize.ONE_TO_FIVE_M}>
                                $1M - $5M
                              </option>
                              <option value={FirmSize.FIVE_TO_TEN_M}>
                                $5M - $10M
                              </option>
                              <option value={FirmSize.TEN_PLUS}>$10M+</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., California" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dealType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deal Type</FormLabel>
                          <FormControl>
                            <select
                              defaultValue={DealType.ACQUISITION}
                              {...field}
                              className="bg-black/40 border border-white/10 rounded-md px-4 py-2 w-full"
                            >
                              <option value={DealType.ACQUISITION}>
                                Acquisition
                              </option>
                              <option value={DealType.MERGER}>Merger</option>
                              <option value={DealType.EQUITY_BUYOUT}>
                                Equity Buyout
                              </option>
                              <option value={DealType.FRANCHISE}>
                                Franchise
                              </option>
                              <option value={DealType.SUCCESSION}>
                                Succession
                              </option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="geographicFocus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Geographic Focus</FormLabel>
                          <FormControl>
                            <select
                              defaultValue={GeographicFocus.LOCAL}
                              {...field}
                              className="bg-black/40 border border-white/10 rounded-md px-4 py-2 w-full"
                            >
                              <option value={GeographicFocus.LOCAL}>Local</option>
                              <option value={GeographicFocus.REGIONAL}>
                                Regional
                              </option>
                              <option value={GeographicFocus.NATIONAL}>
                                National
                              </option>
                              <option value={GeographicFocus.REMOTE}>
                                Remote
                              </option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="payment-terms">
                      <AccordionTrigger>
                        Payment Terms
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                          {Object.values(PaymentTerm).map((term) => (
                            <FormField
                              key={term}
                              control={form.control}
                              name="paymentTerms"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={term}
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(term)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, term])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== term
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {PaymentTerm[term]}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="operational-strategies">
                      <AccordionTrigger>
                        Operational Strategies
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                          {Object.values(OperationalStrategy).map((strategy) => (
                            <FormField
                              key={strategy}
                              control={form.control}
                              name="operationalStrategies"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(strategy)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              strategy,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== strategy
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {OperationalStrategy[strategy]}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="growth-strategies">
                      <AccordionTrigger>
                        Growth Strategies
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                          {Object.values(GrowthStrategy).map((strategy) => (
                            <FormField
                              key={strategy}
                              control={form.control}
                              name="growthStrategies"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(strategy)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              strategy,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== strategy
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {GrowthStrategy[strategy]}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="integration-strategies">
                      <AccordionTrigger>
                        Integration Strategies
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                          {Object.values(IntegrationStrategy).map((strategy) => (
                            <FormField
                              key={strategy}
                              control={form.control}
                              name="integrationStrategies"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(strategy)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              strategy,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== strategy
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {IntegrationStrategy[strategy]}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <FormField
                    control={form.control}
                    name="targetCapital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Capital (LGR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 1000000"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="investmentDrivers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Drivers</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Why should the community invest in this firm?"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalCriteria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Criteria</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional criteria for the firm?"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedInURL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          LinkedIn Profile
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Provide a link to your LinkedIn profile to
                                verify your professional experience.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., linkedin.com/in/yourprofile"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <VotingDurationInput
                    value={form.getValues("votingDuration")}
                    onChange={(value) => {
                      form.setValue("votingDuration", value[0]);
                    }}
                    error={form.formState.errors.votingDuration?.message
                      ? [form.formState.errors.votingDuration?.message]
                      : undefined}
                  />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={isTestModeEnabled}
                      onCheckedChange={(checked) => {
                        setIsTestModeEnabled(checked || false);
                      }}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable Test Mode
                    </label>
                  </div>

                  <Button type="submit">Submit Proposal</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <ContractApprovalStatus
            onApprovalComplete={handleApprovalComplete}
            requiredAmount={targetCapitalBN}
            currentFormData={currentFormData}
          />
        )}

        {step === 3 && (
          <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsConfirmationDialogOpen(true)}>
                Review and Confirm
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg
