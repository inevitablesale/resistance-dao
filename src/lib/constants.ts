
import { ethers } from "ethers";

export const FACTORY_ADDRESS = "0x3522fCA64A8F79b004fDbd9a383B56113B81130B";
export const RD_TOKEN_ADDRESS = "0x81137573408bCD23f801A56D68268cc0CE5206B5";
export const TREASURY_ADDRESS = "0x386f47AE974255c9486A2D4B91a3694E95A1EE81";
export const RD_PRICE_USD = 1.00; // $1.00 per RD token
export const MIN_LGR_REQUIRED = "100"; // 100 RD tokens minimum required

// Contract-specific constants
export const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
export const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
export const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000"); // 1,000 RD
export const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000"); // 25,000,000 RD
export const SUBMISSION_FEE = ethers.utils.parseEther("25"); // 25 RD to submit
export const VOTING_FEE = ethers.utils.parseEther("1"); // 1 RD to vote

// Contract addresses
export const AUTHORIZED_TEST_MODE_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";

// Factory Contract ABI for RDProposalFactory
export const FACTORY_ABI = [
  // View functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function paused() view returns (bool)", // Added this line
  
  // RDProposalFactory specific functions
  "function RD_TOKEN() view returns (address)",
  "function treasury() view returns (address)",
  "function submissionFee() view returns (uint256)",
  "function VOTING_FEE() view returns (uint256)",
  "function MIN_TARGET_CAPITAL() view returns (uint128)",
  "function MAX_TARGET_CAPITAL() view returns (uint128)",
  "function proposals(uint256) view returns (address creator, string title, string metadataURI, uint128 targetCapital, uint256 votingEnds, uint256 launchTimestamp, uint256 lastActivityTimestamp, uint256 backerCount, uint256 totalPledged)",
  "function userProposals(address, uint256) view returns (uint256)",
  "function hasVoted(uint256, address) view returns (bool)",
  "function proposalVoters(uint256, uint256) view returns (address)",
  
  // State-modifying functions
  "function createProposal(string calldata title, string calldata metadataURI, uint128 targetCapital, uint256 votingDuration) returns (uint256)",
  "function vote(uint256 proposalId, uint128 pledgeAmount)",
  "function updateMetadata(uint256 proposalId, string calldata newMetadataURI)",
  
  // Events
  "event ProposalCreated(uint256 indexed proposalId, address indexed creator)",
  "event ProposalMetadataUpdated(uint256 indexed proposalId, string newMetadataURI)",
  "event ProposalVoted(uint256 indexed proposalId, address indexed voter, uint128 pledgeAmount, uint256 timestamp)",
  "event ProposalFullyPledged(uint256 indexed proposalId, uint128 totalPledged, uint256 backerCount, uint256 timestamp)",
  "event MilestoneReached(uint256 indexed proposalId, uint256 milestone, uint256 currentAmount, uint256 timestamp)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];
