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
  investment: z.object({
    targetCapital: z.string().min(1, {
      message: "Target capital is required."
    }),
    description: z.string().min(10, {
      message: "Investment description must be at least 10 characters.",
    }),
  }),
  votingDuration: z.number().min(7 * 24 * 60 * 60, {
    message: "Voting duration must be at least 7 days.",
  }),
  linkedInURL: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
  blockchain: z.string().array().nonempty({
    message: "Please select at least one blockchain.",
  }),
});

const requiredFormData = {
  title: "Decentralized Identity Protocol",
  description: "A protocol for self-sovereign identity management using zero-knowledge proofs",
  category: "Identity & Privacy",
  investment: {
    targetCapital: "500000",
    description: "Funding for protocol development and security audits",
  },
  votingDuration: 14 * 24 * 60 * 60, // 14 days
  linkedInURL: "https://linkedin.com/in/example",
  blockchain: ["Ethereum", "Polygon"],
};

const completeFormData = {
  ...requiredFormData,
  team: [
    {
      name: "Alice Johnson",
      role: "Lead Developer",
      linkedin: "https://linkedin.com/in/alice",
    },
    {
      name: "Bob Smith",
      role: "Security Architect",
      linkedin: "https://linkedin.com/in/bob",
    }
  ],
  investmentDrivers: [
    "First-mover advantage in zkID space",
    "Strong network effects",
    "Enterprise partnerships",
    "Patent-pending technology"
  ],
  backerIncentives: {
    utility: "Early access to enterprise features",
    governance: "Protocol governance rights",
    NFTRewards: "Founding member NFT badge",
    tokenAllocation: "2% of token supply"
  },
  socials: {
    twitter: "https://twitter.com/zkidproject",
    discord: "https://discord.gg/zkid",
    telegram: "https://t.me/zkidproject"
  },
  roadmap: [
    {
      milestone: "MVP Launch",
      expectedDate: "Q2 2024",
      status: "Pending"
    },
    {
      milestone: "Mainnet Launch",
      expectedDate: "Q4 2024",
      status: "Pending"
    }
  ]
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
      investment: {
        targetCapital: "",
        description: "",
      },
      votingDuration: 7 * 24 * 60 * 60, // 7 days default
      linkedInURL: "",
      blockchain: [],
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

      const chainId = await walletClient.chainId;
      const isTestMode = chainId !== mainnet.id && chainId !== polygon.id;
      const chain = isTestMode ? polygonMumbai : polygon;
      const contractAddress = isTestMode ? process.env.NEXT_PUBLIC_POLYGON_MUMBAI_CONTRACT_ADDRESS : process.env.NEXT_PUBLIC_POLYGON_MAINNET_CONTRACT_ADDRESS;
      const abi = JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI || '[]');

      if (!contractAddress) {
        throw new Error("Contract address is not available");
      }

      toast({
        title: "Creating Proposal...",
        description: "Please approve the transaction in your wallet.",
      });
      
      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.createProposal(
        values.title,
        ipfsHash,
        targetCapitalInWei,
        BigInt(values.votingDuration)
      );

      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash}`,
      });

      const eventConfig = {
        provider,
        contractAddress,
        abi,
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Smart Contract Development" className="bg-black/50 border-white/10" />
                    <Input placeholder="Amount in RD" className="bg-black/50 border-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Security Audit" className="bg-black/50 border-white/10" />
                    <Input placeholder="Amount in RD" className="bg-black/50 border-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Marketing & Community" className="bg-black/50 border-white/10" />
                    <Input placeholder="Amount in RD" className="bg-black/50 border-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Operations & Legal" className="bg-black/50 border-white/10" />
                    <Input placeholder="Amount in RD" className="bg-black/50 border-white/10" />
                  </div>
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
                  <h2 className="text-lg font-medium">Investment Drivers & Incentives</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Investment Drivers</Label>
                    <Input placeholder="Key driver #1" className="bg-black/50 border-white/10" />
                    <Input placeholder="Key driver #2" className="bg-black/50 border-white/10" />
                    <Input placeholder="Key driver #3" className="bg-black/50 border-white/10" />
                    <Input placeholder="Key driver #4" className="bg-black/50 border-white/10" />
                  </div>
                  <div className="space-y-4">
                    <Label>Backer Incentives</Label>
                    <Input placeholder="Utility (e.g., Early access)" className="bg-black/50 border-white/10" />
                    <Input placeholder="Governance rights" className="bg-black/50 border-white/10" />
                    <Input placeholder="NFT rewards" className="bg-black/50 border-white/10" />
                    <Input placeholder="Token allocation" className="bg-black/50 border-white/10" />
                  </div>
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
                      <div>
                        <Input placeholder="Team member 1 name" className="bg-black/50 border-white/10 mb-2" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Role" className="bg-black/50 border-white/10" />
                          <Input placeholder="LinkedIn URL" className="bg-black/50 border-white/10" />
                        </div>
                      </div>
                      <div>
                        <Input placeholder="Team member 2 name" className="bg-black/50 border-white/10 mb-2" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Role" className="bg-black/50 border-white/10" />
                          <Input placeholder="LinkedIn URL" className="bg-black/50 border-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Roadmap Milestones</Label>
                    <div className="space-y-4">
                      <div>
                        <Input placeholder="Milestone 1" className="bg-black/50 border-white/10 mb-2" />
                        <div className="flex gap-2">
                          <Input placeholder="Expected Date (Q2 2025)" className="bg-black/50 border-white/10" />
                          <Button variant="outline" size="sm" className="shrink-0">
                            Pending
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Input placeholder="Milestone 2" className="bg-black/50 border-white/10 mb-2" />
                        <div className="flex gap-2">
                          <Input placeholder="Expected Date (Q2 2025)" className="bg-black/50 border-white/10" />
                          <Button variant="outline" size="sm" className="shrink-0">
                            Pending
                          </Button>
                        </div>
                      </div>
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
                  <Input placeholder="Twitter URL" className="bg-black/50 border-white/10" />
                  <Input placeholder="Discord URL" className="bg-black/50 border-white/10" />
                  <Input placeholder="Telegram URL" className="bg-black/50 border-white/10" />
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
    </div>
  );
}
