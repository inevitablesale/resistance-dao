
import { ethers } from "ethers";

export const checkTokenAllowance = async (
  provider: ethers.providers.Web3Provider,
  tokenAddress: string,
  owner: string,
  spender: string,
  requiredAmount: string
) => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function allowance(address,address) view returns (uint256)"],
      provider
    );

    // Convert required amount to wei if it's not already
    const requiredAmountWei = requiredAmount.includes('.')
      ? ethers.utils.parseUnits(requiredAmount, 18)
      : ethers.BigNumber.from(requiredAmount);

    console.log("Checking allowance for:", {
      tokenAddress,
      owner,
      spender,
      requiredAmount,
      requiredAmountWei: requiredAmountWei.toString()
    });

    const currentAllowance = await tokenContract.allowance(owner, spender);
    const hasEnough = currentAllowance.gte(requiredAmountWei);

    console.log("Allowance check:", {
      currentAllowance: ethers.utils.formatUnits(currentAllowance, 18),
      requiredAmount,
      hasEnough
    });

    return hasEnough;
  } catch (error) {
    console.error("Error checking allowance:", error);
    throw error;
  }
};

export const approveExactAmount = async (
  provider: ethers.providers.Web3Provider,
  tokenAddress: string,
  spenderAddress: string,
  amount: string
) => {
  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ["function approve(address,uint256) returns (bool)"],
    signer
  );

  // Convert amount to wei if it's not already
  const amountWei = amount.includes('.')
    ? ethers.utils.parseUnits(amount, 18)
    : ethers.BigNumber.from(amount);

  console.log("Approving exact amount:", {
    token: tokenAddress,
    spender: spenderAddress,
    amount,
    amountWei: amountWei.toString()
  });

  try {
    const tx = await tokenContract.approve(spenderAddress, amountWei);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error approving token:", error);
    throw error;
  }
};
