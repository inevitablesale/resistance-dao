
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

const ZERODEV_FACTORY_ADDRESS = "0x5D07c471C0E12D89D9F27D4A5A7c29A04B393c8F"; // Polygon Mainnet
const ZERODEV_FACTORY_ABI = [
  "function createWallet(address owner) returns (address)",
  "function getWalletAddress(address owner) view returns (address)"
];

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
      const ownerAddress = await signer.getAddress();
      console.log('Deploying smart wallet for owner:', ownerAddress);

      const walletClient = await primaryWallet?.getWalletClient();
      if (!walletClient) {
        throw new Error('Failed to initialize wallet client');
      }

      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const network = await provider.getNetwork();
      
      if (network.chainId !== 137) {
        throw new Error('Please switch to Polygon network');
      }

      // Initialize ZeroDev Factory contract
      const factory = new ethers.Contract(
        ZERODEV_FACTORY_ADDRESS,
        ZERODEV_FACTORY_ABI,
        provider
      );

      // Check if wallet already exists
      const existingWalletAddress = await factory.getWalletAddress(ownerAddress);
      if (existingWalletAddress !== ethers.constants.AddressZero) {
        return {
          success: true,
          walletAddress: existingWalletAddress,
          estimatedGas: "0" // Already deployed
        };
      }

      // Estimate gas for deployment
      const gasEstimate = await factory.estimateGas.createWallet(ownerAddress);
      console.log('Estimated gas for deployment:', gasEstimate.toString());

      // Deploy the smart wallet
      const factoryWithSigner = factory.connect(signer);
      const tx = await factoryWithSigner.createWallet(ownerAddress, {
        gasLimit: gasEstimate.mul(12).div(10) // Add 20% buffer
      });

      console.log('Deployment transaction sent:', tx.hash);

      // Wait for deployment
      const receipt = await tx.wait();
      console.log('Deployment confirmed:', receipt);

      // Get the deployed wallet address from events
      const deployedAddress = receipt.events?.[0]?.args?.wallet;
      if (!deployedAddress) {
        throw new Error('Failed to get deployed wallet address');
      }

      return {
        success: true,
        walletAddress: deployedAddress,
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
        
        let walletClient;
        try {
          console.log('Attempting to get wallet client...');
          walletClient = await primaryWallet.getWalletClient();
          console.log('Wallet client response:', walletClient);

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
            const provider = new ethers.providers.Web3Provider(primaryWallet as any);
            const signer = provider.getSigner();
            
            const deploymentResult = await deploySmartWallet(signer);
            
            if (!deploymentResult.success) {
              throw new Error(deploymentResult.error || 'Deployment failed');
            }

            console.log('Smart wallet deployed successfully:', {
              address: deploymentResult.walletAddress,
              estimatedGas: deploymentResult.estimatedGas
            });

            // Store the smart wallet address for future use
            localStorage.setItem('zeroDevWalletAddress', deploymentResult.walletAddress);
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
