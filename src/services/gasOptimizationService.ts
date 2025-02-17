
import { ethers } from "ethers";

export class GasOptimizationService {
  public async optimizeGasLimit(
    estimatedGas: ethers.BigNumber,
    methodComplexity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<ethers.BigNumber> {
    // Much more reasonable buffers
    const bufferMultipliers = {
      low: 102, // 2% buffer
      medium: 105, // 5% buffer
      high: 110, // 10% buffer
    };

    const multiplier = bufferMultipliers[methodComplexity];
    return estimatedGas.mul(multiplier).div(100);
  }

  public async getOptimizedGasPrice(
    provider: ethers.providers.Provider,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<{ maxFeePerGas: ethers.BigNumber; maxPriorityFeePerGas: ethers.BigNumber }> {
    const feeData = await provider.getFeeData();
    
    // Use network-suggested values with minimal adjustment
    const baseFee = feeData.lastBaseFeePerGas || ethers.utils.parseUnits('30', 'gwei');
    const urgencyMultipliers = {
      low: 100, // Use base fee as is
      medium: 102, // Base fee + 2%
      high: 105, // Base fee + 5%
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
