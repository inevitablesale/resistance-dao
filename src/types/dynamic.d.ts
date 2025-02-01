import { type EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { type ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";

declare module "@dynamic-labs/sdk-react-core" {
  export interface UserProfile {
    alias?: string;
    email?: string;
    verifications?: {
      completedOnboarding?: boolean;
      customFields?: {
        "LinkedIn Profile URL"?: string;
      };
    };
  }

  export interface DynamicContextType {
    user: UserProfile | null;
  }

  export function useDynamicContext(): DynamicContextType;

  export const DynamicContextProvider: React.FC<{
    settings: {
      environmentId: string;
      walletConnectors: (typeof EthereumWalletConnectors | typeof ZeroDevSmartWalletConnectors)[];
    };
    children: React.ReactNode;
  }>;

  export const DynamicWidget: React.FC;
}