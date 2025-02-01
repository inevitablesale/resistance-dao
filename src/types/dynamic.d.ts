declare module "@dynamic-labs/sdk-react-core" {
  export interface UserProfile {
    verifications?: {
      completedOnboarding?: boolean;
    };
  }

  export interface DynamicContext {
    user: UserProfile | null;
    primaryWallet: any; // Keep the existing type for primaryWallet
  }

  export function useDynamicContext(): DynamicContext;
}