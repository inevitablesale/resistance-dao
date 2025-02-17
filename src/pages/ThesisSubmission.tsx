import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createProposal } from "@/services/proposalContractService";
import { ProposalMetadata, proposalMetadataSchema } from "@/lib/schemas";
import { TargetCapitalInput } from "@/components/thesis/TargetCapitalInput";
import { useContractStatus } from "@/hooks/useContractStatus";
import { LGR_PRICE_USD } from "@/lib/constants";
import { ethers } from "ethers";

const TEST_FORM_DATA: ProposalMetadata = {
  title: "Test Proposal - Automated Backend Services Firm",
  firmCriteria: {
    size: "Small (5-20 employees)",
    location: "California",
    dealType: "Full Acquisition",
    geographicFocus: "West Coast"
  },
  paymentTerms: [
    "Initial payment of 30% upon signing",
    "Monthly installments over 24 months",
    "Performance-based earnout over 3 years"
  ],
  strategies: {
    operational: [
      "Implement cloud-based workflow automation",
      "Standardize service delivery processes"
    ],
    growth: [
      "Expand service offerings to include AI solutions",
      "Target enterprise clients"
    ],
    integration: [
      "Retain key technical personnel",
      "Gradual systems migration"
    ]
  },
  investment: {
    targetCapital: "25000.00", // Changed from 250000.00 to 25000.00 for test mode
    drivers: "Strong recurring revenue from established client base. High potential for automation and scalability. Strategic alignment with emerging tech markets.",
    additionalCriteria: "Preference for firms with existing cloud infrastructure and established compliance frameworks."
  }
};

const ThesisSubmission = () => {
  const router = useRouter();
  const { primaryWallet } = useDynamicContext();
  const { contractStatus } = useContractStatus();
  const [isTestMode, setIsTestMode] = useState(false);
  const [targetCapitalUSD, setTargetCapitalUSD] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contractStatus) {
      setIsTestMode(contractStatus.isTestMode);
    }
  }, [contractStatus]);

  const form = useForm<ProposalMetadata>({
    resolver: zodResolver(proposalMetadataSchema),
    defaultValues: {
      title: "",
      firmCriteria: {
        size: "",
        location: "",
        dealType: "",
        geographicFocus: ""
      },
      paymentTerms: [""],
      strategies: {
        operational: [""],
        growth: [""],
        integration: [""]
      },
      investment: {
        targetCapital: "",
        drivers: "",
        additionalCriteria: ""
      }
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (isTestMode) {
      form.reset(TEST_FORM_DATA);
      setTargetCapitalUSD(TEST_FORM_DATA.investment.targetCapital);
    } else {
      form.reset();
      setTargetCapitalUSD("");
    }
  }, [isTestMode, form]);

  const handleTargetCapitalChange = (value: string) => {
    setTargetCapitalUSD(value);
  };

  const votingDurations = [
    { value: "7200", label: "2 Hours" },
    { value: "21600", label: "6 Hours" },
    { value: "43200", label: "12 Hours" },
    { value: "86400", label: "24 Hours" },
  ];

  const onSubmit: SubmitHandler<ProposalMetadata> = async (values) => {
    if (!primaryWallet?.address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a proposal.",
        variant: "destructive",
      });
      return;
    }

    if (!contractStatus) {
      toast({
        title: "Contract Status Unavailable",
        description: "Unable to fetch contract status. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (contractStatus.isPaused) {
      toast({
        title: "Contract Paused",
        description: "The contract is currently paused. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (!targetCapitalUSD) {
      toast({
        title: "Missing Target Capital",
        description: "Please enter the target capital in USD.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Convert form data to JSON and upload to IPFS
      const metadata = {
        ...values,
        investment: {
          ...values.investment,
          targetCapital: targetCapitalUSD
        }
      };
      const metadataString = JSON.stringify(metadata);
      const metadataBuffer = Buffer.from(metadataString);

      // 2. Create a new IPFS gateway instance
      const gateway = new global.BundlrStorage.Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY || "" });

      // 3. Upload the metadata to IPFS
      const cid = await gateway.upload(metadataBuffer);
      const ipfsHash = `ipfs://${cid}`;
      console.log("IPFS Hash:", ipfsHash);

      // 4. Convert target capital to wei
      const targetCapital = ethers.utils.parseUnits((parseFloat(targetCapitalUSD) / LGR_PRICE_USD).toFixed(18), 18);

      // 5. Call the createProposal function
      const votingDuration = 86400; // 24 hours
      const tx = await createProposal(
        {
          ipfsHash: ipfsHash,
          targetCapital: targetCapital,
          votingDuration: votingDuration
        },
        primaryWallet
      );

      // 6. Wait for the transaction to be confirmed
      await tx.wait();

      // 7. Redirect to the proposal page
      toast({
        title: "Proposal Created",
        description: "Your proposal has been created successfully.",
      });
      router.push('/proposals');
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error Creating Proposal",
        description: error.message || "An error occurred while creating the proposal.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto bg-black/50 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Submit Thesis Proposal</CardTitle>
          <CardDescription>
            Fill out the form below to submit your thesis proposal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acquisition of Tech Startup" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your proposal a clear and concise title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion type="single" collapsible>
                <AccordionItem value="firmCriteria">
                  <AccordionTrigger className="text-lg">Firm Criteria</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firmCriteria.size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Firm Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Small (5-20 employees)">Small (5-20 employees)</SelectItem>
                                <SelectItem value="Medium (21-50 employees)">Medium (21-50 employees)</SelectItem>
                                <SelectItem value="Large (51+ employees)">Large (51+ employees)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Specify the target firm size.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="firmCriteria.location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. California" {...field} />
                            </FormControl>
                            <FormDescription>
                              Specify the target firm location.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="firmCriteria.dealType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deal Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a deal type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Full Acquisition">Full Acquisition</SelectItem>
                                <SelectItem value="Majority Stake">Majority Stake</SelectItem>
                                <SelectItem value="Minority Stake">Minority Stake</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Specify the type of deal you are proposing.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="firmCriteria.geographicFocus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Geographic Focus</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. West Coast" {...field} />
                            </FormControl>
                            <FormDescription>
                              Specify the geographic focus of the target firm.
                            </FormMessage>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Initial payment of 30% upon signing"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify the proposed payment terms.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion type="single" collapsible>
                <AccordionItem value="strategies">
                  <AccordionTrigger className="text-lg">Value Creation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="strategies.operational"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Operational</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g. Implement cloud-based workflow automation"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Specify the operational strategies.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <FormField
                          control={form.control}
                          name="strategies.growth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Growth</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g. Expand service offerings to include AI solutions"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Specify the growth strategies.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <FormField
                          control={form.control}
                          name="strategies.integration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Integration</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g. Retain key technical personnel"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Specify the integration strategies.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" collapsible>
                <AccordionItem value="investment">
                  <AccordionTrigger className="text-lg">Investment Thesis</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <TargetCapitalInput
                      value={targetCapitalUSD}
                      onChange={handleTargetCapitalChange}
                      error={form.formState.errors.investment?.targetCapital?.message ? [form.formState.errors.investment.targetCapital.message] : undefined}
                    />

                    <FormField
                      control={form.control}
                      name="investment.drivers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Investment Drivers</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. Strong recurring revenue from established client base"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Specify the key drivers behind the investment.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investment.additionalCriteria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Criteria</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. Preference for firms with existing cloud infrastructure"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Specify any additional criteria for the investment.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThesisSubmission;
