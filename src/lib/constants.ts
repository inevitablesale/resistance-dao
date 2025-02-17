
export const CONTRACT_ADDRESS = "0x123..."; // Replace with actual contract address
export const CONTRACT_ABI = [
  "function proposals(uint256) public view returns (uint256 id, address proposer, string description, uint256 amount, uint8 status)",
  "function vote(uint256 proposalId, bool support) public",
  "function execute(uint256 proposalId) public",
  "function cancel(uint256 proposalId) public"
];
