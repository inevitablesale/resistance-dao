
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
    setShowAuthFlow?: (show: boolean) => void;
  }

  export interface DynamicSettings {
    environmentId: string;
    walletConnectors: (typeof EthereumWalletConnectors | typeof ZeroDevSmartWalletConnectors)[];
    eventsCallbacks?: {
      onVerificationComplete?: () => void;
      onAuthSuccess?: (args: any) => void;
      onLogout?: () => void;
    };
  }

  export function useDynamicContext(): DynamicContextType;

  export const DynamicContextProvider: React.FC<{
    settings: DynamicSettings;
    children: React.ReactNode;
  }>;

  export const DynamicWidget: React.FC;
}
