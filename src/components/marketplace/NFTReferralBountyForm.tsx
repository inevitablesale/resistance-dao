
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Gift, Calendar, Target, Coins, Users } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  ToxicCard, 
  ToxicCardContent, 
  ToxicCardHeader, 
  ToxicCardTitle, 
  ToxicCardDescription 
} from "@/components/ui/toxic-card";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useToast } from "@/hooks/use-toast";
import { createBounty } from "@/services/bountyService";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ProposalTemplate } from "@/components/settlements/ProposalTemplates";
import { createBountyParty, BountyPartyOptions } from "@/services/partyProtocolService";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name cannot exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rewardAmount: z.coerce.number().min(0.001, "Reward must be at least 0.001 MATIC"),
  totalBudget: z.coerce.number().min(0.1, "Budget must be at least 0.1 MATIC"),
  expiration: z.coerce.number().min(1, "Expiration must be at least 1 day").max(365, "Expiration cannot exceed 365 days"),
  successCriteria: z.string().min(5, "Success criteria must be at least 5 characters"),
  maxParticipants: z.coerce.number().int().min(1, "Must allow at least 1 participant").optional().default(100)
});

type NFTReferralBountyFormValues = z.infer<typeof formSchema>;

interface NFTReferralBountyFormProps {
  template?: ProposalTemplate;
  onBack: () => void;
}

export const NFTReferralBountyForm = ({ template, onBack }: NFTReferralBountyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, primaryWallet } = useWalletConnection();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<NFTReferralBountyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.defaultTitle || "NFT Referral Bounty",
      description: template?.defaultDescription || "Reward community members for referring new NFT minters",
      rewardAmount: 0.1,
      totalBudget: 1,
      expiration: 30,
      successCriteria: "User must mint an NFT using referrer's link",
      maxParticipants: 100
    }
  });

  const onSubmit = async (data: NFTReferralBountyFormValues) => {
    if (!address || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a bounty",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      toast({
        title: "Creating Bounty",
        description: "Preparing your bounty program...",
      });

      // Create bounty in database first
      const bounty = await createBounty({
        name: data.name,
        description: data.description,
        rewardAmount: data.rewardAmount,
        totalBudget: data.totalBudget,
        startDate: new Date().getTime() / 1000,
        expiresAt: new Date().getTime() / 1000 + (data.expiration * 24 * 60 * 60),
        creatorAddress: address,
        successCriteria: data.successCriteria,
        status: "draft",
        usedBudget: 0,
        successCount: 0,
        maxParticipants: data.maxParticipants,
        requiresVerification: true
      });

      // After creating the bounty entity, navigate to the management page
      toast({
        title: "Bounty Created!",
        description: "Your bounty is ready to be deployed to the blockchain",
      });

      navigate("/bounty/management");
    } catch (error) {
      console.error("Error creating bounty:", error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create bounty",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <DrippingSlime position="top" dripsCount={8} className="absolute inset-0 pointer-events-none" />

      <button 
        onClick={onBack}
        className="text-toxic-neon hover:text-toxic-neon/80 flex items-center gap-1 text-sm mb-4 relative z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to templates
      </button>

      <ToxicCard className="relative overflow-visible mb-6 border-toxic-neon/30">
        <ToxicCardHeader className="flex flex-row items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-toxic-neon/10 flex items-center justify-center">
            <Gift className="w-6 h-6 text-toxic-neon" />
          </div>
          <div className="flex-1">
            <ToxicCardTitle>Create NFT Referral Bounty</ToxicCardTitle>
            <ToxicCardDescription className="mt-2">
              Set up a new bounty to reward community members for referring new NFT minters.
            </ToxicCardDescription>
          </div>
        </ToxicCardHeader>
        <ToxicCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-toxic-neon">Bounty Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="NFT Referral Program" 
                            className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-toxic-neon">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the bounty program and its goals..."
                            className="min-h-24 bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="successCriteria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-toxic-neon">Success Criteria</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Define what constitutes a successful referral..."
                            className="min-h-24 bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-toxic-neon/20 rounded-md bg-black/30 radiation-scan-lines mb-6">
                    <h3 className="text-toxic-neon text-sm font-medium mb-3 flex items-center">
                      <Coins className="w-4 h-4 mr-2" />
                      Reward Configuration
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="rewardAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/70">Reward Per Referral (MATIC)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.001"
                                min="0.001"
                                className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalBudget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/70">Total Budget (MATIC)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                step="0.1"
                                min="0.1" 
                                className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="p-4 border border-toxic-neon/20 rounded-md bg-black/30 radiation-scan-lines">
                    <h3 className="text-toxic-neon text-sm font-medium mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Duration & Limits
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="expiration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/70">Duration (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="1"
                                max="365" 
                                className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/70">Maximum Participants</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="1"
                                className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-toxic-neon/10" />

              <div className="flex justify-between items-center">
                <div className="text-white/60 text-sm">
                  Maximum Possible Referrals: {form.watch("totalBudget") && form.watch("rewardAmount") ? Math.floor(form.watch("totalBudget") / form.watch("rewardAmount")) : 0}
                </div>
                
                <div className="space-x-2">
                  <ToxicButton 
                    type="button" 
                    variant="tertiary"
                    onClick={onBack}
                  >
                    Cancel
                  </ToxicButton>
                  <ToxicButton 
                    type="submit" 
                    variant="primary"
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Create Bounty
                      </>
                    )}
                  </ToxicButton>
                </div>
              </div>
            </form>
          </Form>
        </ToxicCardContent>
      </ToxicCard>
    </div>
  );
};
