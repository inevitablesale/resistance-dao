
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { recordSuccessfulReferral, Bounty } from '@/services/bountyService';
import { ethers } from 'ethers';

const formSchema = z.object({
  referredAddress: z
    .string()
    .min(42, { message: "Please enter a valid Ethereum address" })
    .refine(
      (address) => ethers.utils.isAddress(address),
      { message: "Invalid Ethereum address format" }
    ),
  proofOfReferral: z.string().min(10, {
    message: "Please provide details about how you referred this user",
  }),
});

interface ClaimBountyFormProps {
  bounty: Bounty;
}

export const ClaimBountyForm: React.FC<ClaimBountyFormProps> = ({ bounty }) => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referredAddress: "",
      proofOfReferral: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!primaryWallet?.address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive",
      });
      return;
    }
    
    if (bounty.status !== "active") {
      toast({
        title: "Bounty Unavailable",
        description: "This bounty is no longer active",
        variant: "destructive",
      });
      return;
    }
    
    if (values.referredAddress.toLowerCase() === primaryWallet.address.toLowerCase()) {
      toast({
        title: "Invalid Referral",
        description: "You cannot refer yourself",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await recordSuccessfulReferral(
        bounty.id,
        primaryWallet.address,
        values.referredAddress
      );
      
      if (result) {
        setClaimSuccess(true);
        toast({
          title: "Claim Submitted",
          description: `Successfully recorded your referral for ${bounty.rewardAmount} MATIC`,
        });
        form.reset();
      } else {
        toast({
          title: "Claim Failed",
          description: "Unable to record your referral. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error claiming bounty:", error);
      toast({
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!primaryWallet) {
    return (
      <Alert className="bg-yellow-900/20 border-yellow-600/30">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <AlertTitle className="ml-2 text-yellow-500">Wallet Required</AlertTitle>
        <AlertDescription className="text-gray-400">
          Please connect your wallet to claim bounty rewards.
        </AlertDescription>
      </Alert>
    );
  }

  if (bounty.status !== "active") {
    return (
      <Alert className="bg-red-900/20 border-red-600/30">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <AlertTitle className="ml-2 text-red-500">Bounty {bounty.status}</AlertTitle>
        <AlertDescription className="text-gray-400">
          This bounty is no longer accepting claims.
        </AlertDescription>
      </Alert>
    );
  }

  if (claimSuccess) {
    return (
      <Alert className="bg-green-900/20 border-green-600/30">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <AlertTitle className="ml-2 text-green-500">Claim Submitted</AlertTitle>
        <AlertDescription className="text-gray-400">
          Your referral has been recorded successfully. You will receive {bounty.rewardAmount} MATIC once verified.
        </AlertDescription>
        <Button 
          className="w-full mt-4" 
          onClick={() => setClaimSuccess(false)}
        >
          Submit Another Claim
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Claim Your Bounty Reward</h3>
        <p className="text-gray-400 text-sm">
          Submit the details of the user you referred to claim your {bounty.rewardAmount} MATIC reward.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="referredAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referred Wallet Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="0x..." 
                    {...field} 
                    className="bg-black/40 border-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="proofOfReferral"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proof of Referral</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide details about how you referred this user..." 
                    {...field} 
                    className="bg-black/40 border-gray-700 min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Submit Claim
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <Alert className="bg-blue-900/20 border-blue-600/30 mt-6">
        <AlertTitle className="text-blue-400">Verification Process</AlertTitle>
        <AlertDescription className="text-gray-300 text-sm">
          Claims are verified automatically. Rewards are distributed within 24 hours once verified.
          You may need to provide additional proof if requested.
        </AlertDescription>
      </Alert>
    </div>
  );
};
