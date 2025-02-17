
import { ethers } from "ethers";

export class GasOptimizationService {
  public async optimizeGasLimit(
    estimatedGas: ethers.BigNumber
  ): Promise<ethers.BigNumber> {
    return estimatedGas;
  }

  public async getOptimizedGasPrice(
    provider: ethers.providers.Provider
  ): Promise<{ maxFeePerGas: ethers.BigNumber; maxPriorityFeePerGas: ethers.BigNumber }> {
    const feeData = await provider.getFeeData();
    
    return {
      maxFeePerGas: feeData.lastBaseFeePerGas || ethers.utils.parseUnits('30', 'gwei'),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.utils.parseUnits('1.5', 'gwei')
    };
  }
}

export const gasOptimizer = new GasOptimizationService();
