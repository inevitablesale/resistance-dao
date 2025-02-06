
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

// Function to fetch total LGR sold
export const fetchTotalLGRSold = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
    const contract = getPresaleContract(provider);
    const totalSold = await contract.totalLGRSold();
    const formattedTotal = ethers.utils.formatUnits(totalSold, 18);
    return parseFloat(formattedTotal).toLocaleString();
  } catch (error) {
    console.error("Error fetching total LGR sold:", error);
    return "0";
  }
};

// Function to fetch remaining presale supply
export const fetchRemainingPresaleSupply = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
    const contract = getPresaleContract(provider);
    const presaleSupply = await contract.PRESALE_SUPPLY();
    const totalSold = await contract.totalLGRSold();
    const remaining = presaleSupply.sub(totalSold);
    const formattedRemaining = ethers.utils.formatUnits(remaining, 18);
    return parseFloat(formattedRemaining).toLocaleString();
  } catch (error) {
    console.error("Error fetching remaining presale supply:", error);
    return TOTAL_PRESALE_SUPPLY.toString();
  }
};

// Function to fetch presale price in USD
export const fetchPresaleUSDPrice = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
    const contract = getPresaleContract(provider);
    const usdPrice = await contract.PRESALE_USD_PRICE();
    const formattedPrice = ethers.utils.formatUnits(usdPrice, 18);
    return parseFloat(formattedPrice).toFixed(2);
  } catch (error) {
    console.error("Error fetching USD price:", error);
    return USD_PRICE.toString();
  }
};

// Function to fetch latest MATIC price and convert presale price to MATIC
export const fetchPresaleMaticPrice = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
    const contract = getPresaleContract(provider);
    const maticPrice = await contract.getLGRPrice();
    const formattedPrice = ethers.utils.formatUnits(maticPrice, 18);
    return parseFloat(formattedPrice).toFixed(4);
  } catch (error) {
    console.error("Error fetching MATIC price:", error);
    return "0";
  }
};
