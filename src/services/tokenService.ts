
import { ethers } from "ethers";
import { ProposalError } from "./errorHandlingService";
import { TokenTransferStatus } from "@/lib/utils";
import { HOLDING_FACTORY_ADDRESSES, HOLDING_FACTORY_ABI, SECURITY_LEVELS } from "@/lib/constants/contracts";

// ERC20 Interface
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

// ERC721 Interface
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function transferFrom(address from, address to, uint256 tokenId)"
];

// ERC1155 Interface
const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) view returns (uint256[] memory)",
  "function isApprovedForAll(address account, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data)"
];

// Holding Contract ABI
const HOLDING_CONTRACT_ABI = [
  "function withdraw(address token, address recipient, uint256 amount) external",
  "function withdrawERC721(address token, address recipient, uint256 tokenId) external",
  "function withdrawERC1155(address token, address recipient, uint256 tokenId, uint256 amount) external",
  "function emergencyWithdraw(address token, address recipient) external",
  "function getCreator() external view returns (address)",
  "function getBountyId() external view returns (string)",
  "function getSecurityLevel() external view returns (uint8)"
];

/**
 * Checks if an address is a valid holding contract for bounties
 * @param provider Ethereum provider
 * @param contractAddress Address to check
 * @returns Promise resolving to boolean indicating if it's a holding contract
 */
export const isHoldingContract = async (
  provider: ethers.providers.Provider,
  contractAddress: string
): Promise<boolean> => {
  try {
    // First, verify it's a contract
    const code = await provider.getCode(contractAddress);
    if (code === '0x') return false;
    
    // Get the current network
    const network = await provider.getNetwork();
    const factoryAddress = HOLDING_FACTORY_ADDRESSES[network.chainId];
    
    if (!factoryAddress || factoryAddress === ethers.constants.AddressZero) {
      console.warn(`No holding factory deployed on network ${network.chainId}, falling back to basic check`);
      
      // Fallback to checking for the minimal interface
      try {
        const contract = new ethers.Contract(contractAddress, ["function getCreator() view returns (address)"], provider);
        await contract.getCreator();
        return true;
      } catch (error) {
        return false;
      }
    }
    
    // Use the factory to check if this is a deployed holding contract
    const factory = new ethers.Contract(factoryAddress, HOLDING_FACTORY_ABI, provider);
    return await factory.isHoldingContract(contractAddress);
  } catch (error) {
    console.error("Error checking holding contract:", error);
    return false;
  }
};

/**
 * Generates a unique holding address for token transfers
 * @param provider Ethereum provider
 * @param creatorAddress Address of the bounty creator
 * @param bountyId Unique identifier for the bounty
 * @returns Promise resolving to the holding contract address
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
    
    // Check if the contract was already deployed
    const factory = new ethers.Contract(factoryAddress, HOLDING_FACTORY_ABI, provider);
    const existingAddress = await factory.getHoldingContract(creatorAddress, bountyId);
    
    if (existingAddress && existingAddress !== ethers.constants.AddressZero) {
      console.log("Found existing holding contract:", existingAddress);
      return existingAddress;
    }
    
    // Deploy a new holding contract
    const factoryWithSigner = factory.connect(signer);
    const securityLevel = SECURITY_LEVELS.BASIC; // Default to basic security
    
    console.log(`Deploying holding contract for ${creatorAddress} and bounty ${bountyId}`);
    const tx = await factoryWithSigner.deployHoldingContract(creatorAddress, bountyId, securityLevel);
    const receipt = await tx.wait();
    
    // Extract the deployed contract address from the transaction receipt
    let deployedAddress = '';
    for (const log of receipt.logs) {
      try {
        const parsedLog = factory.interface.parseLog(log);
        if (parsedLog.name === 'HoldingContractDeployed') {
          deployedAddress = parsedLog.args.contractAddress;
          break;
        }
      } catch (error) {
        // Not the event we're looking for
        continue;
      }
    }
    
    if (!deployedAddress) {
      throw new Error("Failed to extract deployed contract address from receipt");
    }
    
    console.log(`Holding contract deployed at ${deployedAddress}`);
    return deployedAddress;
  } catch (error) {
    console.error("Error generating holding address:", error);
    throw new ProposalError({
      category: 'transaction',
      message: `Failed to generate holding address: ${error instanceof Error ? error.message : 'Unknown error'}`,
      recoverySteps: [
        'Check your wallet connection',
        'Make sure you have enough funds for gas',
        'Try again later'
      ]
    });
  }
};

/**
 * Generates a deterministic address using a hash of creator and bounty ID
 * This is a fallback when no factory is available
 */
