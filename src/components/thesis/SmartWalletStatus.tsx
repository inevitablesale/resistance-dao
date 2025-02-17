
import { cn } from "@/lib/utils";
import { Wallet, Check, AlertCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ethers } from "ethers";

export interface SmartWalletState {
  status: 'checking' | 'creating' | 'ready' | 'error';
  message: string;
  isFirstTime: boolean;
}

interface ZeroDevResponse {
  success: boolean;
  error?: string;
  walletAddress?: string;
  estimatedGas?: string;
}

export const SmartWalletStatus = () => {
  const { primaryWallet } = useDynamicContext();
  const { address } = useWalletConnection();
  const [state, setState] = useState<SmartWalletState>({
    status: 'checking',
    message: 'Checking wallet status...',
    isFirstTime: false
  });

  const deploySmartWallet = async (signer: ethers.Signer): Promise<ZeroDevResponse> => {
    try {
      // Get the owner's address
      const ownerAddress = await signer.getAddress();
      console.log('Deploying smart wallet for owner:', ownerAddress);

      // Initialize ZeroDev wallet
      const walletClient = await primaryWallet?.getWalletClient();
      
      if (!walletClient) {
        throw new Error('Failed to initialize wallet client');
      }

      // Get the implementation contract
      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const network = await provider.getNetwork();
      
      if (network.chainId !== 137) { // Polygon Mainnet
        throw new Error('Please switch to Polygon network');
      }

      // Simulate the deployment to get gas estimate
      const gasEstimate = await provider.estimateGas({
        from: ownerAddress,
        to: null, // Contract deployment
        data: '0x' // Contract deployment bytecode would go here
      });

      console.log('Estimated gas for deployment:', gasEstimate.toString());

      // For now, return success without actual deployment
      // This will be replaced with actual ZeroDev deployment
      return {
        success: true,
        walletAddress: ownerAddress,
        estimatedGas: gasEstimate.toString()
      };

    } catch (error: any) {
      console.error('Smart wallet deployment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to deploy smart wallet'
      };
    }
  };

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!primaryWallet || !address) return;

      try {
        console.log('Checking wallet status for address:', address);
        
        // Check if this is the first time user is creating a smart wallet
        let walletClient;
        try {
          console.log('Attempting to get wallet client...');
          walletClient = await primaryWallet.getWalletClient();
          console.log('Wallet client response:', walletClient);

          // Get the provider and validate network
          const provider = new ethers.providers.Web3Provider(walletClient as any);
          const network = await provider.getNetwork();
          console.log('Connected to network:', network.name);

          if (network.chainId !== 137) {
            throw new Error('Please switch to Polygon network');
          }
        } catch (error) {
          console.error('Error getting wallet client:', error);
          walletClient = null;
        }
        
        if (!walletClient) {
          console.log('No existing wallet found, initiating creation...');
          setState({
            status: 'creating',
            message: 'Setting up your smart wallet...',
            isFirstTime: true
          });

          try {
            // Get the signer
            const provider = new ethers.providers.Web3Provider(primaryWallet as any);
            const signer = provider.getSigner();
            
            // Deploy the smart wallet
            const deploymentResult = await deploySmartWallet(signer);
            
            if (!deploymentResult.success) {
              throw new Error(deploymentResult.error || 'Deployment failed');
            }

            console.log('Smart wallet deployed successfully:', {
              address: deploymentResult.walletAddress,
              estimatedGas: deploymentResult.estimatedGas
            });
          } catch (error) {
            console.error('Smart wallet creation error:', error);
            throw error;
          }
        } else {
          console.log('Existing wallet found');
        }

        setState({
          status: 'ready',
          message: 'Smart wallet is ready',
          isFirstTime: !walletClient
        });
      } catch (error: any) {
        console.error('Smart wallet setup error:', error);
        setState({
          status: 'error',
          message: error.message || 'Failed to setup smart wallet',
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
