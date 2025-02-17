
import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";
import { LGR_PRICE_USD } from "@/lib/constants";
import { ProposalError } from "./errorHandlingService";

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
  targetCapital: string | ethers.BigNumber;
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
    console.log("Initializing provider for wallet type:", wallet.connector?.name);
    
    // For ZeroDev wallets
    if (wallet.connector?.name?.toLowerCase().includes('zerodev')) {
      console.log("Using ZeroDev provider");
      // Access the wallet client directly for ZeroDev
      const walletClient = await wallet.getWalletClient();
      if (!walletClient) {
        throw new ProposalError({
          category: 'wallet',
          message: "Failed to get ZeroDev wallet client",
          recoverySteps: [
            "Please refresh and try again",
            "Make sure your ZeroDev wallet is properly connected"
          ]
        });
      }
      return new ethers.providers.Web3Provider(walletClient as any);
    }
    
    // For regular wallets
    console.log("Getting wallet client...");
    const walletClient = await wallet.getWalletClient();
    
    if (!walletClient) {
      throw new ProposalError({
        category: 'wallet',
        message: "No wallet client available",
        recoverySteps: [
          "Please refresh and try again",
          "Make sure your wallet is properly connected"
        ]
      });
    }
    
    console.log("Creating Web3Provider...");
    return new ethers.providers.Web3Provider(walletClient as any);
  } catch (error) {
    console.error("Error getting provider:", error);
    if (error instanceof ProposalError) {
      throw error;
    }
    throw new ProposalError({
      category: 'wallet',
      message: "Failed to initialize provider",
      recoverySteps: [
        "Please refresh and try again",
        "Check your wallet connection",
        "Make sure you're on the Polygon network"
      ]
    });
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
      treasury,
      minTargetCapital: minTargetCapital.toString(),
      maxTargetCapital: maxTargetCapital.toString(),
      minVotingDuration,
      maxVotingDuration,
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
    throw new ProposalError({
      category: 'contract',
      message: "Failed to get contract status",
      recoverySteps: [
        "Please ensure you're connected to the correct network",
        "Check your wallet connection",
        "Try refreshing the page"
      ]
    });
  }
};

export const estimateProposalGas = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<GasEstimate> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  
  // For ZeroDev bundler, we'll use a higher gas limit estimation
  const gasEstimate = ethers.BigNumber.from("1000000"); // Base gas estimation
  const gasPrice = await provider.getGasPrice();
  const gasLimit = gasEstimate.mul(150).div(100); // Add 50% buffer
  
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
  
  // Convert targetCapital to BigNumber if it's a string
  const targetCapitalWei = typeof config.targetCapital === 'string'
    ? ethers.utils.parseEther(config.targetCapital)
    : config.targetCapital;
  
  return await executeTransaction(
    () => factory.createProposal(
      config.ipfsHash,
      targetCapitalWei,
      config.votingDuration
    ),
    {
      type: 'proposal',
      description: `Creating proposal with target capital ${ethers.utils.formatEther(targetCapitalWei).toLocaleString()} LGR`,
      timeout: 180000, // 3 minutes
      maxRetries: 3,
      backoffMs: 5000
    }
  );
};
