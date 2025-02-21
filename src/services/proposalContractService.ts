import { ethers } from "ethers";
import { ProposalError, handleError } from "./errorHandlingService";
import { EventConfig, waitForProposalCreation } from "./eventListenerService";
import { transactionQueue } from "./transactionQueueService";
import { checkTokenAllowance } from "./tokenService";
import { WalletType } from "@/hooks/useWalletProvider";
import { executeTransaction } from "./transactionManager";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";
import { 
  ProposalMetadata, 
  ProposalConfig, 
  ProposalContractInput,
  ProposalContractTuple,
  FirmSize,
  DealType,
  GeographicFocus,
  PaymentTerm,
  OperationalStrategy,
  GrowthStrategy,
  IntegrationStrategy
} from "@/types/proposals";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";

export interface ContractStatus {
  submissionFee: ethers.BigNumber;
  isPaused: boolean;
  isTestMode: boolean;
  treasury: string;
  minTargetCapital: ethers.BigNumber;
  maxTargetCapital: ethers.BigNumber;
  minVotingDuration: number;
  maxVotingDuration: number;
  votingFee: ethers.BigNumber;
  lgrTokenAddress: string;
  owner: string;
  tester: string;
}

async function getProvider(wallet: NonNullable<DynamicContextType['primaryWallet']>) {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    return new ethers.providers.Web3Provider(walletClient as any);
  } catch (error) {
    console.error("Error getting provider:", error);
    throw new Error("Failed to initialize provider");
  }
}

export const getContractStatus = async (wallet: NonNullable<DynamicContextType['primaryWallet']>): Promise<ContractStatus> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

  try {
    const [
      submissionFee,
      isPaused,
      isTestMode,
      treasury,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration,
      maxVotingDuration,
      votingFee,
      lgrTokenAddress,
      owner,
      tester
    ] = await Promise.all([
      factory.submissionFee(),
      factory.paused(),
      factory.testModeEnabled(),
      factory.treasury(),
      factory.MIN_TARGET_CAPITAL(),
      factory.MAX_TARGET_CAPITAL(),
      factory.MIN_VOTING_DURATION(),
      factory.MAX_VOTING_DURATION(),
      factory.VOTING_FEE(),
      factory.LGR_TOKEN(),
      factory.owner(),
      factory.tester()
    ]);

    return {
      submissionFee,
      isPaused,
      isTestMode,
      treasury,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration: Number(minVotingDuration),
      maxVotingDuration: Number(maxVotingDuration),
      votingFee,
      lgrTokenAddress,
      owner,
      tester
    };
  } catch (error) {
    console.error("Error getting contract status:", error);
    throw new Error("Failed to get contract status");
  }
};

function sanitizeString(str: string): string {
  return str
    .replace(/[^\w\s.,'-]/g, '') 
    .replace(/\s+/g, ' ')
    .trim();
}

function processText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return sanitizeString(text);
}

function validateTextLength(text: string, field: string, min?: number, max?: number): void {
  if (min !== undefined && text.length < min) {
    throw new Error(`${field} must be at least ${min} characters (current: ${text.length})`);
  }
  if (max !== undefined && text.length > max) {
    throw new Error(`${field} must not exceed ${max} characters (current: ${text.length})`);
  }
}

function validateProposalInput(input: ProposalContractInput) {
  try {
    validateTextLength(input.title, "Title", 10, 100);
    
    if (!input.ipfsMetadata || input.ipfsMetadata.length === 0) {
      throw new Error("IPFS metadata hash is required");
    }

    validateTextLength(input.investmentDrivers, "Investment drivers", 50, 500);
    
    if (input.additionalCriteria) {
      validateTextLength(input.additionalCriteria, "Additional criteria", undefined, 500);
    }

    validateTextLength(input.location, "Location", 1, 100);

    const validateArray = (arr: any[], name: string) => {
      if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error(`${name} array is required and must not be empty`);
      }
      if (arr.some(item => {
        const num = Number(item);
        return isNaN(num) || num < 0 || num > 255;
      })) {
        throw new Error(`${name} array contains invalid values (must be uint8: 0-255)`);
      }
    };

    validateArray(input.paymentTerms, "Payment terms");
    validateArray(input.operationalStrategies, "Operational strategies");
    validateArray(input.growthStrategies, "Growth strategies");
    validateArray(input.integrationStrategies, "Integration strategies");
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
}

function transformToContractTuple(input: ProposalContractInput): ProposalContractTuple {
  const toUint8Array = (arr: (number | string)[] | undefined): number[] => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return [0];
    }
    return arr.map(num => Math.max(0, Math.min(255, Number(num))));
  };

  const targetCapitalWei = ethers.BigNumber.isBigNumber(input.targetCapital)
    ? input.targetCapital
    : ethers.BigNumber.from(input.targetCapital);

  console.log("Creating contract tuple:", {
    title: input.title,
    ipfsHash: input.ipfsMetadata,
    targetCapital: {
      wei: targetCapitalWei.toString(),
      lgr: ethers.utils.formatUnits(targetCapitalWei, 18)
    },
    arrays: {
      paymentTerms: toUint8Array(input.paymentTerms),
      operationalStrategies: toUint8Array(input.operationalStrategies),
      growthStrategies: toUint8Array(input.growthStrategies),
      integrationStrategies: toUint8Array(input.integrationStrategies)
    }
  });

  return {
    title: input.title || "",
    ipfsMetadata: input.ipfsMetadata || "",
    targetCapital: targetCapitalWei.toString(),
    votingDuration: input.votingDuration || 604800,
    investmentDrivers: input.investmentDrivers || "",
    additionalCriteria: input.additionalCriteria || "",
    firmSize: Number(input.firmSize),
    location: input.location || "",
    dealType: Number(input.dealType),
    geographicFocus: Number(input.geographicFocus),
    paymentTerms: toUint8Array(input.paymentTerms),
    operationalStrategies: toUint8Array(input.operationalStrategies),
    growthStrategies: toUint8Array(input.growthStrategies),
    integrationStrategies: toUint8Array(input.integrationStrategies)
  };
}

