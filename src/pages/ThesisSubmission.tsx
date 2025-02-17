import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { uploadMetadataToPinata } from "@/services/pinataService";
import { analyzeLinkedInProfile } from "@/services/linkedinService";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { ethers } from "ethers";
import { gasOptimizer } from "@/services/gasOptimizationService";
import { ProposalError } from "@/services/errorHandlingService";
import {
  createProposal,
  setTestMode as setTestModeContract,
  PROPOSAL_CONTRACT_ADDRESS,
  PROPOSAL_CONTRACT_ABI
} from "@/services/proposalContractService";

const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
const AUTHORIZED_TEST_MODE_ADDRESS = "0x949F010a94c06ea989C01813041b880c77642497";

const ThesisSubmission = () => {
  const { toast } = useToast();
  const { isConnected, address, connect, approveLGR, wallet } = useWalletConnection();
  const { tokenBalances } = useTokenBalances({
    networkId: 137,
    accountAddress: address,
    includeFiat: false,
    includeNativeBalance: false,
    tokenAddresses: [LGR_TOKEN_ADDRESS]
  });

  const [isTestMode, setIsTestMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);
  const [metadataUri, setMetadataUri] = useState<string | null>(null);

  const handleTestModeToggle = async (enabled: boolean) => {
    if (!isConnected || !wallet) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to toggle test mode",
        variant: "destructive"
      });
      connect();
      return;
    }

    try {
      setIsTestMode(enabled);
      await setTestMode(enabled, wallet);
      toast({
        title: `Test Mode ${enabled ? 'Enabled' : 'Disabled'}`,
        description: `Successfully ${enabled ? 'enabled' : 'disabled'} test mode`,
      });
    } catch (error: any) {
      setIsTestMode(!enabled); // Revert the state on error
      toast({
        title: "Test Mode Error",
        description: error.message || "Failed to toggle test mode",
        variant: "destructive"
      });
    }
  };

  const handleLinkedInAnalysis = async () => {
    try {
      setIsSubmitting(true);
      toast({
        title: "Analyzing Profile",
        description: "Analyzing your LinkedIn profile to generate governance power",
      });

      const metadata = await analyzeLinkedInProfile(linkedinProfileUrl);
      const pinataUri = await uploadMetadataToPinata(metadata);

      setMetadataUri(pinataUri);
      toast({
        title: "Profile Analyzed",
        description: "Successfully analyzed your LinkedIn profile",
      });
    } catch (error: any) {
      console.error("Error analyzing LinkedIn profile:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze LinkedIn profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProposal = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to create a proposal",
        variant: "destructive",
      });
      return;
    }

    if (!metadataUri) {
      toast({
        title: "Analyze Profile",
        description: "Please analyze your LinkedIn profile first",
        variant: "destructive",
      });
      return;
    }

    if (!proposalTitle || !proposalDescription) {
      toast({
        title: "Missing Fields",
        description: "Please fill out the proposal title and description",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      toast({
        title: "Creating Proposal",
        description: "Creating your proposal, this may take a few minutes",
      });

      // Convert LGR amount to wei
      const amountInWei = ethers.utils.parseUnits("100", 18);

      // Check LGR balance
      const lgrBalance = tokenBalances?.[LGR_TOKEN_ADDRESS]?.balance;
      if (!lgrBalance || lgrBalance.lt(amountInWei)) {
        throw new ProposalError({
          category: 'token',
          message: 'Insufficient LGR balance',
          recoverySteps: ['Please ensure you have enough LGR tokens to create a proposal']
        });
      }

      // Approve LGR tokens
      toast({
        title: "Approving LGR",
        description: "Approving LGR tokens for proposal creation",
      });
      const approvalTransaction = await approveLGR(amountInWei.toString(), isTestMode);
      await approvalTransaction.wait();

      // Estimate gas
      toast({
        title: "Estimating Gas",
        description: "Estimating gas for proposal creation",
      });
      const proposalData = {
        title: proposalTitle,
        description: proposalDescription,
        metadataUri: metadataUri,
        lgrAmount: amountInWei,
        isTest: isTestMode
      };
      const gasEstimate = await estimateGas(proposalData);

      // Create proposal
      toast({
        title: "Creating Proposal",
        description: "Creating your proposal, this may take a few minutes",
      });
      const transaction = await createProposal(proposalData, gasEstimate);
      await transaction.wait();

      toast({
        title: "Proposal Created",
        description: "Successfully created your proposal",
      });
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Proposal Failed",
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimateGas = async (proposalData: any): Promise<ethers.BigNumber> => {
    try {
      const provider = new ethers.providers.Web3Provider(wallet!.provider);
      const signer = provider.getSigner();
      const proposalContract = new ethers.Contract(
        PROPOSAL_CONTRACT_ADDRESS,
        PROPOSAL_CONTRACT_ABI,
        signer
      );

      const gasEstimate = await proposalContract.estimateGas.create(
        proposalData.title,
        proposalData.description,
        proposalData.metadataUri,
        proposalData.lgrAmount,
        proposalData.isTest
      );

      const optimizedGasLimit = await gasOptimizer.optimizeGasLimit(gasEstimate);
      setEstimatedGas(optimizedGasLimit.toString());
      return optimizedGasLimit;
    } catch (error: any) {
      console.error("Gas estimation error:", error);
      toast({
        title: "Gas Estimation Error",
        description: error.message || "Failed to estimate gas",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-3xl md:text-4xl font-bold text-white"
              >
                Transform Accounting Firm Ownership
              </motion.h1>
              
              {address?.toLowerCase() === AUTHORIZED_TEST_MODE_ADDRESS.toLowerCase() && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="test-mode" className="text-sm text-white/60">
                    Test Mode
                  </Label>
                  <Switch
                    id="test-mode"
                    checked={isTestMode}
                    onCheckedChange={handleTestModeToggle}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>
              )}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-400 mb-8">
                Submit your thesis and transform accounting firm ownership.
              </p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="linkedin-url" className="block text-sm font-medium text-white">
                    LinkedIn Profile URL
                  </Label>
                  <Input
                    type="url"
                    id="linkedin-url"
                    className="mt-1 block w-full bg-black/20 border-white/10 text-white"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={linkedinProfileUrl}
                    onChange={(e) => setLinkedinProfileUrl(e.target.value)}
                  />
                  <Button 
                    onClick={handleLinkedInAnalysis}
                    disabled={isSubmitting}
                    className="mt-4 w-full bg-yellow-500 text-black hover:bg-yellow-400"
                  >
                    {isSubmitting ? "Analyzing..." : "Analyze Profile"}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="proposal-title" className="block text-sm font-medium text-white">
                    Proposal Title
                  </Label>
                  <Input
                    type="text"
                    id="proposal-title"
                    className="mt-1 block w-full bg-black/20 border-white/10 text-white"
                    placeholder="Proposal to Acquire XYZ Accounting Firm"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="proposal-description" className="block text-sm font-medium text-white">
                    Proposal Description
                  </Label>
                  <Input
                    type="text"
                    id="proposal-description"
                    className="mt-1 block w-full bg-black/20 border-white/10 text-white"
                    placeholder="Details about the proposed acquisition"
                    value={proposalDescription}
                    onChange={(e) => setProposalDescription(e.target.value)}
                  />
                </div>

                <div>
                  <Button 
                    onClick={handleCreateProposal}
                    disabled={isSubmitting || !isConnected || !metadataUri}
                    className="w-full bg-polygon-primary text-white hover:bg-polygon-secondary"
                  >
                    {isSubmitting ? "Submitting..." : "Create Proposal"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="bg-black/30 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Wallet Information
              </h3>
              <p className="text-gray-400 mb-2">
                Status: {isConnected ? "Connected" : "Disconnected"}
              </p>
              <p className="text-gray-400 mb-2">
                Address: {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "Not Connected"}
              </p>
              <p className="text-gray-400 mb-4">
                LGR Balance: {tokenBalances?.[LGR_TOKEN_ADDRESS]?.formatted || "0"}
              </p>
              {!isConnected && (
                <Button onClick={connect} className="w-full bg-polygon-primary text-white hover:bg-polygon-secondary">
                  Connect Wallet
                </Button>
              )}
              {estimatedGas && (
                <p className="text-gray-400 mt-4">
                  Estimated Gas: {estimatedGas}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
