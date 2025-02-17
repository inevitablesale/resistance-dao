
import { ethers } from "ethers";

export class GasOptimizationService {
  public async optimizeGasLimit(
    estimatedGas: ethers.BigNumber,
    methodComplexity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<ethers.BigNumber> {
    // Dynamic buffer based on method complexity
    const bufferMultipliers = {
      low: 110, // 10% buffer
      medium: 120, // 20% buffer
      high: 130, // 30% buffer
    };

    const multiplier = bufferMultipliers[methodComplexity];
    return estimatedGas.mul(multiplier).div(100);
  }

  public async getOptimizedGasPrice(
    provider: ethers.providers.Provider,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<{ maxFeePerGas: ethers.BigNumber; maxPriorityFeePerGas: ethers.BigNumber }> {
    const feeData = await provider.getFeeData();
    
    // Calculate optimal max fee based on urgency
    const baseFee = feeData.lastBaseFeePerGas || ethers.utils.parseUnits('30', 'gwei');
    const urgencyMultipliers = {
      low: 110, // Base fee + 10%
      medium: 120, // Base fee + 20%
      high: 150, // Base fee + 50%
    };

    const maxFeePerGas = baseFee.mul(urgencyMultipliers[urgency]).div(100);
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.utils.parseUnits('1.5', 'gwei');

    return {
      maxFeePerGas,
      maxPriorityFeePerGas
    };
  }
}

export const gasOptimizer = new GasOptimizationService();