function transformConfigToContractInput(config: ProposalConfig): ProposalContractInput {
  console.log("Transforming config to contract input:", config);
  
  try {
    const contractInput: ProposalContractInput = {
      title: processText(config.metadata.title),
      ipfsMetadata: config.ipfsHash || '',
      targetCapital: config.targetCapital,
      votingDuration: config.votingDuration,
      investmentDrivers: processText(config.metadata.investment.drivers),
      additionalCriteria: config.metadata.investment.additionalCriteria 
        ? processText(config.metadata.investment.additionalCriteria)
        : "",
      firmSize: config.metadata.firmCriteria.size,
      location: processText(config.metadata.firmCriteria.location),
      dealType: config.metadata.firmCriteria.dealType,
      geographicFocus: config.metadata.firmCriteria.geographicFocus,
      paymentTerms: Array.isArray(config.metadata.paymentTerms) ? config.metadata.paymentTerms : [],
      operationalStrategies: Array.isArray(config.metadata.strategies.operational) ? config.metadata.strategies.operational : [],
      growthStrategies: Array.isArray(config.metadata.strategies.growth) ? config.metadata.strategies.growth : [],
      integrationStrategies: Array.isArray(config.metadata.strategies.integration) ? config.metadata.strategies.integration : []
    };

    console.log("Contract input prepared:", {
      ...contractInput,
      targetCapital: contractInput.targetCapital.toString()
    });
    
    return contractInput;
  } catch (error) {
    console.error("Error transforming config:", error);
    throw new ProposalError({
      category: 'validation',
      message: `Failed to transform proposal config: ${error.message}`,
      recoverySteps: [
        'Check that all text fields contain valid string data',
        'Ensure all required fields are provided',
        'Try submitting the form again'
      ]
    });
  }
}

export const createProposal = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  try {
    const contractInput = transformConfigToContractInput(config);
    validateProposalInput(contractInput);
    
    const contractTuple = transformToContractTuple(contractInput);
    
    const contractParams = [
      contractTuple.title,
      contractTuple.ipfsMetadata,
      contractTuple.targetCapital,
      contractTuple.votingDuration,
      contractTuple.investmentDrivers,
      contractTuple.additionalCriteria,
      contractTuple.firmSize,
      contractTuple.location,
      contractTuple.dealType,
      contractTuple.geographicFocus,
      contractTuple.paymentTerms,
      contractTuple.operationalStrategies,
      contractTuple.growthStrategies,
      contractTuple.integrationStrategies
    ];

    console.log("Creating proposal with parameters:", {
      contractParams,
      linkedInURL: config.linkedInURL,
      targetCapitalLGR: ethers.utils.formatUnits(contractTuple.targetCapital, 18)
    });

    return await executeTransaction(
      () => factory.createProposal([contractParams, config.linkedInURL]),
      {
        type: 'nft',
        description: `Creating proposal with target capital ${ethers.utils.formatUnits(contractTuple.targetCapital, 18)} LGR`,
        timeout: 180000,
        maxRetries: 3,
        backoffMs: 5000,
        nftConfig: {
          tokenAddress: FACTORY_ADDRESS,
          amount: 1,
          standard: "ERC721",
          symbol: "LFP",
          name: "LedgerFren Proposal"
        }
      }
    );
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
};

export const setTestMode = async (
  enabled: boolean,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  const signerAddress = await provider.getSigner().getAddress();
  const status = await getContractStatus(wallet);
  
  if (signerAddress.toLowerCase() !== status.tester.toLowerCase()) {
    throw new Error("Not authorized - must be the tester address");
  }

  console.log('Setting test mode with tester wallet:', {
    signerAddress,
    testerAddress: status.tester,
    enabled
  });

  return await executeTransaction(
    () => factory.setTestMode(enabled),
    {
      type: 'contract',
      description: `Setting test mode to ${enabled}`,
      timeout: 60000,
      maxRetries: 2,
      backoffMs: 3000
    }
  );
};

export const estimateProposalGas = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.BigNumber> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  const input = {
    title: config.metadata.title,
    ipfsMetadata: config.ipfsHash,
    targetCapital: config.targetCapital,
    votingDuration: config.votingDuration,
    investmentDrivers: config.metadata.investment.drivers,
    additionalCriteria: config.metadata.investment.additionalCriteria,
    firmSize: config.metadata.firmCriteria.size,
    location: config.metadata.firmCriteria.location,
    dealType: config.metadata.firmCriteria.dealType,
    geographicFocus: config.metadata.firmCriteria.geographicFocus,
    paymentTerms: config.metadata.paymentTerms,
    operationalStrategies: config.metadata.strategies.operational,
    growthStrategies: config.metadata.strategies.growth,
    integrationStrategies: config.metadata.strategies.integration
  };
  
  try {
    const gasEstimate = await factory.estimateGas.createProposal(input, config.linkedInURL);
    return gasEstimate.mul(120).div(100); // Add 20% buffer
  } catch (error) {
    console.error("Gas estimation error:", error);
    throw error;
  }
};
