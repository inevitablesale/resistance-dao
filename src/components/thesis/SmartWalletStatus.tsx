
import { cn } from "@/lib/utils";
import { Wallet, Check, AlertCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export interface SmartWalletState {
  status: 'checking' | 'creating' | 'ready' | 'error';
  message: string;
  isFirstTime: boolean;
}

export const SmartWalletStatus = () => {
  const { primaryWallet } = useDynamicContext();
  const { address } = useWalletConnection();
  const [state, setState] = useState<SmartWalletState>({
    status: 'checking',
    message: 'Checking wallet status...',
    isFirstTime: false
  });

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!primaryWallet || !address) return;

      try {
        // Check if this is the first time user is creating a smart wallet
        const hasExistingWallet = await primaryWallet.getWalletClient();
        
        if (!hasExistingWallet) {
          setState({
            status: 'creating',
            message: 'Setting up your smart wallet...',
            isFirstTime: true
          });
          // Wait for wallet creation
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        setState({
          status: 'ready',
          message: 'Smart wallet is ready',
          isFirstTime: !hasExistingWallet
        });
      } catch (error) {
        console.error('Smart wallet setup error:', error);
        setState({
          status: 'error',
          message: 'Failed to setup smart wallet',
          isFirstTime: false
        });
      }
    };

    checkWalletStatus();
  }, [primaryWallet, address]);

  return (
    <Card className={cn(
      "p-4 border transition-colors",
      state.status === 'ready' ? "border-green-500 bg-green-500/5" :
      state.status === 'error' ? "border-red-500 bg-red-500/5" :
      "border-blue-500 bg-blue-500/5"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          state.status === 'ready' ? "bg-green-500" :
          state.status === 'error' ? "bg-red-500" :
          "bg-blue-500"
        )}>
          {state.status === 'ready' && <Check className="w-5 h-5 text-white" />}
          {state.status === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
          {(state.status === 'checking' || state.status === 'creating') && (
            <Loader className="w-5 h-5 text-white animate-spin" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-white">
            Smart Wallet Status
          </h3>
          <p className="text-sm text-white/60">
            {state.message}
          </p>
          {state.isFirstTime && state.status === 'ready' && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-green-400 mt-1"
            >
              Smart wallet created successfully!
            </motion.p>
          )}
        </div>
      </div>
    </Card>
  );
};
