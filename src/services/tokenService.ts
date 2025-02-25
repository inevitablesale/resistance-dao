
import { ethers } from "ethers";
import { WalletType } from "@/hooks/useWalletProvider";

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
  requiredAmount: ethers.BigNumber,
  walletType?: WalletType
): Promise<boolean> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    console.log("Checking allowance for wallet type:", walletType);

    // For ZeroDev wallets, we assume allowance is always sufficient
    if (walletType === 'zerodev') {
      console.log("ZeroDev wallet detected, skipping allowance check");
      return true;
    }

    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    
    console.log("Allowance check:", {
      walletType,
      tokenAddress,
      owner: ownerAddress,
      spender: spenderAddress,
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
  amount: ethers.BigNumber,
  walletType?: WalletType
): Promise<ethers.ContractTransaction> => {
  try {
    // For ZeroDev wallets, we skip the approval
    if (walletType === 'zerodev') {
      console.log("ZeroDev wallet detected, skipping token approval");
      return {} as ethers.ContractTransaction;
    }

    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      signer
    );

    console.log("Approving exact amount:", {
      walletType,
      token: tokenAddress,
      spender: spenderAddress,
      amount: ethers.utils.formatUnits(amount, 18),
      amountWei: amount.toString()
    });

    // First check if we already have sufficient allowance
    const ownerAddress = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(ownerAddress, spenderAddress);

    if (currentAllowance.gte(amount)) {
      console.log("Sufficient allowance already exists");
      return {} as ethers.ContractTransaction;
    }

    // If we need to approve, proceed with exact amount
    return await tokenContract.approve(
      spenderAddress, 
      amount
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
