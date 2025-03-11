
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
  try {
    // Get the current network
    const network = await provider.getNetwork();
    const factoryAddress = HOLDING_FACTORY_ADDRESSES[network.chainId];
    
    if (!factoryAddress || factoryAddress === ethers.constants.AddressZero) {
      console.warn(`No holding factory deployed on network ${network.chainId}, falling back to deterministic address`);
      // Fallback to deterministic address generation if no factory is available
      return generateDeterministicAddress(creatorAddress, bountyId);
    }
    
    // Get a signer if the provider has one
    let signer: ethers.Signer;
    if ((provider as ethers.providers.Web3Provider).getSigner) {
      signer = (provider as ethers.providers.Web3Provider).getSigner();
    } else {
      throw new Error("Provider must be a Web3Provider with a signer to deploy holding contracts");
    }
    
    // Create factory contract instance
    const factory = new ethers.Contract(
      factoryAddress,
      HOLDING_FACTORY_ABI,
      signer
    );
    
    // Check if a holding contract already exists for this creator and bounty
    const existingAddress = await factory.getHoldingContract(creatorAddress, bountyId);
    
    if (existingAddress && existingAddress !== ethers.constants.AddressZero) {
      console.log(`Existing holding contract found at ${existingAddress}`);
      return existingAddress;
    }
    
    // Deploy a new holding contract
    console.log(`Deploying new holding contract for bounty ${bountyId}`);
    const tx = await factory.createHoldingContract(creatorAddress, bountyId);
    const receipt = await tx.wait();
    
    // Extract the deployed contract address from event logs
    let holdingAddress = ethers.constants.AddressZero;
    
    for (const log of receipt.logs) {
      try {
        const parsedLog = factory.interface.parseLog(log);
        if (parsedLog.name === "HoldingContractCreated") {
          holdingAddress = parsedLog.args.contractAddress;
          break;
        }
      } catch (error) {
        // Not the event we're looking for
        continue;
      }
    }
    
    if (holdingAddress === ethers.constants.AddressZero) {
      throw new Error("Failed to extract holding contract address from transaction receipt");
    }
    
    console.log(`Holding contract deployed at ${holdingAddress}`);
    return holdingAddress;
  } catch (error) {
    console.error("Error generating secure holding address:", error);
    // Fallback to deterministic address generation
    console.warn("Falling back to deterministic address generation");
    return generateDeterministicAddress(creatorAddress, bountyId);
  }
};

/**
 * Fallback method to generate a deterministic address from a hash
 * @param creatorAddress Address of the bounty creator
 * @param bountyId Unique identifier for the bounty
 * @returns A deterministic Ethereum address
 */
const generateDeterministicAddress = (
  creatorAddress: string,
  bountyId: string
): string => {
  const abiCoder = new ethers.utils.AbiCoder();
  const encodedData = abiCoder.encode(
    ["address", "string", "uint256"],
    [creatorAddress, bountyId, Math.floor(Date.now() / 1000)]
  );
  
  const hash = ethers.utils.keccak256(encodedData);
  const wallet = new ethers.Wallet(hash.slice(0, 66));
  
  console.warn(`Generated deterministic address ${wallet.address} - THIS IS NOT SECURE FOR PRODUCTION`);
  return wallet.address;
};

/**
 * Adds an authorized user to a holding contract
 * @param provider Ethereum provider with signer
 * @param holdingAddress Address of the holding contract
 * @param userAddress Address to authorize
 * @returns Promise resolving to the transaction receipt
 */
export const addAuthorizedUser = async (
  provider: ethers.providers.Web3Provider,
  holdingAddress: string,
  userAddress: string
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = provider.getSigner();
    const holdingContract = new ethers.Contract(
      holdingAddress,
      HOLDING_CONTRACT_ABI,
      signer
    );
    
    // Check if the address is a holding contract
    if (await isHoldingContract(provider, holdingAddress)) {
      const tx = await holdingContract.addAuthorizedUser(userAddress);
      return await tx.wait();
    } else {
      throw new Error("The address is not a recognized holding contract");
    }
  } catch (error) {
    console.error("Error adding authorized user:", error);
    throw error;
  }
};

/**
 * Checks if an address is a valid holding contract
 * @param provider Ethereum provider
 * @param contractAddress Address to check
 * @returns Promise resolving to boolean indicating if the address is a holding contract
 */
export const isHoldingContract = async (
  provider: ethers.providers.Provider,
  contractAddress: string
): Promise<boolean> => {
  try {
    const network = await provider.getNetwork();
    const factoryAddress = HOLDING_FACTORY_ADDRESSES[network.chainId];
    
    if (!factoryAddress || factoryAddress === ethers.constants.AddressZero) {
      // If no factory is deployed, we can't verify
      return false;
    }
    
    const factory = new ethers.Contract(
      factoryAddress,
      HOLDING_FACTORY_ABI,
      provider
    );
    
    return await factory.isHoldingContract(contractAddress);
  } catch (error) {
    console.error("Error checking if address is a holding contract:", error);
    return false;
  }
};

/**
 * Performs an emergency withdrawal from a holding contract
 * @param provider Ethereum provider with signer
 * @param holdingAddress Address of the holding contract
 * @param tokenAddress Address of the token to withdraw (use ethers.constants.AddressZero for ETH)
 * @param recipientAddress Address to send the withdrawn tokens to
 * @returns Promise resolving to the transaction receipt
 */
