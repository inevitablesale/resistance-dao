
import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { ProposalMetadata, ProposalConfig, ValidationResult } from "@/types/proposals";

export interface ContractStatus {
  submissionFee: ethers.BigNumber;
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

export const createProposal = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  // First validate all input parameters
  const validation = validateContractParameters(
    { targetCapital: config.targetCapital, votingDuration: config.votingDuration },
    await getContractStatus(wallet)
  );

  if (!validation.isValid) {
    throw new Error(`Invalid parameters: ${Object.values(validation.errors).flat().join(", ")}`);
  }

  // Structure the input according to the contract's expectations
  const input = {
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
    paymentTerms: config.metadata.paymentTerms.map(term => Number(term)),
    operationalStrategies: config.metadata.strategies.operational.map(s => Number(s)),
    growthStrategies: config.metadata.strategies.growth.map(s => Number(s)),
    integrationStrategies: config.metadata.strategies.integration.map(s => Number(s))
  };

  console.log("Creating proposal with input:", {
    ...input,
    targetCapital: input.targetCapital.toString(),
  });
  
  return await executeTransaction(
    () => factory.createProposal(input, config.linkedInURL),
    {
      type: 'nft',
      description: `Creating proposal: ${input.title}`,
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

export const validateContractParameters = (
  config: { targetCapital: ethers.BigNumber; votingDuration: number },
  status: ContractStatus
): ValidationResult => {
  const errors: Record<string, string[]> = {};
  
  if (!config.targetCapital) {
    errors.targetCapital = ['Target capital is required'];
  } else {
    if (config.targetCapital.lt(status.minTargetCapital)) {
      errors.targetCapital = [`Target capital must be at least ${ethers.utils.formatEther(status.minTargetCapital)} LGR`];
    }
    if (config.targetCapital.gt(status.maxTargetCapital)) {
      errors.targetCapital = [`Target capital must not exceed ${ethers.utils.formatEther(status.maxTargetCapital)} LGR`];
    }
  }

  if (!config.votingDuration) {
    errors.votingDuration = ['Voting duration is required'];
  } else {
    if (config.votingDuration < status.minVotingDuration) {
      errors.votingDuration = [`Voting duration must be at least ${status.minVotingDuration / (24 * 60 * 60)} days`];
    }
    if (config.votingDuration > status.maxVotingDuration) {
      errors.votingDuration = [`Voting duration must not exceed ${status.maxVotingDuration / (24 * 60 * 60)} days`];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
