
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { Bounty } from "@/services/bountyService";

const formSchema = z.object({
  proofLink: z.string().url({ message: "Please enter a valid URL" }).min(1, { message: "Proof link is required" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ClaimBountyFormProps {
  bounty: Bounty;
}

export const ClaimBountyForm: React.FC<ClaimBountyFormProps> = ({ bounty }) => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proofLink: "",
      notes: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit proof",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // In a real implementation, this would interact with a backend API
      // to validate and process the claim
      
      // Simulate a backend call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Claim Submitted",
        description: "Your proof has been submitted for verification",
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting proof:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your proof",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/30 mt-6">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-medium text-white">Claim Submitted</h3>
        </div>
        <p className="text-gray-300 mb-3">
          Your claim has been submitted and is pending verification. You'll receive your reward once it's verified.
        </p>
        <ToxicButton 
          variant="outline" 
          className="w-full"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Claim
        </ToxicButton>
      </div>
    );
  }
  
  return (
    <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/30 mt-6">
      <h3 className="text-lg font-medium text-white mb-3">Submit Proof</h3>
      <p className="text-gray-300 mb-4">
        Provide proof of your successful referral to claim your reward
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="proofLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Proof Link</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://polygonscan.com/tx/..."
                    className="bg-black/40 border-toxic-neon/30 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide any additional information about your submission..."
                    className="bg-black/40 border-toxic-neon/30 text-white h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <ToxicButton 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={submitting || !primaryWallet}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : !primaryWallet ? (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Connect Wallet to Submit
              </>
            ) : (
              "Submit Proof"
            )}
          </ToxicButton>
        </form>
      </Form>
    </div>
  );
};
