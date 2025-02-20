import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  title: z.string().min(1, "Title is required"),
  investment: z.object({
    targetCapital: z.string().min(1, "Target capital is required"),
    drivers: z.string(),
    additionalCriteria: z.string()
  }),
  firmCriteria: z.object({
    size: z.number(),
    location: z.string(),
    dealType: z.number(),
    geographicFocus: z.number()
  }),
  paymentTerms: z.array(z.number()),
  strategies: z.object({
    operational: z.array(z.number()),
    growth: z.array(z.number()),
    integration: z.array(z.number())
  }),
  votingDuration: z.number(),
  linkedInURL: z.string().url("Please enter a valid LinkedIn URL").or(z.string().length(0))
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
      votingDuration: 0,
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
            <ContractApprovalStatus
              onApprovalComplete={() => {}}
              requiredAmount={0}
              isTestMode={false}
              currentFormData={form.getValues()}
            />

            <Card className={cn(
              "bg-black/40 border-white/5 backdrop-blur-sm",
              Object.keys(form.formState.errors).length > 0 ? "border-red-500/20" : ""
            )}>
              <div className="p-6 space-y-8">
                <PaymentTermsSection
                  formData={form.getValues()}
                  formErrors={form.formState.errors}
                  onChange={(field, value) => form.setValue('paymentTerms', value)}
                />

                <FirmCriteriaSection
                  formData={form.getValues()}
                  formErrors={form.formState.errors}
                  onChange={(field, value) => {
                    form.setValue(`firmCriteria.${field}` as any, value);
                  }}
                />

                <StrategiesSection
                  formData={form.getValues()}
                  formErrors={form.formState.errors}
                  onChange={(category, value) => {
                    form.setValue(`strategies.${category}`, value);
                  }}
                />
              </div>

              <div className="border-t border-white/5 p-6">
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
              </div>
            </Card>
          </form>
        </div>
      </div>

      <LGRFloatingWidget />
    </div>
  );
};

export default ThesisSubmission;
