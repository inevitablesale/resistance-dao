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
import { uploadToIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";
import { useToast } from "@/hooks/use-toast";
import { waitForProposalCreation } from "@/services/eventListenerService";
import { mainnet, polygon, polygonMumbai } from 'viem/chains';
import { ethers } from 'ethers';
import { useNavigate } from "react-router-dom";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";

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

      const targetCapitalInWei = convertToWei(values.investment.targetCapital);

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
      };

      toast({
        title: "Uploading to IPFS...",
        description: "Please wait while we upload your proposal metadata to IPFS.",
      });
      const ipfsHash = await uploadToIPFS<ProposalMetadata>(metadata);
      toast({
        title: "IPFS Upload Successful",
        description: `Metadata uploaded to IPFS with hash: ${ipfsHash}`,
      });

      toast({
        title: "Creating Proposal...",
        description: "Please approve the transaction in your wallet.",
      });
      
      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

      const proposalInput = {
        title: values.title,
        ipfsMetadata: ipfsHash,
        targetCapital: targetCapitalInWei,
        votingDuration: BigInt(values.votingDuration),
        investmentDrivers: "",
        additionalCriteria: "",
        firmSize: 0,
        location: "",
        dealType: 0,
        geographicFocus: 0,
        paymentTerms: [],
        operationalStrategies: [],
        growthStrategies: [],
        integrationStrategies: []
      };

      const tx = await contract.createProposal(
        proposalInput,
        values.linkedInURL
      );

      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash}`,
      });

      const eventConfig = {
        provider,
        contractAddress: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        eventName: 'ProposalCreated'
      };

      toast({
        title: "Waiting for Confirmation...",
        description: "Waiting for the proposal to be created on the blockchain.",
      });
      const proposalEvent = await waitForProposalCreation(eventConfig, tx.hash);
      toast({
        title: "Proposal Created!",
        description: `Proposal created with token ID: ${proposalEvent.tokenId}`,
      });

      navigate(`/thesis/${proposalEvent.tokenId}`);

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
