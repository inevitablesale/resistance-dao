
import { ethers } from "ethers";

export const FACTORY_ADDRESS = "0x3522fCA64A8F79b004fDbd9a383B56113B81130B";
export const RD_TOKEN_ADDRESS = "0x81137573408bCD23f801A56D68268cc0CE5206B5";
export const TREASURY_ADDRESS = "0x386f47AE974255c9486A2D4B91a3694E95A1EE81";
export const RD_PRICE_USD = 0.10; // $0.10 per RD token

// Contract-specific constants
export const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
export const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
export const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000"); // 1,000 RD
export const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000"); // 25,000,000 RD
export const SUBMISSION_FEE = ethers.utils.parseEther("25"); // 25 RD to submit
export const VOTING_FEE = ethers.utils.parseEther("1"); // 1 RD to vote

// Contract addresses
export const AUTHORIZED_TEST_MODE_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";

// Factory Contract ABI for Resistance DAO Proposal NFTs (ERC-721)
export const FACTORY_ABI = [
  // ERC-721 standard functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",

  // ERC-721Enumerable functions
  "function totalSupply() view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenByIndex(uint256 index) view returns (uint256)",

  // Core proposal functions
  "function createProposal(string calldata title, string calldata metadataURI, uint128 targetCapital, uint256 votingDuration) external returns (uint256)",
  "function vote(uint256 proposalId, uint128 pledgeAmount) external",
  "function updateMetadata(uint256 proposalId, string calldata newMetadataURI) external",
  "function pledgedAmount(uint256 proposalId) external view returns (uint128)",
  
  // View functions
  "function RD_TOKEN() external view returns (address)",
  "function treasury() external view returns (address)",
  "function submissionFee() external view returns (uint256)",
  "function VOTING_FEE() external view returns (uint256)",
  "function MIN_TARGET_CAPITAL() external view returns (uint128)",
  "function MAX_TARGET_CAPITAL() external view returns (uint128)",
  
  // Events
  "event ProposalCreated(uint256 indexed tokenId, address indexed creator)",
  "event ProposalMetadataUpdated(uint256 indexed tokenId, string newMetadataURI)",
  "event ProposalVoted(uint256 indexed tokenId, address indexed voter, uint128 pledgeAmount, uint256 timestamp)",
  "event ProposalFullyPledged(uint256 indexed tokenId, uint128 totalPledged, uint256 backerCount, uint256 timestamp)",
  "event MilestoneReached(uint256 indexed tokenId, uint256 milestone, uint256 currentAmount, uint256 timestamp)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
];
