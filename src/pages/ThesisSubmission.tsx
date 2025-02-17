
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { cn } from "@/lib/utils";

const ThesisSubmission = () => {
  const { toast } = useToast();
  const { isConnected, address, connect } = useWalletConnection();
  const [isTestMode, setIsTestMode] = useState(false);

  const handleTestModeToggle = (enabled: boolean) => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to toggle test mode",
        variant: "destructive"
      });
      connect();
      return;
    }
    
    setIsTestMode(enabled);
    toast({
      title: `Test Mode ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `Successfully ${enabled ? 'enabled' : 'disabled'} test mode`,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-3xl md:text-4xl font-bold text-white"
              >
                Transform Accounting Firm Ownership
              </motion.h1>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="test-mode" className="text-sm text-white/60">
                  Test Mode
                </Label>
                <Switch
                  id="test-mode"
                  checked={isTestMode}
                  onCheckedChange={handleTestModeToggle}
                  className={cn(
                    "data-[state=checked]:bg-yellow-500",
                    !isConnected && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!isConnected}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSubmission;
