
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

    const requiredAmountWei = ethers.utils.parseUnits(requiredAmount, 18);
    
    console.log("Checking allowance for:", {
      tokenAddress,
      owner: ownerAddress,
      spender: spenderAddress,
      requiredAmount,
      requiredAmountWei: requiredAmountWei.toString()
    });

    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    
    console.log("Allowance check:", {
      currentAllowance: ethers.utils.formatUnits(allowance, 18),
      requiredAmount,
      hasEnough: allowance.gte(requiredAmountWei)
    });

    return allowance.gte(requiredAmountWei);
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

    const amountWei = ethers.utils.parseUnits(amount, 18);

    console.log("Approving exact amount:", {
      token: tokenAddress,
      spender: spenderAddress,
      amount,
      amountWei: amountWei.toString()
    });

    // First check if we already have sufficient allowance
    const ownerAddress = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(ownerAddress, spenderAddress);

    if (currentAllowance.gte(amountWei)) {
      console.log("Sufficient allowance already exists");
      return {} as ethers.ContractTransaction;
    }

    // If we need to approve, proceed with exact amount
    return await tokenContract.approve(spenderAddress, amountWei);
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
