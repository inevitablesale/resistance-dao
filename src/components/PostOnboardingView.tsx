import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletInfo } from "./WalletInfo";

export const PostOnboardingView = () => {
  const { user } = useDynamicContext();

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Welcome {user?.alias || 'User'}!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{user?.email}</span>
          </div>
          {user?.verifications?.customFields && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">LinkedIn Profile</span>
              <a 
                href={user.verifications.customFields["LinkedIn Profile URL"]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-polygon-primary hover:underline"
              >
                View Profile
              </a>
            </div>
          )}
        </CardContent>
      </Card>
      <WalletInfo />
    </div>
  );
};