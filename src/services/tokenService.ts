import { ethers } from "ethers";
import { TokenTransferStatus } from "@/lib/utils";

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

export const getTokenBalance = async (
  provider: ethers.providers.Web3Provider,
  tokenAddress: string,
  accountAddress: string
): Promise<string> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );

    const balance = await tokenContract.balanceOf(accountAddress);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error getting token balance:", error);
    throw error;
  }
};

/**
 * Verifies if the required tokens have been transferred to a specific address
 * @param provider Ethereum provider
 * @param tokenConfig Configuration of the tokens to verify
 * @param destinationAddress Address where tokens should be transferred
 * @returns Object with verification status and details
 */
export const verifyTokenTransfer = async (
  provider: ethers.providers.Provider,
  tokenConfig: {
    tokenAddress: string;
    tokenType: "erc20" | "erc721" | "erc1155";
    tokenIds?: string[];
    amount?: number;
  },
  destinationAddress: string
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens?: string[];
}> => {
  try {
    console.log("Verifying token transfer:", {
      tokenConfig,
      destinationAddress
    });
    
    if (tokenConfig.tokenType === "erc20") {
      return await verifyERC20Transfer(
        provider,
        tokenConfig.tokenAddress,
        destinationAddress,
        tokenConfig.amount?.toString() || "0"
      );
    } else if (tokenConfig.tokenType === "erc721" && tokenConfig.tokenIds) {
      return await verifyERC721Transfer(
        provider,
        tokenConfig.tokenAddress,
        destinationAddress,
        tokenConfig.tokenIds
      );
    } else if (tokenConfig.tokenType === "erc1155" && tokenConfig.tokenIds) {
      return await verifyERC1155Transfer(
        provider,
        tokenConfig.tokenAddress,
        destinationAddress,
        tokenConfig.tokenIds,
        tokenConfig.amount || 1
      );
    }
    
    return {
      status: "failed",
      currentAmount: "0",
      targetAmount: "0",
      missingTokens: []
    };
  } catch (error) {
    console.error("Error verifying token transfer:", error);
    return {
      status: "failed",
      currentAmount: "0",
      targetAmount: "0",
      missingTokens: []
    };
  }
};

/**
 * Verifies ERC20 token transfer
 */
const verifyERC20Transfer = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  destinationAddress: string,
  targetAmount: string
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
}> => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ["function balanceOf(address) view returns (uint256)"],
    provider
  );
  
  const targetAmountWei = targetAmount.includes('.')
    ? ethers.utils.parseUnits(targetAmount, 18)
    : ethers.BigNumber.from(targetAmount);
  
  const balance = await tokenContract.balanceOf(destinationAddress);
  const currentAmountFormatted = ethers.utils.formatUnits(balance, 18);
  const targetAmountFormatted = ethers.utils.formatUnits(targetAmountWei, 18);
  
  console.log("ERC20 verification result:", {
    tokenAddress,
    destinationAddress,
    currentBalance: currentAmountFormatted,
    targetAmount: targetAmountFormatted
  });
  
  let status: TokenTransferStatus = "awaiting_tokens";
  
  if (balance.gte(targetAmountWei)) {
    status = "completed";
  } else if (balance.gt(0)) {
    status = "verifying";
  }
  
  return {
    status,
    currentAmount: currentAmountFormatted,
    targetAmount: targetAmountFormatted
  };
};

/**
 * Verifies ERC721 token transfer (NFTs)
 */
const verifyERC721Transfer = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  destinationAddress: string,
  tokenIds: string[]
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens: string[];
}> => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [
      "function balanceOf(address) view returns (uint256)",
      "function ownerOf(uint256) view returns (address)"
    ],
    provider
  );
  
  const verificationResults = await Promise.all(
    tokenIds.map(async (tokenId) => {
      try {
        const owner = await tokenContract.ownerOf(tokenId);
        return {
          tokenId,
          owned: owner.toLowerCase() === destinationAddress.toLowerCase()
        };
      } catch (error) {
        return { tokenId, owned: false };
      }
    })
  );
  
  const ownedTokens = verificationResults.filter(r => r.owned);
  const missingTokens = verificationResults.filter(r => !r.owned).map(r => r.tokenId);
  
  console.log("ERC721 verification result:", {
    tokenAddress,
    destinationAddress,
    ownedCount: ownedTokens.length,
    totalCount: tokenIds.length,
    missingTokens
  });
  
  let status: TokenTransferStatus = "awaiting_tokens";
  
  if (ownedTokens.length === tokenIds.length) {
    status = "completed";
  } else if (ownedTokens.length > 0) {
    status = "verifying";
  }
  
  return {
    status,
    currentAmount: ownedTokens.length.toString(),
    targetAmount: tokenIds.length.toString(),
    missingTokens
  };
};

/**
 * Verifies ERC1155 token transfer (multi-token NFTs)
 */
const verifyERC1155Transfer = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  destinationAddress: string,
  tokenIds: string[],
  amount: number
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens: string[];
}> => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [
      "function balanceOf(address, uint256) view returns (uint256)"
    ],
    provider
  );
  
  const verificationResults = await Promise.all(
    tokenIds.map(async (tokenId) => {
      try {
        const balance = await tokenContract.balanceOf(destinationAddress, tokenId);
        return {
          tokenId,
          balance: balance.toNumber(),
          sufficient: balance.gte(amount)
        };
      } catch (error) {
        return { tokenId, balance: 0, sufficient: false };
      }
    })
  );
  
  const sufficientTokens = verificationResults.filter(r => r.sufficient);
  const missingTokens = verificationResults
    .filter(r => !r.sufficient)
    .map(r => `${r.tokenId} (${r.balance}/${amount})`);
  
  console.log("ERC1155 verification result:", {
    tokenAddress,
    destinationAddress,
    sufficientCount: sufficientTokens.length,
    totalCount: tokenIds.length,
    missingTokens
  });
  
  let status: TokenTransferStatus = "awaiting_tokens";
  
  if (sufficientTokens.length === tokenIds.length) {
    status = "completed";
  } else if (sufficientTokens.length > 0) {
    status = "verifying";
  }
  
  return {
    status,
    currentAmount: sufficientTokens.length.toString(),
    targetAmount: tokenIds.length.toString(),
    missingTokens
  };
};

/**
 * Generates a unique holding address for token transfers
 * This is a placeholder - in a real implementation, this would be a more
 * secure approach like creating a smart contract or using a multisig wallet
 */
export const generateHoldingAddress = async (
  provider: ethers.providers.Provider,
  creatorAddress: string,
  bountyId: string
): Promise<string> => {
  const abiCoder = new ethers.utils.AbiCoder();
  const encodedData = abiCoder.encode(
    ["address", "string", "uint256"],
    [creatorAddress, bountyId, Math.floor(Date.now() / 1000)]
  );
  
  const hash = ethers.utils.keccak256(encodedData);
  const wallet = new ethers.Wallet(hash.slice(0, 66));
  
  return wallet.address;
};
