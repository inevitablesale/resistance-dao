import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput, convertUSDToLGRWei } from "@/components/thesis/TargetCapitalInput";
import { ContractApprovalStatus } from "@/components/thesis/ContractApprovalStatus";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { PaymentTermsSection } from "@/components/thesis/form-sections/PaymentTermsSection";
import { StrategiesSection } from "@/components/thesis/form-sections/StrategiesSection";
import { FirmCriteriaSection } from "@/components/thesis/form-sections/FirmCriteriaSection";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { ProposalMetadata, FirmSize, DealType, GeographicFocus, ProposalConfig, PaymentTerm, OperationalStrategy, GrowthStrategy, IntegrationStrategy } from "@/types/proposals";
import { SUBMISSION_FEE } from "@/lib/constants";
import { uploadToIPFS } from "@/services/ipfsService";
import { createProposal } from "@/services/proposalContractService";
import { ethers } from "ethers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const thesisFormSchema = z.object({
  title: z.string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters"),
  investment: z.object({
    targetCapital: z.string()
      .min(1, "Target capital is required")
      .refine(
        (val) => {
          const num = parseFloat(val);
          return num >= 1000 && num <= 25000000;
        },
        "Target capital must be between 1,000 and 25,000,000 LGR"
      ),
    drivers: z.string()
      .min(50, "Investment drivers must be at least 50 characters")
      .max(500, "Investment drivers must be less than 500 characters"),
    additionalCriteria: z.string()
      .max(500, "Additional criteria must be less than 500 characters")
  }),
  firmCriteria: z.object({
    size: z.number()
      .min(0)
      .max(Object.keys(FirmSize).length / 2 - 1, "Invalid firm size"),
    location: z.string()
      .min(1, "Location is required")
      .max(100, "Location must be less than 100 characters"),
    dealType: z.number()
      .min(0)
      .max(Object.keys(DealType).length / 2 - 1, "Invalid deal type"),
    geographicFocus: z.number()
      .min(0)
      .max(Object.keys(GeographicFocus).length / 2 - 1, "Invalid geographic focus")
  }),
  paymentTerms: z.array(z.number())
    .min(1, "At least one payment term is required")
    .refine(
      (terms) => terms.every(t => t >= 0 && t < Object.keys(PaymentTerm).length / 2),
      "Invalid payment term selected"
    ),
  strategies: z.object({
    operational: z.array(z.number())
      .min(1, "At least one operational strategy is required")
      .refine(
        (ops) => ops.every(o => o >= 0 && o < Object.keys(OperationalStrategy).length / 2),
        "Invalid operational strategy selected"
      ),
    growth: z.array(z.number())
      .min(1, "At least one growth strategy is required")
      .refine(
        (growth) => growth.every(g => g >= 0 && g < Object.keys(GrowthStrategy).length / 2),
        "Invalid growth strategy selected"
      ),
    integration: z.array(z.number())
      .min(1, "At least one integration strategy is required")
      .refine(
        (ints) => ints.every(i => i >= 0 && i < Object.keys(IntegrationStrategy).length / 2),
        "Invalid integration strategy selected"
      )
  }),
  votingDuration: z.number()
    .min(7 * 24 * 60 * 60, "Minimum voting duration is 7 days")
    .max(90 * 24 * 60 * 60, "Maximum voting duration is 90 days"),
  linkedInURL: z.string()
    .min(1, "LinkedIn URL is required")
    .max(200, "LinkedIn URL must be less than 200 characters")
});

const ThesisSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, address, wallet } = useWalletConnection();
  const { user } = useDynamicContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleApprovalComplete = () => {
    setIsApproved(true);
    toast({
      title: "Approval Complete",
      description: "You can now submit your investment thesis"
    });
  };

  const getLinkedInUrl = () => {
    if (!user) {
      console.log("[LinkedIn] No user data available");
      return "";
    }

    const urlFromMetadata = user.metadata?.["LinkedIn Profile URL"];
    const urlFromVerifications = user.verifications?.customFields?.["LinkedIn Profile URL"];
    
    const url = urlFromMetadata || urlFromVerifications;
    
    console.log("[LinkedIn] URL Resolution:", {
      fromMetadata: urlFromMetadata,
      fromVerifications: urlFromVerifications,
      finalUrl: url,
      user: user
    });
    
    return url || "";
  };

  const form = useForm<ProposalMetadata>({
    resolver: zodResolver(thesisFormSchema),
    defaultValues: {
      title: "",
      investment: {
        targetCapital: "",
        drivers: "",
        additionalCriteria: ""
      },
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
      votingDuration: 7 * 24 * 60 * 60,
      linkedInURL: ""
    }
  });

  useEffect(() => {
    const linkedInUrl = getLinkedInUrl();
    console.log("[LinkedIn] Setting form LinkedIn URL:", linkedInUrl);
    if (linkedInUrl) {
      form.setValue("linkedInURL", linkedInUrl, { shouldValidate: true });
    }
  }, [user]);

  const validateStrategies = (data: ProposalMetadata): boolean => {
    const { operational, growth, integration } = data.strategies;
    
    if (!operational.length || !growth.length || !integration.length) {
      const missing = [];
      if (!operational.length) missing.push("operational");
      if (!growth.length) missing.push("growth");
      if (!integration.length) missing.push("integration");
      
      toast({
        title: "Missing Strategies",
        description: `Please select at least one ${missing.join(", ")} strategy`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateLinkedInUrl = (url: string): boolean => {
    if (!url) {
      toast({
        title: "LinkedIn URL Required",
        description: "Please ensure your LinkedIn profile is connected",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const onSubmit = async (data: ProposalMetadata) => {
    console.log("[Form] Starting submission with data:", data);

    if (!isConnected || !wallet) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to submit a thesis",
        variant: "destructive"
      });
      return;
    }

    if (!isApproved) {
      toast({
        title: "Approval Required",
        description: "Please approve the contract to submit your thesis",
        variant: "destructive"
      });
      return;
    }

    if (!validateStrategies(data)) {
      return;
    }

    const linkedInUrl = getLinkedInUrl();
    console.log("[LinkedIn] URL for submission:", linkedInUrl);
    
    if (!validateLinkedInUrl(linkedInUrl)) {
      return;
    }

    setIsSubmitting(true);
    try {
      let targetCapitalWei;
      try {
        targetCapitalWei = convertUSDToLGRWei(data.investment.targetCapital);
        console.log("Target capital in wei:", targetCapitalWei.toString());
      } catch (error) {
        console.error("Target capital conversion error:", error);
        toast({
          title: "Invalid Target Capital",
          description: error instanceof Error ? error.message : "Please enter a valid target capital amount",
          variant: "destructive"
        });
        return;
      }

      const metadataWithLinkedIn = {
        ...data,
        linkedInURL: linkedInUrl
      };
      
      console.log("Uploading form data to IPFS:", metadataWithLinkedIn);
      const ipfsHash = await uploadToIPFS<ProposalMetadata>(metadataWithLinkedIn);
      console.log("IPFS upload successful, hash:", ipfsHash);

      const config: ProposalConfig = {
        targetCapital: targetCapitalWei,
        votingDuration: data.votingDuration,
        ipfsHash,
        metadata: metadataWithLinkedIn,
        linkedInURL: linkedInUrl
      };

      console.log("Creating proposal with config:", config);
      const tx = await createProposal(config, wallet);
      console.log("Proposal created successfully:", tx);

      toast({
        title: "Success",
        description: "Your thesis has been submitted successfully",
      });
      navigate("/proposals");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit thesis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-teal-500/5 to-yellow-500/5 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList className="text-white/60">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="hover:text-white">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/proposals" className="hover:text-white">Proposals</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Share Investment Strategy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-teal-500 mb-4">
              Share Your Investment Strategy
            </h1>
            <p className="text-lg text-white/60">
              Present your acquisition strategy to find co-investors who share your vision.
            </p>
          </div>

          <Card className="bg-black/40 border-white/10 p-6 mb-8">
            <h2 className="text-lg font-medium text-white mb-4">Step 1: Approve Contract</h2>
            <ContractApprovalStatus
              onApprovalComplete={handleApprovalComplete}
              requiredAmount={SUBMISSION_FEE}
              isTestMode={false}
              currentFormData={form.getValues()}
            />
          </Card>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="bg-black/40 border-white/10 p-6">
              <h2 className="text-lg font-medium text-white mb-4">Step 2: Investment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-medium text-white">Title</label>
                  <Input
                    {...form.register("title")}
                    placeholder="Enter a descriptive title for your investment thesis"
                    className="mt-2"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-400 mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium text-white">Investment Drivers</label>
                  <Textarea
                    {...form.register("investment.drivers")}
                    placeholder="Describe the key drivers behind this investment opportunity..."
                    className="mt-2 min-h-[100px]"
                  />
                  {form.formState.errors.investment?.drivers && (
                    <p className="text-sm text-red-400 mt-1">{form.formState.errors.investment.drivers.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-lg font-medium text-white">Additional Criteria</label>
                  <Textarea
                    {...form.register("investment.additionalCriteria")}
                    placeholder="Any additional investment criteria or preferences..."
                    className="mt-2"
                  />
                  {form.formState.errors.investment?.additionalCriteria && (
                    <p className="text-sm text-red-400 mt-1">{form.formState.errors.investment.additionalCriteria.message}</p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-white/10 p-6">
              <h2 className="text-lg font-medium text-white mb-4">Step 3: Investment Parameters</h2>
              <div className="space-y-6">
                <TargetCapitalInput
                  value={form.watch("investment.targetCapital")}
                  onChange={(value) => form.setValue("investment.targetCapital", value, { shouldValidate: true })}
                  error={form.formState.errors.investment?.targetCapital?.message?.split(",")}
                />

                <VotingDurationInput
                  value={form.watch("votingDuration")}
                  onChange={(value) => form.setValue("votingDuration", value[0], { shouldValidate: true })}
                  error={form.formState.errors.votingDuration?.message?.split(",")}
                />
              </div>
            </Card>

            <FirmCriteriaSection
              formData={form.getValues()}
              formErrors={form.formState.errors}
              onChange={(field, value) => {
                form.setValue(`firmCriteria.${field}` as const, value, { shouldValidate: true });
              }}
            />

            <PaymentTermsSection
              formData={form.getValues()}
              formErrors={form.formState.errors}
              register={form.register}
              onChange={(_, value) => form.setValue('paymentTerms', value, { shouldValidate: true })}
            />

            <StrategiesSection
              formData={form.getValues()}
              formErrors={form.formState.errors}
              register={form.register}
              onChange={(category, value) => {
                form.setValue(`strategies.${category}` as const, value, { shouldValidate: true });
              }}
            />

            <Button 
              type="submit"
              disabled={isSubmitting || !form.formState.isValid || !isApproved}
              className={cn(
                "w-full h-12",
                "bg-gradient-to-r from-yellow-500 to-teal-500 hover:from-yellow-600 hover:to-teal-600",
                "text-white font-medium",
                "transition-all duration-300",
                "disabled:opacity-50",
                "flex items-center justify-center gap-2"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Submit Investment Thesis</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>

      <LGRFloatingWidget />
    </div>
  );
};

export default ThesisSubmission;
