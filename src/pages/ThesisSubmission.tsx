import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput } from "@/components/thesis/TargetCapitalInput";
import { 
  ArrowRight, Loader2, Rocket, Target, Clock, FileText, Users, Info, ChevronRight,
  Workflow, Coins, Gift, Trophy, Github, Linkedin, Twitter, MessageCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { createProposal } from "@/services/proposalContractService";
import { ProposalMetadata, TeamMember, RoadmapMilestone, FundingBreakdown } from "@/types/proposals";
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
import { motion } from "framer-motion";

const thesisFormSchema = z.object({
  title: z.string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .min(50, "Description must be at least 50 characters")
    .max(500, "Description must be less than 500 characters"),
  category: z.string()
    .min(3, "Category must be at least 3 characters")
    .max(50, "Category must be less than 50 characters"),
  investment: z.object({
    targetCapital: z.string()
      .min(1, "Target capital is required")
      .refine(
        (val) => {
          const num = parseFloat(val);
          return num >= 1000 && num <= 25000000;
        },
        "Target capital must be between 1,000 and 25,000,000 RD"
      ),
    description: z.string()
      .min(50, "Description must be at least 50 characters")
      .max(500, "Description must be less than 500 characters"),
  }),
  votingDuration: z.number()
    .min(7 * 24 * 60 * 60, "Minimum voting duration is 7 days")
    .max(90 * 24 * 60 * 60, "Maximum voting duration is 90 days"),
  linkedInURL: z.string()
    .min(1, "LinkedIn URL is required")
    .max(200, "LinkedIn URL must be less than 200 characters"),
  blockchain: z.array(z.string()).optional(),
  fundingBreakdown: z.array(
    z.object({
      category: z.string(),
      amount: z.string(),
    })
  ).optional(),
  investmentDrivers: z.array(z.string()).optional(),
  backerIncentives: z.object({
    utility: z.string(),
    governance: z.string(),
    NFTRewards: z.string(),
    tokenAllocation: z.string(),
  }).optional(),
  team: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    })
  ).optional(),
  roadmap: z.array(
    z.object({
      milestone: z.string(),
      expectedDate: z.string(),
      status: z.enum(["Pending", "In Progress", "Completed"]),
    })
  ).optional(),
  socials: z.object({
    twitter: z.string().optional(),
    discord: z.string().optional(),
    telegram: z.string().optional(),
  }).optional(),
});

const ThesisSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, wallet } = useWalletConnection();
  const { user } = useDynamicContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProposalMetadata>({
    resolver: zodResolver(thesisFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      investment: {
        targetCapital: "",
        description: ""
      },
      votingDuration: 7 * 24 * 60 * 60,
      linkedInURL: user?.verifications?.customFields?.["LinkedIn Profile URL"] || 
                  user?.metadata?.["LinkedIn Profile URL"] || "",
      blockchain: [],
      fundingBreakdown: [],
      investmentDrivers: [],
      backerIncentives: {
        utility: "",
        governance: "",
        NFTRewards: "",
        tokenAllocation: "",
      },
      team: [],
      roadmap: [],
      socials: {
        twitter: "",
        discord: "",
        telegram: "",
      },
    }
  });

  const onSubmit = async (data: ProposalMetadata) => {
    if (!isConnected || !wallet) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to submit a thesis",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createProposal(data, wallet);
      
      toast({
        title: "Success",
        description: "Your thesis has been submitted successfully",
      });
      navigate("/proposals");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit thesis",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-yellow-500/5 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -top-48 -left-24" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -bottom-48 -right-24" />
      </div>

      {/* Stats Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div>
                <div className="text-white/50">Active Proposals</div>
                <div className="font-mono text-white">24</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <div>
                <div className="text-white/50">Total Commitments</div>
                <div className="font-mono text-white">$2.5M</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <div>
                <div className="text-white/50">Success Rate</div>
                <div className="font-mono text-white">89%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Breadcrumb */}
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
              <BreadcrumbPage className="text-white">Submit Proposal</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4 font-mono">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Launch Your Investment Strategy
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-mono mb-6 bg-gradient-to-r from-blue-300 via-purple-200 to-yellow-300 bg-clip-text text-transparent">
              Submit Your Proposal
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Present your investment strategy to find co-investors who share your vision. Test market interest before committing resources.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Project Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/5 border-white/10 p-6 backdrop-blur-lg">
                <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Project Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/80 mb-2 block">Title</label>
                      <Input
                        {...form.register("title")}
                        placeholder="Enter your project title"
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white/80 mb-2 block">Category</label>
                      <Input
                        {...form.register("category")}
                        placeholder="e.g., DeFi, NFT, Gaming"
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/80 mb-2 block">Description</label>
                    <Textarea
                      {...form.register("investment.description")}
                      placeholder="Describe your project's vision and goals..."
                      className="bg-black/20 border-white/10 text-white min-h-[132px]"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Investment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/5 border-white/10 p-6 backdrop-blur-lg">
                <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-purple-400" />
                  Investment Details
                </h2>
                <div className="space-y-6">
                  <TargetCapitalInput
                    value={form.watch("investment.targetCapital")}
                    onChange={(value) => form.setValue("investment.targetCapital", value, { shouldValidate: true })}
                    error={form.formState.errors.investment?.targetCapital?.message?.split(",")}
                  />

                  <div className="space-y-4">
                    <label className="text-white/80 block">Funding Breakdown</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Smart Contract Development",
                        "Security Audit",
                        "Marketing & Community",
                        "Operations & Legal"
                      ].map((category, index) => (
                        <div key={index} className="flex gap-3">
                          <Input
                            placeholder={category}
                            className="bg-black/20 border-white/10 text-white"
                          />
                          <Input
                            placeholder="Amount in RD"
                            type="number"
                            className="bg-black/20 border-white/10 text-white w-32"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <VotingDurationInput
                    value={form.watch("votingDuration")}
                    onChange={(value) => form.setValue("votingDuration", value[0], { shouldValidate: true })}
                    error={form.formState.errors.votingDuration?.message?.split(",")}
                  />
                </div>
              </Card>
            </motion.div>

            {/* Investment Drivers & Incentives */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white/5 border-white/10 p-6 backdrop-blur-lg">
                <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Investment Drivers & Incentives
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-white/80 block">Investment Drivers</label>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((index) => (
                        <Input
                          key={index}
                          placeholder={`Key driver #${index}`}
                          className="bg-black/20 border-white/10 text-white"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-white/80 block">Backer Incentives</label>
                    <div className="space-y-3">
                      <Input
                        placeholder="Utility (e.g., Early access)"
                        className="bg-black/20 border-white/10 text-white"
                      />
                      <Input
                        placeholder="Governance rights"
                        className="bg-black/20 border-white/10 text-white"
                      />
                      <Input
                        placeholder="NFT rewards"
                        className="bg-black/20 border-white/10 text-white"
                      />
                      <Input
                        placeholder="Token allocation"
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Team & Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-white/5 border-white/10 p-6 backdrop-blur-lg">
                <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Team & Roadmap
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-white/80 block">Team Members</label>
                    <div className="space-y-4">
                      {[1, 2].map((index) => (
                        <div key={index} className="space-y-3">
                          <Input
                            placeholder={`Team member ${index} name`}
                            className="bg-black/20 border-white/10 text-white"
                          />
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Input
                                placeholder="Role"
                                className="bg-black/20 border-white/10 text-white"
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                placeholder="LinkedIn URL"
                                className="bg-black/20 border-white/10 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-white/80 block">Roadmap Milestones</label>
                    <div className="space-y-4">
                      {[1, 2].map((index) => (
                        <div key={index} className="space-y-3">
                          <Input
                            placeholder={`Milestone ${index}`}
                            className="bg-black/20 border-white/10 text-white"
                          />
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Input
                                type="text"
                                placeholder="Expected Date (Q2 2025)"
                                className="bg-black/20 border-white/10 text-white"
                              />
                            </div>
                            <div className="flex-1">
                              <select 
                                className="w-full bg-black/20 border-white/10 text-white rounded-md h-10 px-3"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-white/5 border-white/10 p-6 backdrop-blur-lg">
                <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  Social Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <Input
                      placeholder="Twitter URL"
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                    <Input
                      placeholder="Discord URL"
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <Input
                      placeholder="Telegram URL"
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Submit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col gap-4"
            >
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Before You Submit</h3>
                    <p className="text-sm text-white/60">
                      Your proposal will be minted as an NFT, representing a binding smart contract. 
                      A fee of 25 RD tokens is required to submit.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting || !form.formState.isValid || !isConnected}
                className={cn(
                  "w-full h-14",
                  "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
                  "text-white font-medium text-lg",
                  "transition-all duration-300 transform hover:scale-[1.02]",
                  "disabled:opacity-50 disabled:hover:scale-100",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5" />
                    <span>Launch Proposal</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      <ResistanceWalletWidget />
    </div>
  );
};

export default ThesisSubmission;
