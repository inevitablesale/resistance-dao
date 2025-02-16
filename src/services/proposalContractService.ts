
import { ethers } from "ethers";

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

export const getContractStatus = async (provider: ethers.providers.Web3Provider): Promise<ContractStatus> => {
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  
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
};

export const estimateProposalGas = async (
  config: ProposalConfig,
  provider: ethers.providers.Web3Provider
): Promise<GasEstimate> => {
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
  provider: ethers.providers.Web3Provider
): Promise<ethers.ContractTransaction> => {
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  return await factory.createProposal(
    config.ipfsHash,
    config.targetCapital,
    config.votingDuration
  );
};
