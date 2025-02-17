
import { ethers } from "ethers";

export interface GasPrice {
  timestamp: number;
  price: string;
  baseFee: string;
  priorityFee: string;
}

interface NetworkCondition {
  congestion: 'low' | 'medium' | 'high';
  recommendedPriorityFee: string;
}

export class GasOptimizationService {
  private static STORAGE_KEY = 'gas_price_history';
  private static MAX_HISTORY_ENTRIES = 100; // Keep last 100 entries
  private static CONGESTION_THRESHOLDS = {
    low: ethers.utils.parseUnits('30', 'gwei'),
    medium: ethers.utils.parseUnits('100', 'gwei'),
  };

  private gasPriceHistory: GasPrice[] = [];

  constructor() {
    this.loadGasPriceHistory();
  }

  private loadGasPriceHistory(): void {
    const stored = localStorage.getItem(GasOptimizationService.STORAGE_KEY);
    if (stored) {
      this.gasPriceHistory = JSON.parse(stored);
    }
  }

  private saveGasPriceHistory(): void {
    localStorage.setItem(
      GasOptimizationService.STORAGE_KEY,
      JSON.stringify(this.gasPriceHistory)
    );
  }

  private addGasPriceToHistory(gasPrice: GasPrice): void {
    this.gasPriceHistory.push(gasPrice);
    if (this.gasPriceHistory.length > GasOptimizationService.MAX_HISTORY_ENTRIES) {
      this.gasPriceHistory.shift(); // Remove oldest entry
    }
    this.saveGasPriceHistory();
  }

  private async getCurrentNetworkCondition(provider: ethers.providers.Provider): Promise<NetworkCondition> {
    const feeData = await provider.getFeeData();
    const baseFee = feeData.lastBaseFeePerGas || ethers.utils.parseUnits('30', 'gwei');
    
    let congestion: NetworkCondition['congestion'] = 'low';
    if (baseFee.gt(GasOptimizationService.CONGESTION_THRESHOLDS.medium)) {
      congestion = 'high';
    } else if (baseFee.gt(GasOptimizationService.CONGESTION_THRESHOLDS.low)) {
      congestion = 'medium';
    }

    // Calculate recommended priority fee based on network congestion
    let recommendedPriorityFee = ethers.utils.parseUnits('1', 'gwei');
    if (congestion === 'high') {
      recommendedPriorityFee = ethers.utils.parseUnits('2', 'gwei');
    } else if (congestion === 'medium') {
      recommendedPriorityFee = ethers.utils.parseUnits('1.5', 'gwei');
    }

    return {
      congestion,
      recommendedPriorityFee: recommendedPriorityFee.toString()
    };
  }

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
    const networkCondition = await this.getCurrentNetworkCondition(provider);
    
    // Store current gas price
    if (feeData.lastBaseFeePerGas) {
      this.addGasPriceToHistory({
        timestamp: Date.now(),
        price: feeData.gasPrice?.toString() || '0',
        baseFee: feeData.lastBaseFeePerGas.toString(),
        priorityFee: feeData.maxPriorityFeePerGas?.toString() || '0'
      });
    }

    // Calculate optimal max fee based on urgency and network conditions
    const baseFee = feeData.lastBaseFeePerGas || ethers.utils.parseUnits('30', 'gwei');
    const urgencyMultipliers = {
      low: 110, // Base fee + 10%
      medium: 120, // Base fee + 20%
      high: 150, // Base fee + 50%
    };

    const maxFeePerGas = baseFee.mul(urgencyMultipliers[urgency]).div(100);
    const maxPriorityFeePerGas = ethers.utils.parseUnits(networkCondition.recommendedPriorityFee, 'wei');

    return {
      maxFeePerGas,
      maxPriorityFeePerGas
    };
  }

  public getTransactionTimingSuggestion(): string {
    if (this.gasPriceHistory.length < 24) {
      return "Not enough historical data for accurate timing suggestions";
    }

    const recentPrices = this.gasPriceHistory.slice(-24); // Last 24 entries
    const averagePrice = recentPrices.reduce(
      (sum, entry) => sum + Number(ethers.utils.formatUnits(entry.price, 'gwei')),
      0
    ) / recentPrices.length;

    const latestPrice = Number(ethers.utils.formatUnits(recentPrices[recentPrices.length - 1].price, 'gwei'));

    if (latestPrice < averagePrice * 0.8) {
      return "Current gas prices are below average. Good time to transact.";
    } else if (latestPrice > averagePrice * 1.2) {
      return "Current gas prices are above average. Consider waiting if not urgent.";
    }
    return "Gas prices are around average levels.";
  }
}

export const gasOptimizer = new GasOptimizationService();
