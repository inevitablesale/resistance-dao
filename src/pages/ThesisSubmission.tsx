import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { File, DollarSign, Users, MessageSquare, Timer, HelpCircle, Beaker } from "lucide-react";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput, convertToWei } from "@/components/thesis/TargetCapitalInput";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ProposalMetadata } from "@/types/proposals";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { createProposal } from "@/services/proposalContractService";
import { RD_TOKEN_ADDRESS, FACTORY_ADDRESS, SUBMISSION_FEE } from "@/lib/constants";
import { checkTokenAllowance, approveExactAmount } from "@/services/tokenService";
import { ethers } from "ethers";

const thesisFormSchema = z.object({
  title: z.string().min(2, {
    message: "Thesis title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  external_url: z.string().url({
    message: "Please enter a valid project URL.",
  }),
  image: z.string().min(1, {
    message: "Project image is required.",
  }),
  investment: z.object({
    targetCapital: z.string().min(1, {
      message: "Target capital is required."
    }),
    description: z.string().min(10, {
      message: "Investment description must be at least 10 characters.",
    }),
  }),
  fundingBreakdown: z.array(z.object({
    category: z.string(),
    amount: z.string()
  })),
  team: z.array(z.object({
    name: z.string(),
    role: z.string(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
  })),
  votingDuration: z.number().min(7 * 24 * 60 * 60, {
    message: "Voting duration must be at least 7 days.",
  }),
  linkedInURL: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
  blockchain: z.string().array().nonempty({
    message: "Please select at least one blockchain.",
  }),
  socials: z.object({
    twitter: z.string().url().optional(),
    discord: z.string().url().optional(),
    telegram: z.string().url().optional(),
  }),
});

const requiredFormData = {
  title: "Decentralized Identity Protocol",
  description: "A protocol for self-sovereign identity management using zero-knowledge proofs",
  category: "Identity & Privacy",
  external_url: "https://zkid.example.com",
  image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  investment: {
    targetCapital: "500000",
    description: "Funding for protocol development and security audits",
  },
  fundingBreakdown: [],
  team: [
    {
      name: "Alice Johnson",
      role: "Lead Developer",
      linkedin: "https://linkedin.com/in/alice",
      github: "https://github.com/alicejohnson"
    },
    {
      name: "Bob Smith",
      role: "Security Architect",
      linkedin: "https://linkedin.com/in/bob",
      github: "https://github.com/bobsmith"
    }
  ],
  votingDuration: 14 * 24 * 60 * 60, // 14 days
  linkedInURL: "https://linkedin.com/in/example",
  blockchain: ["Ethereum", "Polygon"],
  socials: {
    twitter: "",
    discord: "",
    telegram: "",
  },
};

const completeFormData = {
  ...requiredFormData,
  fundingBreakdown: [
    { category: "Smart Contract Development", amount: "200000" },
    { category: "Security Audit", amount: "100000" },
    { category: "Marketing & Community", amount: "100000" },
    { category: "Operations & Legal", amount: "100000" }
  ],
  team: [
    {
      name: "Alice Johnson",
      role: "Lead Developer",
      linkedin: "https://linkedin.com/in/alice",
      github: "https://github.com/alicejohnson"
    },
    {
      name: "Bob Smith",
      role: "Security Architect",
      linkedin: "https://linkedin.com/in/bob",
      github: "https://github.com/bobsmith"
    }
  ],
  socials: {
    twitter: "https://twitter.com/zkidproject",
    discord: "https://discord.gg/zkid",
    telegram: "https://t.me/zkidproject"
  }
};

export default function ThesisSubmission() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof thesisFormSchema>>({
    resolver: zodResolver(thesisFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      external_url: "",
      image: "",
      investment: {
        targetCapital: "",
        description: "",
      },
      fundingBreakdown: [
        { category: "", amount: "" },
        { category: "", amount: "" },
        { category: "", amount: "" },
        { category: "", amount: "" }
      ],
      team: [
        { name: "", role: "", linkedin: "", github: "" },
        { name: "", role: "", linkedin: "", github: "" }
      ],
      votingDuration: 7 * 24 * 60 * 60,
      linkedInURL: "",
      blockchain: [],
      socials: {
        twitter: "",
        discord: "",
        telegram: "",
      },
    }
  });

  const fillRequiredData = () => {
    form.reset(requiredFormData);
    toast({
      title: "Required Data Loaded",
      description: "Form has been filled with required fields only.",
    });
  };

  const fillCompleteData = () => {
    form.reset(completeFormData);
    toast({
      title: "Complete Data Loaded",
      description: "Form has been filled with all available fields.",
    });
  };

  async function onSubmit(values: z.infer<typeof thesisFormSchema>) {
    setIsSubmitting(true);
    try {
      if (!primaryWallet) {
        throw new Error("Wallet is not available");
      }

      const walletClient = await primaryWallet.getWalletClient();
      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      toast({
        title: "Checking Allowance...",
        description: "Checking if approval is needed for token usage",
      });

      const hasAllowance = await checkTokenAllowance(
        provider,
        RD_TOKEN_ADDRESS,
        signerAddress,
        FACTORY_ADDRESS,
        ethers.utils.formatEther(SUBMISSION_FEE) // Convert wei to human readable for the check
      );

      if (!hasAllowance) {
        toast({
          title: "Approving Token Usage...",
          description: "Please approve the transaction to allow token usage",
        });

        const approveTx = await approveExactAmount(
          provider,
          RD_TOKEN_ADDRESS,
          FACTORY_ADDRESS,
          ethers.utils.formatEther(SUBMISSION_FEE) // Convert wei to human readable for the approval
        );
        
        toast({
          title: "Waiting for Approval...",
          description: "Please wait while the approval transaction is confirmed",
        });

        await approveTx.wait();

        toast({
          title: "Token Approved",
          description: "Now creating your proposal...",
        });
      }

      const metadata: ProposalMetadata = {
        title: values.title,
        description: values.description,
        category: values.category,
        investment: {
          targetCapital: values.investment.targetCapital,
          description: values.investment.description,
        },
        votingDuration: values.votingDuration,
        linkedInURL: values.linkedInURL,
        blockchain: values.blockchain,
        fundingBreakdown: values.fundingBreakdown
          .filter(item => item.category && item.amount)
          .map(item => ({
            category: item.category,
            amount: item.amount
          })),
        team: values.team
          .filter(member => member.name && member.role)
          .map(member => ({
            name: member.name,
            role: member.role,
            linkedin: member.linkedin,
            github: member.github
          })),
        socials: {
          twitter: values.socials.twitter || undefined,
          discord: values.socials.discord || undefined,
          telegram: values.socials.telegram || undefined
        },
        submissionTimestamp: Math.floor(Date.now() / 1000),
        submitter: await signer.getAddress(),
        isTestMode: false
      };

      toast({
        title: "Creating Proposal...",
        description: "Please wait while we process your submission.",
      });

      const tx = await createProposal(metadata, primaryWallet);

      toast({
        title: "Proposal Created!",
        description: "Your proposal has been successfully created.",
      });

      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'ProposalCreated');
      if (event && event.args) {
        const tokenId = event.args.proposalId.toString();
        navigate(`/proposals/${tokenId}`);
      }

    } catch (error: any) {
      console.error("Error submitting thesis:", error);
      toast({
        title: "Error Submitting Thesis",
        description: error.message || "An error occurred while submitting the thesis.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm mb-4">
              🚀 Launch Your Web3 Project
            </div>
            <h1 className="text-5xl font-bold text-white font-mono">
              Submit Your Proposal
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join the Resistance DAO and shape the future of web3 accounting. Present your proposal to our community of seasoned professionals and find co-builders who share your vision.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={fillRequiredData}
                variant="outline"
                className="bg-black/30 border-blue-500/30 hover:border-blue-500/50 text-blue-400 gap-2"
              >
                <Beaker className="w-4 h-4" />
                Load Required Data
              </Button>
              <Button
                onClick={fillCompleteData}
                variant="outline"
                className="bg-black/30 border-green-500/30 hover:border-green-500/50 text-green-400 gap-2"
              >
                <Beaker className="w-4 h-4" />
                Load Complete Data
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <File className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Project Overview</h2>
                </div>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Title</Label>
                      <Input
                        {...form.register("title")}
                        placeholder="Enter your project title"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        {...form.register("category")}
                        placeholder="e.g., DeFi, NFT, Gaming"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      {...form.register("description")}
                      placeholder="Describe your project's vision and goals..."
                      className="mt-2 bg-black/50 border-white/10 min-h-[120px]"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Project URL</Label>
                      <Input
                        {...form.register("external_url")}
                        placeholder="https://your-project.com"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                    <div>
                      <Label>Project Image URL</Label>
                      <Input
                        {...form.register("image")}
                        placeholder="https://image-url.com"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Investment Details</h2>
                </div>
                <div className="space-y-6">
                  <TargetCapitalInput
                    value={form.watch("investment.targetCapital")}
                    onChange={(value) => form.setValue("investment.targetCapital", value)}
                    error={form.formState.errors.investment?.targetCapital ? [form.formState.errors.investment.targetCapital.message || ""] : undefined}
                  />
                  
                  {form.watch("fundingBreakdown")?.map((_, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <Input
                        {...form.register(`fundingBreakdown.${index}.category`)}
                        placeholder="Category (e.g., Smart Contract Development)"
                        className="bg-black/50 border-white/10"
                      />
                      <Input
                        {...form.register(`fundingBreakdown.${index}.amount`)}
                        placeholder="Amount in RD"
                        className="bg-black/50 border-white/10"
                      />
                    </div>
                  ))}

                  <VotingDurationInput
                    value={form.watch("votingDuration")}
                    onChange={(value) => form.setValue("votingDuration", value[0])}
                    error={form.formState.errors.votingDuration ? [form.formState.errors.votingDuration.message || ""] : undefined}
                  />
                </div>
              </div>

              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Team & Roadmap</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Team Members</Label>
                    <div className="space-y-4">
                      {[0, 1].map((index) => (
                        <div key={index}>
                          <Input
                            {...form.register(`team.${index}.name`)}
                            placeholder={`Team member ${index + 1} name`}
                            className="bg-black/50 border-white/10 mb-2"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              {...form.register(`team.${index}.role`)}
                              placeholder="Role"
                              className="bg-black/50 border-white/10"
                            />
                            <Input
                              {...form.register(`team.${index}.linkedin`)}
                              placeholder="LinkedIn URL"
                              className="bg-black/50 border-white/10"
                            />
                            <Input
                              {...form.register(`team.${index}.github`)}
                              placeholder="GitHub URL"
                              className="bg-black/50 border-white/10"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Social Links</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    {...form.register("socials.twitter")}
                    placeholder="Twitter URL"
                    className="bg-black/50 border-white/10"
                  />
                  <Input
                    {...form.register("socials.discord")}
                    placeholder="Discord URL"
                    className="bg-black/50 border-white/10"
                  />
                  <Input
                    {...form.register("socials.telegram")}
                    placeholder="Telegram URL"
                    className="bg-black/50 border-white/10"
                  />
                </div>
              </div>

              <div className="bg-[#0a1020] rounded-xl border border-white/5 p-6">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                      ℹ️
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Your proposal will be minted as an NFT, representing a binding smart contract. A fee of 25 RD tokens is required to submit.
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Submitting...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Launch Proposal
                    <span className="text-xl">→</span>
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
