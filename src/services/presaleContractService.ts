
import { ethers } from "ethers";

export const PRESALE_CONTRACT_ADDRESS = "0xC0c47EE9300653ac9D333c16eC6A99C66b2cE72c";

// Simplified ABI with just the functions we need
export const PRESALE_ABI = [
  "function getLGRPrice() public view returns (uint256)",
  "function getLatestMaticPrice() public view returns (uint256)",
  "function buyTokens(uint256 minExpectedTokens) external payable",
  "function purchasedTokens(address) public view returns (uint256)",
  "function PRESALE_SUPPLY() public view returns (uint256)",
  "function MAX_PER_WALLET() public view returns (uint256)",
  "function PRESALE_USD_PRICE() public view returns (uint256)",
  "function presaleEndTime() public view returns (uint256)",
  "function totalLGRSold() public view returns (uint256)",
  "function stakeableTokens(address) public view returns (uint256)"
];

export const PRESALE_END_TIME = 1746057600; // May 1, 2025
export const TOTAL_PRESALE_SUPPLY = 5000000; // 5 million tokens
export const USD_PRICE = 0.1; // $0.10 per token

export const getPresaleContract = (provider: ethers.providers.Provider | ethers.Signer) => {
  return new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, provider);
};