const generateDeterministicAddress = (
  creatorAddress: string,
  bountyId: string
): string => {
  // Create a hash of the creator address and bounty ID
  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "string"],
      [creatorAddress, bountyId]
    )
  );
  
  // Use the hash to create a deterministic address
  // This doesn't create a real contract, just a unique address
  return ethers.utils.getAddress('0x' + hash.slice(-40));
};

/**
 * Verifies if tokens have been transferred to a holding address
 * @param provider Ethereum provider
 * @param tokenConfig Token configuration details
 * @param holdingAddress Address of the holding contract
 * @returns Promise resolving to verification status
 */
export const verifyTokenTransfer = async (
  provider: ethers.providers.Provider,
  tokenConfig: {
    tokenAddress: string;
    tokenType: "erc20" | "erc721" | "erc1155";
    tokenIds?: string[];
    amount?: number;
  },
  holdingAddress: string
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens?: string[];
}> => {
  try {
    console.log("Verifying token transfer:", { tokenConfig, holdingAddress });
    
    // Verify the holding address is a contract
    const isContract = await provider.getCode(holdingAddress);
    if (isContract === '0x') {
      return {
        status: 'failed',
        currentAmount: '0',
        targetAmount: tokenConfig.amount?.toString() || '0',
        missingTokens: []
      };
    }
    
    // Different verification based on token type
    if (tokenConfig.tokenType === "erc20") {
      return await verifyERC20Transfer(provider, tokenConfig, holdingAddress);
    } else if (tokenConfig.tokenType === "erc721" && tokenConfig.tokenIds) {
      return await verifyERC721Transfer(provider, tokenConfig, holdingAddress);
    } else if (tokenConfig.tokenType === "erc1155" && tokenConfig.tokenIds) {
      return await verifyERC1155Transfer(provider, tokenConfig, holdingAddress);
    }
    
    return {
      status: 'failed',
      currentAmount: '0',
      targetAmount: '0',
      missingTokens: []
    };
  } catch (error) {
    console.error("Error verifying token transfer:", error);
    return {
      status: 'failed',
      currentAmount: '0',
      targetAmount: tokenConfig.amount?.toString() || '0',
      missingTokens: []
    };
  }
};

// Helper function to verify ERC20 token transfers
const verifyERC20Transfer = async (
  provider: ethers.providers.Provider,
  tokenConfig: {
    tokenAddress: string;
    amount?: number;
  },
  holdingAddress: string
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
}> => {
  try {
    const token = new ethers.Contract(tokenConfig.tokenAddress, ERC20_ABI, provider);
    const balance = await token.balanceOf(holdingAddress);
    const decimals = await token.decimals();
    
    const targetAmount = tokenConfig.amount || 0;
    const currentAmount = parseFloat(ethers.utils.formatUnits(balance, decimals));
    
    console.log(`ERC20 verification: ${currentAmount} / ${targetAmount}`);
    
    if (currentAmount >= targetAmount) {
      return {
        status: 'completed',
        currentAmount: currentAmount.toString(),
        targetAmount: targetAmount.toString()
      };
    } else if (currentAmount > 0) {
      return {
        status: 'verifying',
        currentAmount: currentAmount.toString(),
        targetAmount: targetAmount.toString()
      };
    }
    
    return {
      status: 'awaiting_tokens',
      currentAmount: '0',
      targetAmount: targetAmount.toString()
    };
  } catch (error) {
    console.error("Error verifying ERC20 transfer:", error);
    return {
      status: 'failed',
      currentAmount: '0',
      targetAmount: tokenConfig.amount?.toString() || '0'
    };
  }
};

