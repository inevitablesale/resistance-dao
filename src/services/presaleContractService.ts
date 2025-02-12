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
export const TOTAL_PRESALE_SUPPLY = ethers.utils.parseUnits("5", 24); // 5 million tokens with 18 decimals
export const USD_PRICE = ethers.utils.parseUnits("0.1", 18); // $0.10 per token

// Array of RPC endpoints for redundancy
export const RPC_ENDPOINTS = [
  "https://polygon-mainnet.g.alchemy.com/v2/demo",  // Alchemy's public endpoint
  "https://polygon.llamarpc.com",                   // LlamaRPC endpoint
  "https://polygon.rpc.blxrbdn.com",               // Blockdaemon endpoint
  "https://polygon-rpc.com",                       // Original endpoint as fallback
  "https://rpc-mainnet.matic.network",
  "https://matic-mainnet.chainstacklabs.com"
];

// Function to get a working RPC provider with improved error handling
export const getWorkingProvider = async () => {
  let lastError;
  for (const rpc of RPC_ENDPOINTS) {
    try {
      console.log(`Attempting to connect to RPC endpoint: ${rpc}`);
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      // Test the connection with a simple call
      await provider.getNetwork();
      console.log(`Successfully connected to RPC endpoint: ${rpc}`);
      return provider;
    } catch (error) {
      console.warn(`RPC ${rpc} failed:`, error);
      lastError = error;
      continue;
    }
  }
  throw new Error(`All RPC endpoints failed. Last error: ${lastError?.message}`);
};

export const getPresaleContract = async (providerOrSigner: ethers.providers.Provider | ethers.Signer) => {
  return new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_ABI, providerOrSigner);
};

// Function to get LGR token contract
export const getLgrTokenContract = async (provider: ethers.providers.Provider) => {
  const presaleContract = await getPresaleContract(provider);
  const lgrTokenAddress = await presaleContract.lgrToken();
  return new ethers.Contract(lgrTokenAddress, ERC20_ABI, provider);
};

// Function to fetch total LGR sold by checking contract's token balance
export const fetchTotalLGRSold = async () => {
  try {
    const provider = await getWorkingProvider();
    const lgrTokenContract = await getLgrTokenContract(provider);
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
    const provider = await getWorkingProvider();
    const lgrTokenContract = await getLgrTokenContract(provider);
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
    const provider = await getWorkingProvider();
    const contract = await getPresaleContract(provider);
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
    const provider = await getWorkingProvider();
    const contract = await getPresaleContract(provider);
    const maticPrice = await contract.getLGRPrice();
    const formattedPrice = Number(ethers.utils.formatEther(maticPrice)).toFixed(4);
    return formattedPrice;
  } catch (error) {
    console.error("Error fetching MATIC price:", error);
    return "0";
  }
};

// Function to purchase tokens
export const purchaseTokens = async (signer: ethers.Signer, maticAmount: string) => {
  try {
    console.log('Starting token purchase with MATIC amount:', maticAmount);
    
    const contract = await getPresaleContract(signer);
    
    // Get current LGR price in MATIC
    const maticPrice = await contract.getLGRPrice();
    console.log('Current MATIC price per token:', ethers.utils.formatEther(maticPrice));
    
    // Calculate expected number of tokens
    const maticAmountWei = ethers.utils.parseEther(maticAmount);
    const expectedTokens = maticAmountWei.mul(ethers.utils.parseEther("1")).div(maticPrice);
    console.log('Expected tokens:', ethers.utils.formatEther(expectedTokens));
    
    // Add 1% slippage protection
    const minExpectedTokens = expectedTokens.mul(99).div(100);
    console.log('Min expected tokens with 1% slippage:', ethers.utils.formatEther(minExpectedTokens));

    // Execute purchase transaction
    const tx = await contract.buyTokens(minExpectedTokens, {
      value: maticAmountWei
    });
    
    console.log('Purchase transaction submitted:', tx.hash);
    const receipt = await tx.wait();
    console.log('Purchase confirmed in block:', receipt.blockNumber);
    
    return {
      success: true,
      txHash: tx.hash,
      amount: ethers.utils.formatEther(expectedTokens)
    };
  } catch (error) {
    console.error('Error purchasing tokens:', error);
    throw error;
  }
};
