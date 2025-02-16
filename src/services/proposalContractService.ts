
import { ethers } from "ethers";
import type { DynamicWallet } from "@dynamic-labs/sdk-react-core";

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
  "function maxVotingDuration() public view returns (uint256)",
  "event ProposalCreated(uint256 indexed tokenId, address proposalContract, address creator, bool isTest)"
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

async function getProvider(wallet: DynamicWallet) {
  try {
    const provider = await wallet.connector?.getProvider();
    if (!provider) {
      throw new Error("No provider available");
    }
    return new ethers.providers.Web3Provider(provider as any);
  } catch (error) {
    console.error("Error getting provider:", error);
    throw new Error("Failed to initialize provider");
  }
}

export const getContractStatus = async (wallet: DynamicWallet): Promise<ContractStatus> => {
  console.log("Getting contract status with wallet:", wallet);
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

  try {
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
      factory.submissionFee(),
      factory.paused(),
      factory.testModeEnabled(),
      factory.treasury(),
      factory.minTargetCapital(),
      factory.maxTargetCapital(),
      factory.minVotingDuration(),
      factory.maxVotingDuration()
    ]);

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
  wallet: DynamicWallet
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
  wallet: DynamicWallet
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  return await factory.createProposal(
    config.ipfsHash,
    config.targetCapital,
    config.votingDuration
  );
};
