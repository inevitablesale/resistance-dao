
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";

export const checkTokenAllowance = async (
  provider: ethers.providers.Web3Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  requiredAmount: string
): Promise<boolean> => {
  try {
    console.log('Checking token allowance:', {
      token: tokenAddress,
      owner: ownerAddress,
      spender: spenderAddress,
      required: ethers.utils.formatEther(requiredAmount)
    });

    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function allowance(address owner, address spender) view returns (uint256)",
        "function balanceOf(address account) view returns (uint256)"
      ],
      provider
    );

    const [allowance, balance] = await Promise.all([
      tokenContract.allowance(ownerAddress, spenderAddress),
      tokenContract.balanceOf(ownerAddress)
    ]);

    console.log('Token check results:', {
      currentAllowance: ethers.utils.formatEther(allowance),
      currentBalance: ethers.utils.formatEther(balance),
      requiredAmount: ethers.utils.formatEther(requiredAmount)
    });

    if (balance.lt(requiredAmount)) {
      throw new ProposalError({
        category: 'token',
        message: `Insufficient balance. Required: ${ethers.utils.formatEther(requiredAmount)} LGR, Current: ${ethers.utils.formatEther(balance)} LGR`,
        recoverySteps: ['Get more LGR tokens']
      });
    }

    return allowance.gte(requiredAmount);
  } catch (error) {
    console.error('Token allowance check error:', error);
    if (error instanceof ProposalError) {
      throw error;
    }
    throw new ProposalError({
      category: 'token',
      message: 'Failed to check token allowance',
      recoverySteps: ['Try again', 'Check your wallet connection']
    });
  }
};

export const getTokenBalance = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  accountAddress: string
): Promise<string> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function balanceOf(address account) view returns (uint256)"],
      provider
    );

    const balance = await tokenContract.balanceOf(accountAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Get token balance error:', error);
    throw new ProposalError({
      category: 'token',
      message: 'Failed to fetch token balance',
      recoverySteps: ['Try again', 'Check your wallet connection']
    });
  }
};
