import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";

const FACTORY_ADDRESS = "0xF3a201c101bfefDdB3C840a135E1573B1b8e7765";
const FACTORY_ABI = [
  "function createProposal(string memory ipfsMetadata, uint256 targetCapital, uint256 votingDuration) external returns (address)",
  "function submissionFee() public view returns (uint256)",
  "function paused() public view returns (bool)",
  "function testModeEnabled() public view returns (bool)",
  "function treasury() public view returns (address)",
  "function minTargetCapital() public view returns (uint256)",
  "function maxTargetCapital() public view returns (uint256)",
  "function minVotingDuration() public view returns (uint256)",
  "function maxVotingDuration() public view returns (uint256)"
];

export interface ContractStatus {
  submissionFee: ethers.BigNumber;
  isPaused: boolean;
  isTestMode: boolean;
  treasuryAddress: string;
  minTargetCapital: ethers.BigNumber;
  maxTargetCapital: ethers.BigNumber;
  minVotingDuration: number;
  maxVotingDuration: number;
}

export interface ProposalConfig {
  targetCapital: ethers.BigNumber;
  votingDuration: number;
  ipfsHash: string;
}

export interface GasEstimate {
  gasLimit: ethers.BigNumber;
  gasPrice: ethers.BigNumber;
  totalCost: ethers.BigNumber;
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
  console.log("Getting contract status with wallet:", wallet);
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

  try {
    console.log("Calling contract methods...");
    const [
      submissionFee,
      isPaused,
      isTestMode,
      treasuryAddress,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration,
      maxVotingDuration
    ] = await Promise.all([
      factory.submissionFee().catch((e: Error) => {
        console.error("Error calling submissionFee:", e);
        throw e;
      }),
      factory.paused().catch((e: Error) => {
        console.error("Error calling paused:", e);
        throw e;
      }),
      factory.testModeEnabled().catch((e: Error) => {
        console.error("Error calling testModeEnabled:", e);
        throw e;
      }),
      factory.treasury().catch((e: Error) => {
        console.error("Error calling treasury:", e);
        throw e;
      }),
      factory.minTargetCapital().catch((e: Error) => {
        console.error("Error calling minTargetCapital:", e);
        throw e;
      }),
      factory.maxTargetCapital().catch((e: Error) => {
        console.error("Error calling maxTargetCapital:", e);
        throw e;
      }),
      factory.minVotingDuration().catch((e: Error) => {
        console.error("Error calling minVotingDuration:", e);
        throw e;
      }),
      factory.maxVotingDuration().catch((e: Error) => {
        console.error("Error calling maxVotingDuration:", e);
        throw e;
      })
    ]);

    console.log("Contract calls successful:", {
      submissionFee: submissionFee.toString(),
      isPaused,
      isTestMode,
      treasuryAddress,
      minTargetCapital: minTargetCapital.toString(),
      maxTargetCapital: maxTargetCapital.toString(),
      minVotingDuration: Number(minVotingDuration),
      maxVotingDuration: Number(maxVotingDuration)
    });

    return {
      submissionFee,
      isPaused,
      isTestMode,
      treasuryAddress,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration: Number(minVotingDuration),
      maxVotingDuration: Number(maxVotingDuration)
    };
  } catch (error) {
    console.error("Error getting contract status:", error);
    throw new Error("Failed to get contract status. Please ensure you're connected to the correct network.");
  }
};

export const estimateProposalGas = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<GasEstimate> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  
  const gasEstimate = await factory.estimateGas.createProposal(
    config.ipfsHash,
    config.targetCapital,
    config.votingDuration
  );

  const gasPrice = await provider.getGasPrice();
  const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer
  
  return {
    gasLimit,
    gasPrice,
    totalCost: gasLimit.mul(gasPrice)
  };
};

export const createProposal = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  return await executeTransaction(
    () => factory.createProposal(
      config.ipfsHash,
      config.targetCapital,
      config.votingDuration
    ),
    {
      type: 'proposal',
      description: `Creating proposal with target capital ${ethers.utils.formatEther(config.targetCapital)} ETH`,
      timeout: 180000, // 3 minutes for proposal creation
      maxRetries: 3,
      backoffMs: 5000
    }
  );
};
