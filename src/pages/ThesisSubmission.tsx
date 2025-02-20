
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput } from "@/components/thesis/TargetCapitalInput";
import { ContractApprovalStatus } from "@/components/thesis/ContractApprovalStatus";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { PaymentTermsSection } from "@/components/thesis/form-sections/PaymentTermsSection";
import { StrategiesSection } from "@/components/thesis/form-sections/StrategiesSection";
import { FirmCriteriaSection } from "@/components/thesis/form-sections/FirmCriteriaSection";
import { LGRFloatingWidget } from "@/components/wallet/LGRFloatingWidget";
import { ProposalMetadata, FirmSize, DealType, GeographicFocus } from "@/types/proposals";
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
  title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title must be less than 100 characters"),
  investment: z.object({
    targetCapital: z.string().min(1, "Target capital is required"),
    drivers: z.string().min(50, "Investment drivers must be at least 50 characters").max(500, "Investment drivers must be less than 500 characters"),
    additionalCriteria: z.string().max(500, "Additional criteria must be less than 500 characters")
  }),
  firmCriteria: z.object({
    size: z.number(),
    location: z.string().min(1, "Location is required"),
    dealType: z.number(),
    geographicFocus: z.number()
  }),
  paymentTerms: z.array(z.number()).min(1, "At least one payment term is required"),
  strategies: z.object({
    operational: z.array(z.number()),
    growth: z.array(z.number()),
    integration: z.array(z.number())
  }),
  votingDuration: z.number().min(7 * 24 * 60 * 60, "Minimum voting duration is 7 days")
    .max(90 * 24 * 60 * 60, "Maximum voting duration is 90 days"),
  linkedInURL: z.string().url("Please enter a valid LinkedIn URL").max(200, "LinkedIn URL must be less than 200 characters")
});

const ThesisSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, address } = useWalletConnection();
  const { user } = useDynamicContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      votingDuration: 7 * 24 * 60 * 60, // 7 days in seconds
      linkedInURL: ""
    }
  });

  const onSubmit = async (data: ProposalMetadata) => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to submit a thesis",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "Your thesis has been submitted successfully",
      });
      navigate("/proposals");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit thesis. Please try again.",
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

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title and Investment Details */}
            <Card className="bg-black/40 border-white/10 p-6">
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

            {/* Target Capital and Timeline */}
            <Card className="bg-black/40 border-white/10 p-6">
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

            {/* LinkedIn URL */}
            <Card className="bg-black/40 border-white/10 p-6">
              <div>
                <label className="text-lg font-medium text-white">LinkedIn Profile URL</label>
                <Input
                  {...form.register("linkedInURL")}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="mt-2"
                />
                {form.formState.errors.linkedInURL && (
                  <p className="text-sm text-red-400 mt-1">{form.formState.errors.linkedInURL.message}</p>
                )}
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

            <ContractApprovalStatus
              onApprovalComplete={() => {}}
              requiredAmount={0}
              isTestMode={false}
              currentFormData={form.getValues()}
            />

            <Button 
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
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
