import { type EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { type ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";

declare module "@dynamic-labs/sdk-react-core" {
  export interface UserProfile {
    alias?: string;
    email?: string;
    metadata?: {
      "LinkedIn Profile URL"?: string;
      [key: string]: any;
    };
    verifications?: {
      completedOnboarding?: boolean;
      customFields?: {
        "LinkedIn Profile URL"?: string;
      };
    };
  }

  export interface DynamicContextType {
    user: UserProfile | null;
    primaryWallet: {
      address?: string;
      isConnected: () => Promise<boolean>;
      getWalletClient: () => Promise<any>;
    } | null;
  }

  export function useDynamicContext(): DynamicContextType;

  export const DynamicContextProvider: React.FC<{
    settings: {
      environmentId: string;
      walletConnectors: (typeof EthereumWalletConnectors | typeof ZeroDevSmartWalletConnectors)[];
      transactionModalConfiguration?: {
        modalTitle?: string;
        modalDescription?: string;
        receiveText?: string;
        networkText?: string;
        interactingText?: string;
        confirmButtonText?: string;
        cancelButtonText?: string;
      };
    };
    children: React.ReactNode;
  }>;

  export const DynamicWidget: React.FC;
}