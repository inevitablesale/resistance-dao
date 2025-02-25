
import { ethers } from "ethers";

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

export const checkTokenAllowance = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  requiredAmount: string
): Promise<boolean> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    console.log("Checking allowance for:", {
      tokenAddress,
      owner: ownerAddress,
      spender: spenderAddress,
      requiredAmount
    });

    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    // Parse the required amount, handling both decimal and non-decimal strings
    const requiredAmountBN = ethers.utils.parseUnits(requiredAmount.toString().replace(/\.0$/, ''), 18);
    
    console.log("Allowance check:", {
      current: ethers.utils.formatUnits(allowance, 18),
      required: ethers.utils.formatUnits(requiredAmountBN, 18),
      hasEnough: allowance.gte(requiredAmountBN)
    });

    return allowance.gte(requiredAmountBN);
  } catch (error) {
    console.error('Error checking token allowance:', error);
    return false;
  }
};

export const getTokenAllowance = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<string> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    return ethers.utils.formatUnits(allowance, 18);
  } catch (error) {
    console.error('Error getting token allowance:', error);
    return '0';
  }
};

export const approveExactAmount = async (
  provider: ethers.providers.Web3Provider,
  tokenAddress: string,
  spenderAddress: string,
  amount: string
): Promise<ethers.ContractTransaction> => {
  try {
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      signer
    );

    // Clean the amount string and convert to wei
    const cleanAmount = amount.toString().replace(/\.0$/, '');
    const amountInWei = ethers.utils.parseUnits(cleanAmount, 18);

    console.log("Approving exact amount:", {
      token: tokenAddress,
      spender: spenderAddress,
      amount: amount,
      amountWei: amountInWei.toString()
    });

    // First check if we already have sufficient allowance
    const ownerAddress = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(ownerAddress, spenderAddress);

    if (currentAllowance.gte(amountInWei)) {
      console.log("Sufficient allowance already exists");
      return {} as ethers.ContractTransaction; // Return empty transaction as no approval needed
    }

    // If we need to approve, proceed with exact amount
    return await tokenContract.approve(
      spenderAddress, 
      amountInWei
    );
  } catch (error) {
    console.error('Error approving tokens:', error);
    throw error;
  }
};

export const getTokenBalance = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  ownerAddress: string
): Promise<string> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const balance = await tokenContract.balanceOf(ownerAddress);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};
