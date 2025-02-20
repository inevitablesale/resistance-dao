import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { ProposalMetadata, ProposalConfig, FirmSize, DealType, GeographicFocus, PaymentTerm, OperationalStrategy, GrowthStrategy, IntegrationStrategy } from "@/types/proposals";

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

function validateProposalInput(config: ProposalConfig) {
  // Title validation (10-100 chars)
  if (!config.metadata.title || config.metadata.title.length < 10 || config.metadata.title.length > 100) {
    throw new Error("Title must be between 10 and 100 characters");
  }

  // IPFS hash validation
  if (!config.ipfsHash || config.ipfsHash.length === 0) {
    throw new Error("IPFS metadata hash is required");
  }

  // Investment drivers validation (50-500 chars)
  if (!config.metadata.investment.drivers || 
      config.metadata.investment.drivers.length < 50 || 
      config.metadata.investment.drivers.length > 500) {
    throw new Error("Investment drivers must be between 50 and 500 characters");
  }

  // Additional criteria validation (max 500 chars)
  if (config.metadata.investment.additionalCriteria && 
      config.metadata.investment.additionalCriteria.length > 500) {
    throw new Error("Additional criteria must not exceed 500 characters");
  }

  // LinkedIn URL validation
  if (!config.linkedInURL || config.linkedInURL.length === 0 || config.linkedInURL.length > 200) {
    throw new Error("Valid LinkedIn URL is required (max 200 characters)");
  }

  // Validate arrays are not empty
  if (!config.metadata.paymentTerms.length) {
    throw new Error("At least one payment term is required");
  }
  
  if (!config.metadata.strategies.operational.length) {
    throw new Error("At least one operational strategy is required");
  }
  
  if (!config.metadata.strategies.growth.length) {
    throw new Error("At least one growth strategy is required");
  }
  
  if (!config.metadata.strategies.integration.length) {
    throw new Error("At least one integration strategy is required");
  }

  // Validate enum values
  const validateEnum = (value: number, enumType: any, name: string) => {
    if (value < 0 || value >= Object.keys(enumType).length / 2) {
      throw new Error(`Invalid ${name} value: ${value}`);
    }
  };

  validateEnum(config.metadata.firmCriteria.size, FirmSize, "firm size");
  validateEnum(config.metadata.firmCriteria.dealType, DealType, "deal type");
  validateEnum(config.metadata.firmCriteria.geographicFocus, GeographicFocus, "geographic focus");

  config.metadata.paymentTerms.forEach(term => 
    validateEnum(term, PaymentTerm, "payment term"));
  config.metadata.strategies.operational.forEach(strategy => 
    validateEnum(strategy, OperationalStrategy, "operational strategy"));
  config.metadata.strategies.growth.forEach(strategy => 
    validateEnum(strategy, GrowthStrategy, "growth strategy"));
  config.metadata.strategies.integration.forEach(strategy => 
    validateEnum(strategy, IntegrationStrategy, "integration strategy"));
}

export const createProposal = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  // Validate input before attempting contract call
  validateProposalInput(config);
  
  // Log input values before contract call
  console.log("Creating proposal with parameters:", {
    title: config.metadata.title,
    targetCapital: {
      decimal: config.targetCapital.toString(),
      hex: config.targetCapital.toHexString(),
      fits_uint128: config.targetCapital.lte(ethers.BigNumber.from(2).pow(128).sub(1))
    },
    votingDuration: config.votingDuration,
    ipfsHash: config.ipfsHash
  });
  
  // Create contract input matching the struct exactly
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

  // Try to estimate gas first to catch any potential errors
  try {
    const gasEstimate = await factory.estimateGas.createProposal(input, config.linkedInURL);
    console.log("Gas estimation successful:", gasEstimate.toString());
  } catch (error) {
    console.error("Gas estimation failed:", error);
    throw error;
  }
  
  return await executeTransaction(
    () => factory.createProposal(input, config.linkedInURL),
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
