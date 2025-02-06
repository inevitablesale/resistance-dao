
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
  "function presaleEnd() public view returns (uint256)",
  "function lgrToken() public view returns (address)"
];

// ERC20 Interface for token balance checks
const ERC20_ABI = [
  "function balanceOf(address account) public view returns (uint256)"
];

export const PRESALE_END_TIME = 1746057600; // May 1, 2025
export const TOTAL_PRESALE_SUPPLY = ethers.utils.parseUnits("5000000", 18); // 5 million tokens with 18 decimals
export const USD_PRICE = ethers.utils.parseUnits("0.1", 18); // $0.10 per token

export const getPresaleContract = (provider: ethers.providers.Provider | ethers.Signer) => {
  return new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, provider);
};

// Function to get LGR token contract
const getLGRTokenContract = async (provider: ethers.providers.Provider) => {
  const presaleContract = getPresaleContract(provider);
  const lgrTokenAddress = await presaleContract.lgrToken();
  return new ethers.Contract(lgrTokenAddress, ERC20_ABI, provider);
};

// Function to fetch total LGR sold by checking contract's token balance
export const fetchTotalLGRSold = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
    const lgrTokenContract = await getLGRTokenContract(provider);
    const remainingBalance = await lgrTokenContract.balanceOf(PRESALE_CONTRACT_ADDRESS);
    const totalSold = TOTAL_PRESALE_SUPPLY.sub(remainingBalance);
    const formattedAmount = Number(ethers.utils.formatUnits(totalSold, 18)).toFixed(2);
    return formattedAmount;
  } catch (error) {
    console.error("Error fetching total LGR sold:", error);
    return "0";
  }
};

// Function to fetch remaining presale supply
export const fetchRemainingPresaleSupply = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
    const lgrTokenContract = await getLGRTokenContract(provider);
    const remainingBalance = await lgrTokenContract.balanceOf(PRESALE_CONTRACT_ADDRESS);
    return ethers.utils.formatUnits(remainingBalance, 18);
  } catch (error) {
    console.error("Error fetching remaining presale supply:", error);
    return ethers.utils.formatUnits(TOTAL_PRESALE_SUPPLY, 18);
  }
};

// Function to fetch presale price in USD (fixed at $0.10)
export const fetchPresaleUSDPrice = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
    const contract = getPresaleContract(provider);
    const usdPrice = await contract.PRESALE_USD_PRICE();
    return ethers.utils.formatUnits(usdPrice, 18);
  } catch (error) {
    console.error("Error fetching USD price:", error);
    return ethers.utils.formatUnits(USD_PRICE, 18);
  }
};

// Function to fetch latest MATIC price and convert presale price to MATIC
export const fetchPresaleMaticPrice = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com");
    const contract = getPresaleContract(provider);
    const maticPrice = await contract.getLGRPrice();
    const formattedPrice = Number(ethers.utils.formatEther(maticPrice)).toFixed(4);
    return formattedPrice;
  } catch (error) {
    console.error("Error fetching MATIC price:", error);
    return "0";
  }
};

