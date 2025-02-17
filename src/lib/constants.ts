
export const CONTRACT_ADDRESS = "0x123..."; // Replace with actual contract address
export const CONTRACT_ABI = [
  "function proposals(uint256) public view returns (uint256 id, address proposer, string description, uint256 amount, uint8 status)",
  "function vote(uint256 proposalId, bool support) public",
  "function execute(uint256 proposalId) public",
  "function cancel(uint256 proposalId) public"
];

export const LGR_PRICE_USD = 0.10; // $0.10 per LGR token
export const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds

// Target capital in LGR (not wei)
export const MIN_TARGET_CAPITAL = "1000"; // 1,000 LGR
export const MAX_TARGET_CAPITAL = "25000000"; // 25M LGR
