
import { ethers } from "ethers";

export const FACTORY_ADDRESS = "0x3522fCA64A8F79b004fDbd9a383B56113B81130B";
export const LGR_TOKEN_ADDRESS = "0x81137573408bCD23f801A56D68268cc0CE5206B5";
export const TREASURY_ADDRESS = "0x386f47AE974255c9486A2D4B91a3694E95A1EE81";
export const LGR_PRICE_USD = 0.10; // $0.10 per LGR token

// Contract-specific constants
export const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
export const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
export const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000"); // 1,000 LGR
export const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000"); // 25,000,000 LGR
export const SUBMISSION_FEE = ethers.utils.parseEther("250"); // 250 LGR
export const VOTING_FEE = ethers.utils.parseEther("10"); // 10 LGR

// Contract addresses
export const AUTHORIZED_TEST_MODE_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";

// Factory Contract ABI for LedgerFren Proposal Factory
export const FACTORY_ABI = [
  // Proposal creation
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

  // Proposal data getters
  `function proposals(uint256) public view returns (
    address creator,
    string creatorLinkedIn,
    string title,
    string ipfsMetadata,
    uint128 targetCapital,
    uint256 votingEnds,
    string investmentDrivers,
    string additionalCriteria,
    uint8 firmSize,
    string location,
    uint8 dealType,
    uint8 geographicFocus,
    uint8[] paymentTerms,
    uint8[] operationalStrategies,
    uint8[] growthStrategies,
    uint8[] integrationStrategies,
    uint256 totalVotes
  )`,

  // Core contract getters
  "function LGR_TOKEN() public view returns (address)",
  "function tester() public view returns (address)",
  "function treasury() public view returns (address)",
  "function submissionFee() public view returns (uint256)",
  "function testModeEnabled() public view returns (bool)",

  // Constants getters
  "function MIN_VOTING_DURATION() public view returns (uint256)",
  "function MAX_VOTING_DURATION() public view returns (uint256)",
  "function MIN_TARGET_CAPITAL() public view returns (uint128)",
  "function MAX_TARGET_CAPITAL() public view returns (uint128)",
  "function VOTING_FEE() public view returns (uint256)",

  // Proposal tracking
  "function userProposals(address) public view returns (uint256[])",
  "function hasVoted(uint256,address) public view returns (bool)",
  "function pledgedAmount(uint256) public view returns (uint128)",
  "function voterPledges(uint256,address) public view returns (uint128)",
  "function proposalVoters(uint256) public view returns (address[])",

  // Voting functionality
  "function vote(uint256 tokenId, uint128 pledgeAmount) external",
  
  // Admin functions
  "function setTestMode(bool _enabled) external",
  "function owner() public view returns (address)",
  "function paused() public view returns (bool)",
  
  // NFT functionality
  "function tokenURI(uint256) public view returns (string)",
  
  // Events
  "event ProposalCreated(uint256 indexed tokenId, address indexed creator)",
  "event ProposalNFTMinted(uint256 indexed tokenId, address indexed creator)",
  "event ProposalVoted(uint256 indexed tokenId, address indexed voter, uint128 pledgeAmount)",
  "event ProposalFullyPledged(uint256 indexed tokenId, uint128 totalPledged, address[] backers)",
  "event TestModeChanged(bool newStatus)"
];

