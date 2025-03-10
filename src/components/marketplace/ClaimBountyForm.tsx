
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle2, Link as LinkIcon, User, X } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { recordSuccessfulReferral } from "@/services/bountyService";

const claimBountySchema = z.object({
  referredAddress: z.string()
    .min(42, "Address must be 42 characters")
    .max(42, "Address must be 42 characters")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
  transactionHash: z.string()
    .min(66, "Transaction hash must be 66 characters")
    .max(66, "Transaction hash must be 66 characters")
    .regex(/^0x[a-fA-F0-9]{64}$/, "Must be a valid transaction hash"),
  proofDescription: z.string().min(10, "Please provide more details").max(500, "Description too long")
});

type ClaimBountyFormValues = z.infer<typeof claimBountySchema>;

interface ClaimBountyFormProps {
  bountyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClaimBountyForm({ bountyId, onSuccess, onCancel }: ClaimBountyFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ClaimBountyFormValues>({
    resolver: zodResolver(claimBountySchema),
    defaultValues: {
      referredAddress: "",
      transactionHash: "",
      proofDescription: ""
    }
  });
  
  const onSubmit = async (data: ClaimBountyFormValues) => {
    setIsSubmitting(true);
    try {
      // We'll use the current wallet address as the referrer in this simple implementation
      const referrerAddress = "0x123"; // In a real app, this would come from the connected wallet
      
      const result = await recordSuccessfulReferral(
        bountyId,
        referrerAddress,
        data.referredAddress
      );
      
      if (result) {
        toast({
          title: "Success!",
          description: "Your bounty claim has been submitted successfully",
        });
        onSuccess();
      } else {
        throw new Error("Failed to record successful referral");
      }
    } catch (error: any) {
      console.error("Error claiming bounty:", error);
      toast({
        title: "Failed to Submit Claim",
        description: error.message || "There was an error submitting your claim",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="referredAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-toxic-neon" />
                Referred Wallet Address
              </FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormDescription>
                The wallet address of the user you referred
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="transactionHash"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-toxic-neon" />
                Transaction Hash
              </FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormDescription>
                The transaction hash of the successful referral
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="proofDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-toxic-neon" />
                Additional Proof
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe how you helped this user complete the bounty requirements..."
                  {...field}
                  className="h-24 resize-none bg-black/30 border-gray-800"
                />
              </FormControl>
              <FormDescription>
                Provide any additional context or evidence for your claim
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <ToxicButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Claim"}
          </ToxicButton>
        </div>
      </form>
    </Form>
  );
}
