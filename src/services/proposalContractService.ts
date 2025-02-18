
import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { executeTransaction } from "./transactionManager";
import { convertUSDToLGRWei } from "@/components/thesis/TargetCapitalInput";
import { ProposalInput, ProposalData } from "@/types/proposals";

const FACTORY_ADDRESS = "0xD00655Ce27387b8B1EE7759b1f44De5748916Ba5";
const AUTHORIZED_TEST_MODE_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";

const FACTORY_ABI = [
  // Core proposal creation
  "function createProposal(tuple(string title, string ipfsMetadata, uint128 targetCapital, uint256 votingDuration, string investmentDrivers, string additionalCriteria, uint8 firmSize, string location, uint8 dealType, uint8 geographicFocus, uint8[] paymentTerms, uint8[] operationalStrategies, uint8[] growthStrategies, uint8[] integrationStrategies) input, string linkedInURL) external returns (uint256)",
  "function testCreateProposal(tuple(string title, string ipfsMetadata, uint128 targetCapital, uint256 votingDuration, string investmentDrivers, string additionalCriteria, uint8 firmSize, string location, uint8 dealType, uint8 geographicFocus, uint8[] paymentTerms, uint8[] operationalStrategies, uint8[] growthStrategies, uint8[] integrationStrategies) input, string linkedInURL) external",
  // Read-only getters
  "function LGR_TOKEN() public view returns (address)",
  "function treasury() public view returns (address)",
  "function tester() public view returns (address)",
  "function submissionFee() public view returns (uint256)",
  "function testModeEnabled() public view returns (bool)",
  "function paused() public view returns (bool)",
  "function MIN_VOTING_DURATION() public view returns (uint256)",
  "function MAX_VOTING_DURATION() public view returns (uint256)",
  "function MIN_TARGET_CAPITAL() public view returns (uint128)",
  "function MAX_TARGET_CAPITAL() public view returns (uint128)",
  "function VOTING_FEE() public view returns (uint256)",
  "function proposals(uint256) public view returns (tuple(address creator, string creatorLinkedIn, string title, string ipfsMetadata, uint128 targetCapital, uint256 votingEnds, string investmentDrivers, string additionalCriteria, uint8 firmSize, string location, uint8 dealType, uint8 geographicFocus, uint8[] paymentTerms, uint8[] operationalStrategies, uint8[] growthStrategies, uint8[] integrationStrategies, uint256 totalVotes))",
  // Events
  "event ProposalCreated(uint256 indexed tokenId, address indexed creator)",
  "event ProposalNFTMinted(uint256 indexed tokenId, address indexed creator)",
  "event TestModeChanged(bool newStatus)"
];

export interface ContractStatus {
  submissionFee: ethers.BigNumber;
  isPaused: boolean;
  isTestMode: boolean;
  treasury: string;
  tester: string;
  minTargetCapital: ethers.BigNumber;
  maxTargetCapital: ethers.BigNumber;
  minVotingDuration: number;
  maxVotingDuration: number;
  votingFee: ethers.BigNumber;
  lgrTokenAddress: string;
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
      tester,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration,
      maxVotingDuration,
      votingFee,
      lgrTokenAddress
    ] = await Promise.all([
      factory.submissionFee(),
      factory.paused(),
      factory.testModeEnabled(),
      factory.treasury(),
      factory.tester(),
      factory.MIN_TARGET_CAPITAL(),
      factory.MAX_TARGET_CAPITAL(),
      factory.MIN_VOTING_DURATION(),
      factory.MAX_VOTING_DURATION(),
      factory.VOTING_FEE(),
      factory.LGR_TOKEN()
    ]);

    return {
      submissionFee,
      isPaused,
      isTestMode,
      treasury,
      tester,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration: Number(minVotingDuration),
      maxVotingDuration: Number(maxVotingDuration),
      votingFee,
      lgrTokenAddress
    };
  } catch (error) {
    console.error("Error getting contract status:", error);
    throw new Error("Failed to get contract status");
  }
};

export const createProposal = async (
  input: ProposalInput,
  linkedInURL: string,
  wallet: NonNullable<DynamicContextType['primaryWallet']>,
  isTestMode: boolean = false
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  const status = await getContractStatus(wallet);
  
  // Validate submission requirements
  if (status.isPaused) {
    throw new Error("Contract is currently paused");
  }

  // Format input for contract
  const proposalInput = {
    ...input,
    targetCapital: ethers.utils.parseUnits(input.targetCapital, 18)
  };

  console.log("Creating proposal with input:", {
    ...proposalInput,
    targetCapital: proposalInput.targetCapital.toString(),
    isTestMode
  });

  try {
    // Use appropriate creation function based on test mode
    if (isTestMode) {
      const signerAddress = await provider.getSigner().getAddress();
      if (signerAddress.toLowerCase() !== status.tester.toLowerCase()) {
        throw new Error("Not authorized to create test proposals");
      }
      return await factory.testCreateProposal(proposalInput, linkedInURL);
    } else {
      return await factory.createProposal(proposalInput, linkedInURL);
    }
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
};

export const getProposal = async (
  tokenId: number,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ProposalData> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

  try {
    const proposal = await factory.proposals(tokenId);
    return {
      creator: proposal.creator,
      creatorLinkedIn: proposal.creatorLinkedIn,
      title: proposal.title,
      ipfsMetadata: proposal.ipfsMetadata,
      targetCapital: ethers.utils.formatUnits(proposal.targetCapital, 18),
      votingEnds: Number(proposal.votingEnds),
      investmentDrivers: proposal.investmentDrivers,
      additionalCriteria: proposal.additionalCriteria,
      firmSize: proposal.firmSize,
      location: proposal.location,
      dealType: proposal.dealType,
      geographicFocus: proposal.geographicFocus,
      paymentTerms: proposal.paymentTerms,
      operationalStrategies: proposal.operationalStrategies,
      growthStrategies: proposal.growthStrategies,
      integrationStrategies: proposal.integrationStrategies,
      totalVotes: Number(proposal.totalVotes)
    };
  } catch (error) {
    console.error("Error fetching proposal:", error);
    throw error;
  }
};