// Helper function to verify ERC721 token transfers
const verifyERC721Transfer = async (
  provider: ethers.providers.Provider,
  tokenConfig: {
    tokenAddress: string;
    tokenIds?: string[];
  },
  holdingAddress: string
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens?: string[];
}> => {
  if (!tokenConfig.tokenIds || tokenConfig.tokenIds.length === 0) {
    return {
      status: 'failed',
      currentAmount: '0',
      targetAmount: '0',
      missingTokens: []
    };
  }
  
  try {
    const token = new ethers.Contract(tokenConfig.tokenAddress, ERC721_ABI, provider);
    const missingTokens: string[] = [];
    let ownedCount = 0;
    
    // Check each token ID to see if it's owned by the holding address
    for (const tokenId of tokenConfig.tokenIds) {
      try {
        const owner = await token.ownerOf(tokenId);
        if (owner.toLowerCase() === holdingAddress.toLowerCase()) {
          ownedCount++;
        } else {
          missingTokens.push(tokenId);
        }
      } catch (error) {
        console.error(`Error checking ownership of token ${tokenId}:`, error);
        missingTokens.push(tokenId);
      }
    }
    
    const totalTokens = tokenConfig.tokenIds.length;
    
    console.log(`ERC721 verification: ${ownedCount} / ${totalTokens}`);
    
    if (ownedCount === totalTokens) {
      return {
        status: 'completed',
        currentAmount: ownedCount.toString(),
        targetAmount: totalTokens.toString()
      };
    } else if (ownedCount > 0) {
      return {
        status: 'verifying',
        currentAmount: ownedCount.toString(),
        targetAmount: totalTokens.toString(),
        missingTokens
      };
    }
    
    return {
      status: 'awaiting_tokens',
      currentAmount: '0',
      targetAmount: totalTokens.toString(),
      missingTokens: tokenConfig.tokenIds
    };
  } catch (error) {
    console.error("Error verifying ERC721 transfer:", error);
    return {
      status: 'failed',
      currentAmount: '0',
      targetAmount: tokenConfig.tokenIds.length.toString(),
      missingTokens: tokenConfig.tokenIds
    };
  }
};

// Helper function to verify ERC1155 token transfers
const verifyERC1155Transfer = async (
  provider: ethers.providers.Provider,
  tokenConfig: {
    tokenAddress: string;
    tokenIds?: string[];
    amount?: number;
  },
  holdingAddress: string
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens?: string[];
}> => {
  if (!tokenConfig.tokenIds || tokenConfig.tokenIds.length === 0) {
    return {
      status: 'failed',
      currentAmount: '0',
      targetAmount: '0',
      missingTokens: []
    };
  }
  
  try {
    const token = new ethers.Contract(tokenConfig.tokenAddress, ERC1155_ABI, provider);
    const missingTokens: string[] = [];
    let totalOwned = 0;
    
    // Prepare arrays for batch balance check
    const accounts = Array(tokenConfig.tokenIds.length).fill(holdingAddress);
    const ids = tokenConfig.tokenIds.map(id => ethers.BigNumber.from(id));
    
    // Get balances for all token IDs at once
    const balances = await token.balanceOfBatch(accounts, ids);
    
    // Process balances
    for (let i = 0; i < tokenConfig.tokenIds.length; i++) {
      const balance = balances[i];
      const tokenId = tokenConfig.tokenIds[i];
      
      if (balance.gt(0)) {
        totalOwned += 1;
      } else {
        missingTokens.push(tokenId);
      }
    }
    
    const totalTokens = tokenConfig.tokenIds.length;
    
    console.log(`ERC1155 verification: ${totalOwned} / ${totalTokens}`);
    
    if (totalOwned === totalTokens) {
      return {
        status: 'completed',
        currentAmount: totalOwned.toString(),
        targetAmount: totalTokens.toString()
      };
    } else if (totalOwned > 0) {
      return {
        status: 'verifying',
        currentAmount: totalOwned.toString(),
        targetAmount: totalTokens.toString(),
        missingTokens
      };
    }
    
    return {
      status: 'awaiting_tokens',
      currentAmount: '0',
      targetAmount: totalTokens.toString(),
      missingTokens: tokenConfig.tokenIds
    };
  } catch (error) {
    console.error("Error verifying ERC1155 transfer:", error);
    return {
      status: 'failed',
      currentAmount: '0',
      targetAmount: tokenConfig.tokenIds.length.toString(),
      missingTokens: tokenConfig.tokenIds
    };
  }
};

