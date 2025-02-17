
import { ethers } from "ethers";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { ProposalError } from "./errorHandlingService";

export async function initializeZeroDevProvider(connector: any) {
  // Validate ZeroDev configuration
  if (!connector) {
    throw new Error("ZeroDev connector not found");
  }

  // Check for chain ID
  const chainId = connector.chainId;
  console.log("Current chain ID:", chainId);
  
  if (chainId !== 137) { // Polygon Mainnet
    throw new Error("Please connect to Polygon Mainnet");
  }

  // Get AA provider with validation
  const aaProvider = await connector.getAccountAbstractionProvider?.();
  if (!aaProvider) {
    throw new Error("Failed to get account abstraction provider");
  }

  // Verify provider network
  const provider = new ethers.providers.Web3Provider(aaProvider);
  const network = await provider.getNetwork();
  console.log("Provider network:", network);

  if (network.chainId !== 137) {
    throw new Error("Provider not connected to Polygon Mainnet");
  }

  console.log("Successfully initialized AA provider");
  return provider;
}

export async function initializeRegularProvider(walletClient: any) {
  if (!walletClient) {
    throw new ProposalError({
      category: 'wallet',
      message: "No wallet client available",
      recoverySteps: [
        "Please refresh and try again",
        "Make sure your wallet is properly connected"
      ]
    });
  }

  console.log("Creating Web3Provider...");
  const provider = new ethers.providers.Web3Provider(walletClient);
  
  // Verify network
  const network = await provider.getNetwork();
  if (network.chainId !== 137) {
    throw new ProposalError({
      category: 'network',
      message: "Please connect to Polygon Mainnet",
      recoverySteps: [
        "Switch your wallet network to Polygon Mainnet",
        "Refresh the page after switching networks"
      ]
    });
  }

  return provider;
}

export async function getProvider(wallet: NonNullable<DynamicContextType['primaryWallet']>) {
  try {
    console.log("Initializing provider for wallet type:", wallet.connector?.name);
    
    // For ZeroDev wallets
    if (wallet.connector?.name?.toLowerCase().includes('zerodev')) {
      console.log("Using ZeroDev provider");
      try {
        return await initializeZeroDevProvider(wallet.connector);
      } catch (error) {
        console.error("ZeroDev provider error:", error);
        throw new ProposalError({
          category: 'wallet',
          message: error instanceof Error ? error.message : "Failed to initialize ZeroDev provider",
          recoverySteps: [
            "Please ensure you're connected to Polygon Mainnet",
            "Refresh the page and try connecting again",
            "Make sure your ZeroDev wallet is properly set up",
            "Check your network connection"
          ],
          technicalDetails: error instanceof Error ? error.stack : undefined
        });
      }
    }
    
    // For regular wallets
    console.log("Getting wallet client...");
    const walletClient = await wallet.getWalletClient();
    return await initializeRegularProvider(walletClient);
    
  } catch (error) {
    console.error("Error getting provider:", error);
    if (error instanceof ProposalError) {
      throw error;
    }
    throw new ProposalError({
      category: 'wallet',
      message: "Failed to initialize provider",
      recoverySteps: [
        "Please refresh and try again",
        "Check your wallet connection",
        "Make sure you're on the Polygon network"
      ],
      technicalDetails: error instanceof Error ? error.stack : undefined
    });
  }
}
