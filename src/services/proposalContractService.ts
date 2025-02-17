
import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";
import { LGR_PRICE_USD } from "@/lib/constants";

const FACTORY_ADDRESS = "0xF3a201c101bfefDdB3C840a135E1573B1b8e7765";
const FACTORY_ABI = [
  // Core proposal creation
  "function createProposal(string memory ipfsMetadata, uint256 targetCapital, uint256 votingDuration) external returns (address)",
  // Read-only getters
  "function LGR_TOKEN() public view returns (address)",
  "function MAX_TARGET_CAPITAL() public view returns (uint256)",
  "function MIN_TARGET_CAPITAL() public view returns (uint256)",
  "function MIN_VOTING_DURATION() public view returns (uint256)",
  "function MAX_VOTING_DURATION() public view returns (uint256)",
  "function VOTING_FEE() public view returns (uint256)",
  "function owner() public view returns (address)",
  "function paused() public view returns (bool)",
  "function testModeEnabled() public view returns (bool)",
  "function treasury() public view returns (address)",
  "function submissionFee() public view returns (uint256)",
  // Events
  "event ProposalCreated(uint256 indexed tokenId, address proposalContract, address creator, bool isTest)",
  "event Paused(address account)",
  "event Unpaused(address account)"
];

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
      treasury,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration,
      maxVotingDuration,
      votingFee,
      lgrTokenAddress,
      owner
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
      factory.owner()
    ]);

    console.log("Contract calls successful:", {
      submissionFee: submissionFee.toString(),
      isPaused,
      isTestMode,
      treasury: treasury.toString(),
      minTargetCapital: minTargetCapital.toString(),
      maxTargetCapital: maxTargetCapital.toString(),
      minVotingDuration: Number(minVotingDuration),
      maxVotingDuration: Number(maxVotingDuration),
      votingFee: votingFee.toString(),
      lgrTokenAddress,
      owner
    });

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
      owner
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
  
  // For ZeroDev bundler, we need a higher base estimate
  const baseGasEstimate = ethers.BigNumber.from("3000000"); // Increased base estimate
  const gasPrice = await provider.getGasPrice();
  
  // Add 100% buffer for complex AA transactions
  const gasLimit = baseGasEstimate.mul(200).div(100);
  
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
  
  // Format target capital for logging (convert from wei to LGR)
  const lgrAmount = Number(ethers.utils.formatUnits(config.targetCapital, 18));
  console.log("Creating proposal with target capital:", lgrAmount, "LGR");
  console.log("Target capital in wei:", config.targetCapital.toString());

  // Get gas estimate with buffer
  const { gasLimit } = await estimateProposalGas(config, wallet);
  
  return await executeTransaction(
    () => factory.createProposal(
      config.ipfsHash,
      config.targetCapital,
      config.votingDuration,
      { gasLimit }
    ),
    {
      type: 'proposal',
      description: `Creating proposal with target capital $${(lgrAmount * LGR_PRICE_USD).toLocaleString()} USD`,
      timeout: 180000,
      maxRetries: 3,
      backoffMs: 5000
    }
  );
};