/**
 * Check token allowance for ERC20 tokens
 */
export const checkTokenAllowance = async (
  provider: ethers.providers.Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  amount: string
): Promise<boolean> => {
  try {
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const allowance = await token.allowance(ownerAddress, spenderAddress);
    const amountBN = ethers.utils.parseUnits(amount, await token.decimals());
    
    return allowance.gte(amountBN);
  } catch (error) {
    console.error("Error checking token allowance:", error);
    return false;
  }
};

/**
 * Perform emergency withdrawal from a holding contract
 */
export const emergencyWithdraw = async (
  provider: ethers.providers.Web3Provider,
  holdingAddress: string,
  tokenAddress: string,
  recipientAddress: string
): Promise<ethers.ContractTransaction> => {
  if (!provider) {
    throw new Error("Provider is required for emergency withdrawal");
  }
  
  const signer = provider.getSigner();
  const holdingContract = new ethers.Contract(
    holdingAddress,
    HOLDING_CONTRACT_ABI,
    signer
  );
  
  console.log(`Performing emergency withdrawal of ${tokenAddress} to ${recipientAddress}`);
  return await holdingContract.emergencyWithdraw(tokenAddress, recipientAddress);
};

/**
 * Withdraw tokens from a holding contract
 */
export const withdrawToken = async (
  provider: ethers.providers.Web3Provider,
  holdingAddress: string,
  tokenAddress: string,
  recipientAddress: string,
  amount: string
): Promise<ethers.ContractTransaction> => {
  if (!provider) {
    throw new Error("Provider is required for token withdrawal");
  }
  
  const signer = provider.getSigner();
  const holdingContract = new ethers.Contract(
    holdingAddress,
    HOLDING_CONTRACT_ABI,
    signer
  );
  
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const decimals = await token.decimals();
  const parsedAmount = ethers.utils.parseUnits(amount, decimals);
  
  console.log(`Withdrawing ${amount} tokens from ${holdingAddress} to ${recipientAddress}`);
  return await holdingContract.withdraw(tokenAddress, recipientAddress, parsedAmount);
};

/**
 * Withdraw an ERC721 token from a holding contract
 */
export const withdrawERC721 = async (
  provider: ethers.providers.Web3Provider,
  holdingAddress: string,
  tokenAddress: string,
  recipientAddress: string,
  tokenId: string
): Promise<ethers.ContractTransaction> => {
  if (!provider) {
    throw new Error("Provider is required for NFT withdrawal");
  }
  
  const signer = provider.getSigner();
  const holdingContract = new ethers.Contract(
    holdingAddress,
    HOLDING_CONTRACT_ABI,
    signer
  );
  
  console.log(`Withdrawing NFT ${tokenId} from ${holdingAddress} to ${recipientAddress}`);
  return await holdingContract.withdrawERC721(tokenAddress, recipientAddress, tokenId);
};

/**
 * Withdraw an ERC1155 token from a holding contract
 */
export const withdrawERC1155 = async (
  provider: ethers.providers.Web3Provider,
  holdingAddress: string,
  tokenAddress: string,
  recipientAddress: string,
  tokenId: string,
  amount: number = 1
): Promise<ethers.ContractTransaction> => {
  if (!provider) {
    throw new Error("Provider is required for token withdrawal");
  }
  
  const signer = provider.getSigner();
  const holdingContract = new ethers.Contract(
    holdingAddress,
    HOLDING_CONTRACT_ABI,
    signer
  );
  
  console.log(`Withdrawing ${amount} units of ERC1155 token ${tokenId} from ${holdingAddress} to ${recipientAddress}`);
  return await holdingContract.withdrawERC1155(tokenAddress, recipientAddress, tokenId, amount);
};
