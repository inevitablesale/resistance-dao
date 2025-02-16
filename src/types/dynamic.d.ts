
import { type EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { type ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { type OnrampProviders } from "@dynamic-labs/sdk-api-core";

declare module "@dynamic-labs/sdk-react-core" {
  export type DynamicChain = 'ALGO' | 'BTC' | 'COSMOS' | 'EVM' | 'FLOW' | 'SOL' | 'STARK';
  
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

  export interface DynamicWallet {
    address?: string;
    isAuthenticated: boolean;
    isConnected: () => Promise<boolean>;
    getNetwork: () => Promise<{ chainId: number; name: string }>;
    getPublicClient: () => Promise<any>;
    getWalletClient: () => Promise<any>;
    disconnect?: () => Promise<void>;
  }

  export interface DynamicContextType {
    user: UserProfile | null;
    primaryWallet: DynamicWallet | null;
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
    useOnramp?: () => {
      enabled: boolean;
      open: (options: {
        onrampProvider: OnrampProviders;
        token: string;
        address: string;
      }) => Promise<void>;
    };
  }

  export interface SmartWalletOptions {
    enableHD?: boolean;
    recoveryMethods?: ('email' | 'social' | 'passkey')[];
    separateGenerationStep?: boolean;
  }

  export interface WalletConnectorEvent {
    type: 'connected' | 'disconnected' | 'networkChanged';
    data?: any;
  }

  export interface WebhookConfig {
    url: string;
    events: ('wallet.created' | 'wallet.connected' | 'user.verified')[];
    secret?: string;
  }

  export interface DynamicSettings {
    environmentId: string;
    walletConnectors: (typeof EthereumWalletConnectors | typeof ZeroDevSmartWalletConnectors)[];
    walletConnectorOptions?: {
      smartWallet: SmartWalletOptions;
    };
    eventsCallbacks?: {
      onVerificationSuccess?: (data: {
        userId: string;
        verificationType: string;
        timestamp: number;
      }) => void;
      onWalletGenerated?: (data: {
        walletAddress: string;
        type: 'hd' | 'smart-contract';
      }) => void;
      onAccountRecoveryStarted?: () => void;
      onAccountRecoveryCompleted?: (data: { 
        recoveryMethod: 'email' | 'social' | 'passkey' 
      }) => void;
      onAuthSuccess?: (args: any) => void;
      onLogout?: () => void;
      onEmailVerificationStart?: () => void;
      onEmailVerificationSuccess?: () => void;
      onSessionConnect?: () => void;
      onSessionRestore?: () => void;
    };
    settings?: {
      network?: {
        chain: DynamicChain;
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
      webhooks?: WebhookConfig[];
      evmWallets?: {
        options: {
          emailAuth: {
            signInWithEmail: boolean;
            autoVerify: boolean;
            autoClose: boolean;
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

  export function useWalletConnectorEvent(): {
    subscribe: (callback: (event: WalletConnectorEvent) => void) => () => void;
  };

  export function useFunding(): {
    startFunding: (options: {
      amount?: number;
      token?: string;
      provider?: OnrampProviders;
    }) => Promise<void>;
    isAvailable: boolean;
  };
}
