import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { ProposalMetadata, ProposalConfig, ProposalContractInput } from "@/types/proposals";

export interface ContractStatus {
  submissionFee: ethers.BigNumber;
  isPaused: boolean;
  isTestMode: boolean;
  treasury: string;
  minTargetCapital: ethers.BigNumber;
  maxTargetCapital: ethers.BigNumber;
  minVotingDuration: number;
  maxVotingDuration: number;
  votingFee: ethers.BigNumber;
  lgrTokenAddress: string;
  owner: string;
  tester: string;
}

async function getProvider(wallet: NonNullable<DynamicContextType['primaryWallet']>) {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    return new ethers.providers.Web3Provider(walletClient as any);
  } catch (error) {
    console.error("Error getting provider:", error);
    throw new Error("Failed to initialize provider");
  }
}

export const getContractStatus = async (wallet: NonNullable<DynamicContextType['primaryWallet']>): Promise<ContractStatus> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

  try {
    const [
      submissionFee,
      isPaused,
      isTestMode,
      treasury,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration,
      maxVotingDuration,
      votingFee,
      lgrTokenAddress,
      owner,
      tester
    ] = await Promise.all([
      factory.submissionFee(),
      factory.paused(),
      factory.testModeEnabled(),
      factory.treasury(),
      factory.MIN_TARGET_CAPITAL(),
      factory.MAX_TARGET_CAPITAL(),
      factory.MIN_VOTING_DURATION(),
      factory.MAX_VOTING_DURATION(),
      factory.VOTING_FEE(),
      factory.LGR_TOKEN(),
      factory.owner(),
      factory.tester()
    ]);

    return {
      submissionFee,
      isPaused,
      isTestMode,
      treasury,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration: Number(minVotingDuration),
      maxVotingDuration: Number(maxVotingDuration),
      votingFee,
      lgrTokenAddress,
      owner,
      tester
    };
  } catch (error) {
    console.error("Error getting contract status:", error);
    throw new Error("Failed to get contract status");
  }
};

function validateProposalInput(input: ProposalContractInput) {
  // Title validation (10-100 chars)
  if (!input.title || input.title.length < 10 || input.title.length > 100) {
    throw new Error("Title must be between 10 and 100 characters");
  }

  // IPFS hash validation
  if (!input.ipfsMetadata || input.ipfsMetadata.length === 0) {
    throw new Error("IPFS metadata hash is required");
  }

  // Investment drivers validation (50-500 chars)
  if (!input.investmentDrivers || 
      input.investmentDrivers.length < 50 || 
      input.investmentDrivers.length > 500) {
    throw new Error("Investment drivers must be between 50 and 500 characters");
  }

  // Additional criteria validation (max 500 chars)
  if (input.additionalCriteria && input.additionalCriteria.length > 500) {
    throw new Error("Additional criteria must not exceed 500 characters");
  }

  // Array validations
  if (!input.paymentTerms.length) {
    throw new Error("At least one payment term is required");
  }
  if (!input.operationalStrategies.length) {
    throw new Error("At least one operational strategy is required");
  }
  if (!input.growthStrategies.length) {
    throw new Error("At least one growth strategy is required");
  }
  if (!input.integrationStrategies.length) {
    throw new Error("At least one integration strategy is required");
  }
}

function transformConfigToContractInput(config: ProposalConfig): ProposalContractInput {
  console.log("Transforming config to contract input:", config);
  
  const contractInput: ProposalContractInput = {
    title: config.metadata.title,
    ipfsMetadata: config.ipfsHash,
    targetCapital: config.targetCapital,
    votingDuration: config.votingDuration,
    investmentDrivers: config.metadata.investment.drivers,
    additionalCriteria: config.metadata.investment.additionalCriteria || "",
    firmSize: config.metadata.firmCriteria.size,
    location: config.metadata.firmCriteria.location,
    dealType: config.metadata.firmCriteria.dealType,
    geographicFocus: config.metadata.firmCriteria.geographicFocus,
    paymentTerms: config.metadata.paymentTerms,
    operationalStrategies: config.metadata.strategies.operational,
    growthStrategies: config.metadata.strategies.growth,
    integrationStrategies: config.metadata.strategies.integration
  };

  console.log("Transformed contract input:", contractInput);
  return contractInput;
}

export const createProposal = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  const contractInput = transformConfigToContractInput(config);
  validateProposalInput(contractInput);
  
  console.log("Creating proposal with contract input:", {
    ...contractInput,
    targetCapital: contractInput.targetCapital.toString(),
  });
  
  try {
    const gasEstimate = await factory.estimateGas.createProposal(contractInput, config.linkedInURL);
    console.log("Gas estimation successful:", gasEstimate.toString());
  } catch (error) {
    console.error("Gas estimation failed:", error);
    throw error;
  }
  
  return await executeTransaction(
    () => factory.createProposal(contractInput, config.linkedInURL),
    {
      type: 'nft',
      description: `Creating proposal with target capital ${ethers.utils.formatEther(config.targetCapital)} LGR`,
      timeout: 180000,
      maxRetries: 3,
      backoffMs: 5000,
      nftConfig: {
        tokenAddress: FACTORY_ADDRESS,
        amount: 1,
        standard: "ERC721",
        symbol: "LFP",
        name: "LedgerFren Proposal"
      }
    }
  );
};

export const setTestMode = async (
  enabled: boolean,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  const signerAddress = await provider.getSigner().getAddress();
  const status = await getContractStatus(wallet);
  
  // Check if signer is the tester address
  if (signerAddress.toLowerCase() !== status.tester.toLowerCase()) {
    throw new Error("Not authorized - must be the tester address");
  }

  console.log('Setting test mode with tester wallet:', {
    signerAddress,
    testerAddress: status.tester,
    enabled
  });

  return await executeTransaction(
    () => factory.setTestMode(enabled),
    {
      type: 'contract',
      description: `Setting test mode to ${enabled}`,
      timeout: 60000,
      maxRetries: 2,
      backoffMs: 3000
    }
  );
};

export const estimateProposalGas = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.BigNumber> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  const input = {
    title: config.metadata.title,
    ipfsMetadata: config.ipfsHash,
    targetCapital: config.targetCapital,
    votingDuration: config.votingDuration,
    investmentDrivers: config.metadata.investment.drivers,
    additionalCriteria: config.metadata.investment.additionalCriteria,
    firmSize: config.metadata.firmCriteria.size,
    location: config.metadata.firmCriteria.location,
    dealType: config.metadata.firmCriteria.dealType,
    geographicFocus: config.metadata.firmCriteria.geographicFocus,
    paymentTerms: config.metadata.paymentTerms,
    operationalStrategies: config.metadata.strategies.operational,
    growthStrategies: config.metadata.strategies.growth,
    integrationStrategies: config.metadata.strategies.integration
  };
  
  try {
    const gasEstimate = await factory.estimateGas.createProposal(input, config.linkedInURL);
    return gasEstimate.mul(120).div(100); // Add 20% buffer
  } catch (error) {
    console.error("Gas estimation error:", error);
    throw error;
  }
};
