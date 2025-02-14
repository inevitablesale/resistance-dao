
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
      disconnect?: () => Promise<void>;
      connector?: {
        name?: string;
        showWallet?: (options: { view: 'send' | 'deposit' }) => void;
        openWallet?: (options: { view: 'send' | 'deposit' }) => void;  // Added for ZeroDev compatibility
      };
    } | null;
    setShowAuthFlow?: (show: boolean) => void;
    setShowOnRamp?: (
      show: boolean,
      options?: {
        defaultFiatAmount?: number;
        defaultNetwork?: {
          chainId: number;
        };
      }
    ) => void;
  }

  export interface DynamicSettings {
    environmentId: string;
    walletConnectors: (typeof EthereumWalletConnectors | typeof ZeroDevSmartWalletConnectors)[];
    walletConnectorOptions?: {
      zeroDevOptions: {
        projectId: string;
        bundlerRpc: string;
        paymasterRpc: string;
      };
    };
    eventsCallbacks?: {
      onVerificationSuccess?: (args: any) => void;
      onVerificationComplete?: () => void;
      onAuthSuccess?: (args: any) => void;
      onLogout?: () => void;
      onEmailVerificationStart?: () => void;
      onEmailVerificationSuccess?: () => void;
      onSessionConnect?: () => void;
      onSessionRestore?: () => void;
    };
    settings?: {
      network?: {
        chainId: number;
      };
      environmentId: string;
      appName: string;
      appLogoUrl: string;
      enableEmbeddedWallets?: boolean;
      enableVisitTrackingOnConnectOnly?: boolean;
      enableWalletConnectV1?: boolean;
      enableWalletConnectV2?: boolean;
      persistWalletSession?: boolean;
      enableSessionRestoration?: boolean;
      enableAuthProviders?: boolean;
      enablePasskeys?: boolean;
      evmWallets?: {
        options: {
          emailAuth: {
            signInWithEmail: boolean;
            autoVerify: boolean;
            autoClose: boolean;
            onComplete: (args: any) => void;
          };
        };
      };
      shadowDOMEnabled?: boolean;
      tokens?: Array<{
        address: string;
        symbol: string;
        decimals: number;
        name: string;
        icon: string;
        chainId: number;
      }>;
    };
  }

  export function useDynamicContext(): DynamicContextType;

  export const DynamicContextProvider: React.FC<{
    settings: DynamicSettings;
    children: React.ReactNode;
  }>;

  export const DynamicWidget: React.FC;
}
