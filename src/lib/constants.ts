
export const FACTORY_ABI = [
  "function createProposal(tuple(string title, string ipfsMetadata, uint128 targetCapital, uint256 votingDuration, string investmentDrivers, string additionalCriteria, uint8 firmSize, string location, uint8 dealType, uint8 geographicFocus, uint8[] paymentTerms, uint8[] operationalStrategies, uint8[] growthStrategies, uint8[] integrationStrategies) input, string linkedInURL) external returns (uint256)",
  "function submissionFee() external view returns (uint256)",
  "function testModeEnabled() external view returns (bool)",
  "function treasury() external view returns (address)",
  "function MIN_TARGET_CAPITAL() external view returns (uint128)",
  "function MAX_TARGET_CAPITAL() external view returns (uint128)",
  "function MIN_VOTING_DURATION() external view returns (uint256)",
  "function MAX_VOTING_DURATION() external view returns (uint256)",
  "function VOTING_FEE() external view returns (uint256)",
  "function LGR_TOKEN() external view returns (address)",
  "function owner() external view returns (address)",
  "function tester() external view returns (address)",
  "event ProposalCreated(uint256 indexed tokenId, address indexed creator)",
  "event ProposalNFTMinted(uint256 indexed tokenId, address indexed creator)"
];

export const LGR_PRICE_USD = 0.10; // $0.10 per LGR token
export const FACTORY_ADDRESS = "0x624dFf6455FBE2f569571fba31c7D020b905b745";
export const LGR_TOKEN_ADDRESS = "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00";
