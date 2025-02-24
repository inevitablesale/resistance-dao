import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { File, DollarSign, Users, MessageSquare, Timer, HelpCircle } from "lucide-react";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput, convertToWei } from "@/components/thesis/TargetCapitalInput";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { uploadToIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";
import { useToast } from "@/hooks/use-toast";
import { waitForProposalCreation } from "@/services/eventListenerService";
import { mainnet, polygon, polygonMumbai } from 'viem/chains';
import { ethers } from 'ethers';

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

export default function ThesisSubmission() {
  const { toast } = useToast();
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

      // Convert targetCapital to Wei
      const targetCapitalInWei = convertToWei(values.investment.targetCapital);

      // Prepare metadata for IPFS upload
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

      // Upload metadata to IPFS
      toast({
        title: "Uploading to IPFS...",
        description: "Please wait while we upload your proposal metadata to IPFS.",
      });
      const ipfsHash = await uploadToIPFS<ProposalMetadata>(metadata);
      toast({
        title: "IPFS Upload Successful",
        description: `Metadata uploaded to IPFS with hash: ${ipfsHash}`,
      });

      // Contract interaction parameters
      const chainId = await walletClient.chainId;
      const isTestMode = chainId !== mainnet.id && chainId !== polygon.id;
      const chain = isTestMode ? polygonMumbai : polygon;
      const contractAddress = isTestMode ? process.env.NEXT_PUBLIC_POLYGON_MUMBAI_CONTRACT_ADDRESS : process.env.NEXT_PUBLIC_POLYGON_MAINNET_CONTRACT_ADDRESS;
      const abi = JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI || '[]');

      if (!contractAddress) {
        throw new Error("Contract address is not available");
      }

      // Call the createProposal function
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

      // Setup event listener configuration
      const eventConfig = {
        provider,
        contractAddress,
        abi,
        eventName: 'ProposalCreated'
      };

      // Wait for the proposal creation event
      toast({
        title: "Waiting for Confirmation...",
        description: "Waiting for the proposal to be created on the blockchain.",
      });
      const proposalEvent = await waitForProposalCreation(eventConfig, tx.hash);
      toast({
        title: "Proposal Created!",
        description: `Proposal created with token ID: ${proposalEvent.tokenId}`,
      });

      // Redirect to the proposal details page
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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Project Overview Section */}
            <div className="bg-[#111111] rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium">
                <File className="w-5 h-5" />
                <span>Project Overview</span>
              </div>
              <div className="grid gap-6">
                <div>
                  <Label className="text-sm text-gray-400">Title</Label>
                  <Input
                    {...form.register("title")}
                    placeholder="Enter your project title"
                    className="mt-1 bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Category</Label>
                  <Input
                    {...form.register("category")}
                    placeholder="e.g., DeFi, NFT, Gaming"
                    className="mt-1 bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Description</Label>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Describe your project's vision and goals..."
                    className="mt-1 bg-black/50 border-white/10 text-white placeholder:text-gray-600 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Investment Details Section */}
            <div className="bg-[#111111] rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium">
                <DollarSign className="w-5 h-5" />
                <span>Investment Details</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm text-gray-400">Target Capital</Label>
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                  </div>
                  <TargetCapitalInput
                    value={form.watch("investment.targetCapital")}
                    onChange={(value) => form.setValue("investment.targetCapital", value)}
                    error={form.formState.errors.investment?.targetCapital ? [form.formState.errors.investment.targetCapital.message || ""] : undefined}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Smart Contract Development"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Amount in RD"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Security Audit"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Amount in RD"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Marketing & Community"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Amount in RD"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Operations & Legal"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Amount in RD"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5" />
                    <Label className="text-sm text-gray-400">Voting Duration</Label>
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                  </div>
                  <VotingDurationInput
                    value={form.watch("votingDuration")}
                    onChange={(value) => form.setValue("votingDuration", value[0])}
                    error={form.formState.errors.votingDuration ? [form.formState.errors.votingDuration.message || ""] : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Investment Drivers & Incentives */}
            <div className="bg-[#111111] rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Users className="w-5 h-5" />
                <span>Investment Drivers & Incentives</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm text-gray-400">Investment Drivers</Label>
                  <Input
                    placeholder="Key driver #1"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                  <Input
                    placeholder="Key driver #2"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                  <Input
                    placeholder="Key driver #3"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                  <Input
                    placeholder="Key driver #4"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-sm text-gray-400">Backer Incentives</Label>
                  <Input
                    placeholder="Utility (e.g., Early access)"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                  <Input
                    placeholder="Governance rights"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                  <Input
                    placeholder="NFT rewards"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                  <Input
                    placeholder="Token allocation"
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Team & Roadmap */}
            <div className="bg-[#111111] rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Users className="w-5 h-5" />
                <span>Team & Roadmap</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm text-gray-400">Team Members</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Team member 1 name"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Role"
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                      />
                      <Input
                        placeholder="LinkedIn URL"
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Team member 2 name"
                      className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Role"
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                      />
                      <Input
                        placeholder="LinkedIn URL"
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm text-gray-400">Roadmap Milestones</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Milestone 1"
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          placeholder="Expected Date (Q2 2025)"
                          className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                        />
                        <Button variant="outline" className="border-white/10 text-white">
                          Pending
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Milestone 2"
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          placeholder="Expected Date (Q2 2025)"
                          className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                        />
                        <Button variant="outline" className="border-white/10 text-white">
                          Pending
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#111111] rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-2 text-lg font-medium">
                <MessageSquare className="w-5 h-5" />
                <span>Social Links</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Twitter URL"
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                />
                <Input
                  placeholder="Discord URL"
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                />
                <Input
                  placeholder="Telegram URL"
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-[#0a1020] rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-1">ℹ️</div>
                <p className="text-sm text-gray-400">
                  Your proposal will be minted as an NFT, representing a binding smart contract. A fee of 25 RD tokens is required to submit.
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5] text-white py-6 text-lg font-medium"
            >
              {isSubmitting ? "Submitting..." : "Launch Proposal →"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
