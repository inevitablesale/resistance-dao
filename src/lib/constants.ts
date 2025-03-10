
import { ethers } from "ethers";

// Original RD Token and Factory addresses
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

// Party Protocol Constants on Polygon
export const PARTY_PROTOCOL = {
  FACTORY_ADDRESS: "0x80393bC5719fcd72A6dF004E9aB5277201775c31",
  ETH_CROWDFUND_ADDRESS: "0xEE8ea16cF5dB5cC2aEE8984E673B83F2D29c2797",
  PARTY_IMPLEMENTATION: "0x4ec46A5C10fd795CEc3bBC6F85b372465B1051f3",
  GOVERNANCE_ADDRESS: "0x87a86CAD115a46F515f3456AE63c39FedB0f8Ab4",
  EXECUTION_DELAY: 24 * 60 * 60, // 1 day in seconds
  PASS_THRESHOLD_BPS: 5000, // 50%
  FEE_BPS: 0 // No fees initially
};

// Party Protocol ABIs
export const PARTY_FACTORY_ABI = [
  "function createParty(tuple(address authority, string name, address[] hosts, uint40 votingDuration, uint40 executionDelay, uint16 passThresholdBps, address[] proposers, tuple(tuple(uint8 basicProposalEngineType, bytes[] targetAddresses, uint256[] values, bytes[] calldatas, string[] signatures) proposalEngineOpts, bool enableAddAuthorityProposal, bool allowPublicProposals, bool allowUriChanges, bool allowCustomProposals) proposalConfig)) returns (address)",
  "function createEthCrowdfund(address rendererBase, string name, string symbol, uint256 contribution, address gateKeeper, bytes gateKeeperId, address initialContributor, uint96 initialDelegate, uint96 minContribution, uint96 maxContribution, uint96 maxTotalContributions, uint40 duration, uint40 fundingSplitBps, address[] fundingSplitRecipient, bytes[] tokenGateOptions, bool disableContributingForExistingCard, address, string contentHash) returns (address)"
];

export const ETH_CROWDFUND_ABI = [
  "function initialize(address payable partyDao, address tokenProvider, address splitRecipient, uint16 splitBps) returns (bytes32)",
  "function contribute(address delegate, string memo, bytes gatekeeperData) payable returns (uint256)",
  "function setContributingForExistingCardDisabled(bool disabled)"
];

export const PARTY_GOVERNANCE_ABI = [
  "function propose(tuple(uint8 basicProposalEngineType, bytes[] targetAddresses, uint256[] values, bytes[] calldatas, string[] signatures) proposalEngineOpts, string description, bytes progressData) returns (uint256 proposalId)",
  "function execute(uint256 proposalId, tuple(address[] targets, uint256[] values, bytes[] calldatas, string[] signatures) proposalData, uint256 flags, bytes progressData) returns (bytes[] execResults)",
  "function cancelProposal(uint256 proposalId)"
];

// Survivor NFT Contract
export const SURVIVOR_NFT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C"; // Replace with actual address
export const SURVIVOR_NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

// Sentinel NFT Contract
export const SENTINEL_NFT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C"; // Replace with actual address if different
export const SENTINEL_NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];
