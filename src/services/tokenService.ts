
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
  requiredAmount: ethers.BigNumber
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
      requiredAmount: ethers.utils.formatUnits(requiredAmount, 18)
    });

    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    
    console.log("Allowance check:", {
      current: ethers.utils.formatUnits(allowance, 18),
      required: ethers.utils.formatUnits(requiredAmount, 18),
      hasEnough: allowance.gte(requiredAmount)
    });

    return allowance.gte(requiredAmount);
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
  amount: string | ethers.BigNumber // Allow both string and BigNumber input
): Promise<ethers.ContractTransaction> => {
  try {
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      signer
    );

    // Convert string amount to BigNumber if needed
    const amountBN = ethers.BigNumber.isBigNumber(amount) 
      ? amount 
      : ethers.utils.parseUnits(amount, 18);

    console.log("Approving exact amount:", {
      token: tokenAddress,
      spender: spenderAddress,
      amountFormatted: ethers.utils.formatUnits(amountBN, 18),
      amountWei: amountBN.toString()
    });

    // First check if we already have sufficient allowance
    const ownerAddress = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(ownerAddress, spenderAddress);

    if (currentAllowance.gte(amountBN)) {
      console.log("Sufficient allowance already exists");
      return {} as ethers.ContractTransaction; // Return empty transaction as no approval needed
    }

    // If we need to approve, proceed with exact amount
    return await tokenContract.approve(
      spenderAddress, 
      amountBN
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
