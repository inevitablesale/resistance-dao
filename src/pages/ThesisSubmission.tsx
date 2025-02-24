import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { HelpCircle } from "lucide-react";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput, convertToWei } from "@/components/thesis/TargetCapitalInput";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { uploadToIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";
import { useToast } from "@/hooks/use-toast";
import { waitForProposalCreation } from "@/services/eventListenerService";
import { sepolia, mainnet, polygonMumbai, polygon } from 'viem/chains';

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

const sampleFormData = {
  title: "Revolutionizing Small Business Accounting with Blockchain",
  description: "Implementing a decentralized accounting system that leverages blockchain technology to provide transparent, immutable, and efficient financial tracking for small businesses.",
  category: "DeFi Infrastructure",
  investment: {
    targetCapital: "1000000",
    description: "The funds will be used to develop the core infrastructure, build user interfaces, conduct security audits, and launch marketing campaigns to drive adoption.",
  },
  votingDuration: 30 * 24 * 60 * 60, // 30 days in seconds
  linkedInURL: "https://linkedin.com/in/sample-profile",
  blockchain: ["Ethereum", "Polygon"],
  fundingBreakdown: [
    { category: "Development", amount: "400000" },
    { category: "Security Audits", amount: "200000" },
    { category: "Marketing", amount: "200000" },
    { category: "Operations", amount: "200000" }
  ],
  investmentDrivers: [
    "Market Demand",
    "Technological Innovation",
    "Scalability"
  ],
  backerIncentives: {
    utility: "Access to premium features",
    governance: "Voting rights on protocol upgrades",
    NFTRewards: "Exclusive NFT collection for early backers",
    tokenAllocation: "5% of total token supply"
  },
  team: [
    {
      name: "Jane Smith",
      role: "Lead Developer",
      linkedin: "https://linkedin.com/in/jane-smith",
      github: "https://github.com/janesmith"
    }
  ],
  roadmap: [
    {
      milestone: "MVP Launch",
      expectedDate: "2024-06-30",
      status: "Pending"
    },
    {
      milestone: "Security Audit",
      expectedDate: "2024-08-30",
      status: "Pending"
    }
  ],
  socials: {
    twitter: "https://twitter.com/sample",
    discord: "https://discord.gg/sample",
    telegram: "https://t.me/sample"
  }
};

export default function ThesisSubmission() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { wallet, user, isConnected } = useWalletConnection();
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
      votingDuration: 30 * 24 * 60 * 60, // 30 days default
      linkedInURL: "",
      blockchain: [],
    }
  });

  const fillFormWithSampleData = () => {
    form.reset(sampleFormData);
    toast({
      title: "Form Filled",
      description: "Sample data has been loaded into the form.",
    });
  };

  async function onSubmit(values: z.infer<typeof thesisFormSchema>) {
    setIsSubmitting(true);
    try {
      if (!wallet) {
        throw new Error("Wallet is not available");
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
      const chainId = await wallet.getChainId();
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
      const { request } = await wallet.simulateContract({
        address: contractAddress as `0x${string}`,
        abi: abi,
        functionName: 'createProposal',
        args: [
          values.title,
          ipfsHash,
          targetCapitalInWei,
          BigInt(values.votingDuration)
        ],
        chainId: chain.id,
      });
      const txHash = await wallet.writeContract(request);
      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${txHash}`,
      });

      // Setup event listener configuration
      const provider = wallet.getProvider();
      const eventConfig = {
        provider: provider,
        contractAddress: contractAddress,
        abi: abi,
        eventName: 'ProposalCreated'
      };

      // Wait for the proposal creation event
      toast({
        title: "Waiting for Confirmation...",
        description: "Waiting for the proposal to be created on the blockchain.",
      });
      const proposalEvent = await waitForProposalCreation(eventConfig, txHash);
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
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-4 pt-24">
        {/* Breadcrumb section */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Submit Thesis</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-4xl mx-auto">
          {/* Header section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Submit Your Thesis</h1>
              <p className="text-gray-400">Create a proposal for the community to review and back.</p>
            </div>
            <Button
              onClick={fillFormWithSampleData}
              variant="outline"
              className="border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-500"
            >
              Fill Sample Data
            </Button>
          </div>

          {/* Form section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Thesis Information</CardTitle>
                  <CardDescription>Enter the basic details of your thesis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-lg font-medium text-white flex items-center gap-2">
                            Thesis Title
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="e.g., Decentralized Accounting for Small Businesses"
                            className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-lg font-medium text-white flex items-center gap-2">
                            Thesis Description
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Explain your thesis in detail"
                            className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-lg font-medium text-white flex items-center gap-2">
                            Category
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="e.g., DeFi, Infrastructure, Tooling"
                            className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Investment Details</CardTitle>
                  <CardDescription>Provide details about the investment opportunity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="investment.targetCapital"
                    render={({ field }) => (
                      <FormItem>
                        <TargetCapitalInput
                          value={field.value}
                          onChange={field.onChange}
                          error={form.formState.errors.investment?.targetCapital ? [form.formState.errors.investment.targetCapital.message || ""] : undefined}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="investment.description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-lg font-medium text-white flex items-center gap-2">
                            Investment Description
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Explain how the funds will be used"
                            className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Voting Duration</CardTitle>
                  <CardDescription>Set the duration for community voting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="votingDuration"
                    render={({ field }) => (
                      <FormItem>
                        <VotingDurationInput
                          value={field.value}
                          onChange={(value) => field.onChange(value[0])}
                          error={form.formState.errors.votingDuration ? [form.formState.errors.votingDuration.message || ""] : undefined}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Additional Information</CardTitle>
                  <CardDescription>Provide additional details for the proposal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="linkedInURL"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-lg font-medium text-white flex items-center gap-2">
                            LinkedIn URL
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="e.g., linkedin.com/in/yourprofile"
                            className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="blockchain"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4 flex items-center justify-between">
                          <FormLabel className="text-lg font-medium text-white flex items-center gap-2">
                            Supported Blockchains
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </FormLabel>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="ethereum"
                              checked={field.value.includes("Ethereum")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, "Ethereum"]);
                                } else {
                                  field.onChange(field.value.filter((v) => v !== "Ethereum"));
                                }
                              }}
                            />
                            <Label htmlFor="ethereum" className="text-white">Ethereum</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="polygon"
                              checked={field.value.includes("Polygon")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, "Polygon"]);
                                } else {
                                  field.onChange(field.value.filter((v) => v !== "Polygon"));
                                }
                              }}
                            />
                            <Label htmlFor="polygon" className="text-white">Polygon</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="solana"
                              checked={field.value.includes("Solana")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, "Solana"]);
                                } else {
                                  field.onChange(field.value.filter((v) => v !== "Solana"));
                                }
                              }}
                            />
                            <Label htmlFor="solana" className="text-white">Solana</Label>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button disabled={isSubmitting} type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                {isSubmitting ? "Submitting..." : "Submit Thesis"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