export const emergencyWithdraw = async (
  provider: ethers.providers.Web3Provider,
  holdingAddress: string,
  tokenAddress: string,
  recipientAddress: string
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = provider.getSigner();
    const holdingContract = new ethers.Contract(
      holdingAddress,
      HOLDING_CONTRACT_ABI,
      signer
    );
    
    // Verify this is a valid holding contract
    if (!(await isHoldingContract(provider, holdingAddress))) {
      throw new Error("The address is not a recognized holding contract");
    }
    
    // Verify the caller is authorized
    const signerAddress = await signer.getAddress();
    if (!(await holdingContract.isAuthorized(signerAddress))) {
      throw new Error("Caller is not authorized to perform emergency withdrawals");
    }
    
    const tx = await holdingContract.emergencyWithdraw(
      tokenAddress,
      recipientAddress
    );
    
    return await tx.wait();
  } catch (error) {
    console.error("Error performing emergency withdrawal:", error);
    throw error;
  }
};

/**
 * Withdraws tokens from a holding contract to a recipient
 * @param provider Ethereum provider with signer
 * @param holdingAddress Address of the holding contract
 * @param tokenAddress Address of the token to withdraw
 * @param recipientAddress Address to send the tokens to
 * @param amount Amount to withdraw (in token units)
 * @returns Promise resolving to the transaction receipt
 */
export const withdrawToken = async (
  provider: ethers.providers.Web3Provider,
  holdingAddress: string,
  tokenAddress: string,
  recipientAddress: string,
  amount: string
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = provider.getSigner();
    const holdingContract = new ethers.Contract(
      holdingAddress,
      HOLDING_CONTRACT_ABI,
      signer
    );
    
    // Verify this is a valid holding contract
    if (!(await isHoldingContract(provider, holdingAddress))) {
      throw new Error("The address is not a recognized holding contract");
    }
    
    // Verify the caller is authorized
    const signerAddress = await signer.getAddress();
    if (!(await holdingContract.isAuthorized(signerAddress))) {
      throw new Error("Caller is not authorized to withdraw tokens");
    }
    
    // Convert amount to wei
    const amountWei = amount.includes('.')
      ? ethers.utils.parseUnits(amount, 18)
      : ethers.BigNumber.from(amount);
    
    // Perform the withdrawal
    const tx = await holdingContract.withdrawToken(
      tokenAddress,
      recipientAddress,
      amountWei
    );
    
    return await tx.wait();
  } catch (error) {
    console.error("Error withdrawing tokens:", error);
    throw error;
  }
};

/**
 * Withdraws an ERC721 token from a holding contract
 * @param provider Ethereum provider with signer
 * @param holdingAddress Address of the holding contract
 * @param tokenAddress Address of the ERC721 token
 * @param recipientAddress Address to send the token to
 * @param tokenId ID of the token to withdraw
 * @returns Promise resolving to the transaction receipt
 */
export const withdrawERC721 = async (
  provider: ethers.providers.Web3Provider,
  holdingAddress: string,
  tokenAddress: string,
  recipientAddress: string,
  tokenId: string
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = provider.getSigner();
    const holdingContract = new ethers.Contract(
      holdingAddress,
      HOLDING_CONTRACT_ABI,
      signer
    );
    
    // Verify this is a valid holding contract
    if (!(await isHoldingContract(provider, holdingAddress))) {
      throw new Error("The address is not a recognized holding contract");
    }
    
    // Verify the caller is authorized
    const signerAddress = await signer.getAddress();
    if (!(await holdingContract.isAuthorized(signerAddress))) {
      throw new Error("Caller is not authorized to withdraw tokens");
    }
    
    // Perform the withdrawal
    const tx = await holdingContract.withdrawERC721(
      tokenAddress,
      recipientAddress,
      ethers.BigNumber.from(tokenId)
    );
    
    return await tx.wait();
  } catch (error) {
    console.error("Error withdrawing ERC721 token:", error);
    throw error;
  }
};

// Holding contract factory ABI - used to deploy secure holding contracts
const HOLDING_FACTORY_ABI = [
  "function createHoldingContract(address creator, string memory bountyId) external returns (address)",
  "function getHoldingContract(address creator, string memory bountyId) external view returns (address)",
  "function isHoldingContract(address contractAddress) external view returns (bool)"
];

// Holding contract ABI - used to interact with deployed holding contracts
const HOLDING_CONTRACT_ABI = [
  "function creator() external view returns (address)",
  "function bountyId() external view returns (string memory)",
  "function withdrawToken(address token, address recipient, uint256 amount) external",
  "function withdrawETH(address payable recipient, uint256 amount) external",
  "function withdrawERC721(address token, address recipient, uint256 tokenId) external",
  "function withdrawERC1155(address token, address recipient, uint256 tokenId, uint256 amount) external",
  "function emergencyWithdraw(address token, address payable recipient) external",
  "function addAuthorizedUser(address user) external",
  "function removeAuthorizedUser(address user) external",
  "function isAuthorized(address user) external view returns (bool)"
];

// Addresses of deployed factory contracts on different networks
const HOLDING_FACTORY_ADDRESSES: { [chainId: number]: string } = {
  1: "0x1ca20040ce6ad406bc2a6c89976388829e7fbade", // Ethereum Mainnet
  5: "0x753e22d4e112a4d8b07df9c4c578b116e3b48792", // Goerli
  137: "0xcEDe25DF327bD1619Fe25CDa2292e14edAC30717", // Polygon Mainnet
  80001: "0x1b0e8E8DC71b29CE49038569dEF1B3Bc0120F602", // Mumbai Testnet
  8453: "0x0b7b86DCEAa8015CeD8F625d3b7A961b31fB05FE", // Base Mainnet
  84531: "0x510c2F7e19a8f2537A3fe3Cf847e6583b993FA60", // Base Goerli Testnet
  // Add other networks as needed
};
