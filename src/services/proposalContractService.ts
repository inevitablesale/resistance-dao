import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { ProposalMetadata, ProposalConfig } from "@/types/proposals";

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

export const createProposal = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
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
