import { ethers } from "ethers";

export const FACTORY_ADDRESS = "0x624dFf6455FBE2f569571fba31c7D020b905b745";
export const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
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

// Factory Contract ABI
export const FACTORY_ABI = [
  // Constructor and Initialization
  "constructor(address _lgrToken, address _treasury, address _tester)",
  
  // State Variables
  "function LGR_TOKEN() external view returns (address)",
  "function tester() external view returns (address)",
  "function treasury() external view returns (address)",
  "function submissionFee() external view returns (uint256)",
  "function testModeEnabled() external view returns (bool)",
  "function MIN_VOTING_DURATION() external pure returns (uint256)",
  "function MAX_VOTING_DURATION() external pure returns (uint256)",
  "function MIN_TARGET_CAPITAL() external pure returns (uint128)",
  "function MAX_TARGET_CAPITAL() external pure returns (uint128)",
  "function VOTING_FEE() external pure returns (uint256)",
  
  // Function Interfaces
  "function setTestMode(bool _enabled) external",
  "function createProposal((string,string,uint128,uint256,string,string,uint8,string,uint8,uint8,uint8[],uint8[],uint8[],uint8[]) calldata input, string calldata linkedInURL) external returns (uint256)",
  "function vote(uint256 tokenId, uint128 pledgeAmount) external",
  
  // Mapping Access Functions
  "function proposals(uint256) external view returns (address creator, string creatorLinkedIn, string title, string ipfsMetadata, uint128 targetCapital, uint256 votingEnds, string investmentDrivers, string additionalCriteria, uint8 firmSize, string location, uint8 dealType, uint8 geographicFocus, uint256 totalVotes)",
  "function userProposals(address, uint256) external view returns (uint256)",
  "function hasVoted(uint256, address) external view returns (bool)",
  "function pledgedAmount(uint256) external view returns (uint128)",
  "function voterPledges(uint256, address) external view returns (uint128)",
  
  // Events
  "event ProposalCreated(uint256 indexed tokenId, address indexed creator)",
  "event ProposalNFTMinted(uint256 indexed tokenId, address indexed creator)",
  "event ProposalVoted(uint256 indexed tokenId, address indexed voter, uint128 pledgeAmount)",
  "event ProposalFullyPledged(uint256 indexed tokenId, uint128 totalPledged, address[] backers)",
  "event TestModeChanged(bool newStatus)",
  
  // ERC721 Required Functions
  "function balanceOf(address owner) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  
  // Optional but recommended ERC721 Functions
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function approve(address to, uint256 tokenId) external",
  "function getApproved(uint256 tokenId) external view returns (address)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function safeTransferFrom(address from, address to, uint256 tokenId) external",
  "function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external"
] as const;
