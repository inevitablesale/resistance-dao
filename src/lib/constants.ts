
import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x624dFf6455FBE2f569571fba31c7D020b905b745";
export const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
export const LGR_PRICE_USD = 0.10; // $0.10 per LGR token

// Contract-specific constants
export const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
export const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
export const MIN_TARGET_CAPITAL = "1000"; // 1,000 LGR
export const MAX_TARGET_CAPITAL = "25000000"; // 25,000,000 LGR
export const SUBMISSION_FEE = "250"; // 250 LGR
export const VOTING_FEE = "10"; // 10 LGR

// Contract addresses
export const FACTORY_ADDRESS = "0x624dFf6455FBE2f569571fba31c7D020b905b745";
export const AUTHORIZED_TEST_MODE_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";

// Contract ABI - Updated for new contract
export const CONTRACT_ABI = [
  // Core proposal creation
  `function createProposal(
    tuple(
      string title,
      string ipfsMetadata,
      uint128 targetCapital,
      uint256 votingDuration,
      string investmentDrivers,
      string additionalCriteria,
      uint8 firmSize,
      string location,
      uint8 dealType,
      uint8 geographicFocus,
      uint8[] paymentTerms,
      uint8[] operationalStrategies,
      uint8[] growthStrategies,
      uint8[] integrationStrategies
    ) input,
    string linkedInURL
  ) external returns (uint256)`,

  // Read-only getters
  "function LGR_TOKEN() public view returns (address)",
  "function MAX_TARGET_CAPITAL() public view returns (uint128)",
  "function MIN_TARGET_CAPITAL() public view returns (uint128)",
  "function MIN_VOTING_DURATION() public view returns (uint256)",
  "function MAX_VOTING_DURATION() public view returns (uint256)",
  "function VOTING_FEE() public view returns (uint256)",
  "function submissionFee() public view returns (uint256)",
  "function owner() public view returns (address)",
  "function paused() public view returns (bool)",
  "function testModeEnabled() public view returns (bool)",
  "function treasury() public view returns (address)",
  "function tester() public view returns (address)",
  
  // Vote functions
  "function vote(uint256 tokenId, uint128 pledgeAmount) external",
  "function hasVoted(uint256,address) public view returns (bool)",
  "function voterPledges(uint256,address) public view returns (uint128)",
  "function pledgedAmount(uint256) public view returns (uint128)",
  
  // Admin functions
  "function setTestMode(bool _enabled) external",
  
  // Events
  "event ProposalCreated(uint256 indexed tokenId, address indexed creator)",
  "event ProposalNFTMinted(uint256 indexed tokenId, address indexed creator)",
  "event ProposalVoted(uint256 indexed tokenId, address indexed voter, uint128 pledgeAmount)",
  "event ProposalFullyPledged(uint256 indexed tokenId, uint128 totalPledged, address[] backers)",
  "event TestModeChanged(bool newStatus)"
];

// Also export FACTORY_ABI for new code
export const FACTORY_ABI = CONTRACT_ABI;
