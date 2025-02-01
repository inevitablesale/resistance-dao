import { UserProfile } from "@dynamic-labs/sdk-react-core";

declare module "@dynamic-labs/sdk-react-core" {
  interface UserProfile {
    verifications?: {
      completedOnboarding?: boolean;
      customFields?: {
        "LinkedIn Profile URL"?: string;
      };
    };
  }
}