
import { Card } from "@/components/ui/card";

interface PurchaseSummaryProps {
  amount: string;
  purchaseMethod: 'matic' | 'card';
  expectedLGR: string;
  maticUsdRate: number;
}

export const PurchaseSummary = ({ amount, purchaseMethod, expectedLGR, maticUsdRate }: PurchaseSummaryProps) => {
  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <h4 className="text-sm font-medium text-gray-300 mb-2">Purchase Summary</h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Amount:</span>
          <span className="text-white">
            {purchaseMethod === 'card' ? '$' : ''}{amount} {purchaseMethod === 'card' ? 'USD' : 'MATIC'}
          </span>
        </div>
        {purchaseMethod === 'card' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated MATIC:</span>
            <span className="text-white">
              {(Number(amount) / maticUsdRate).toFixed(4)} MATIC
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm border-t border-white/10 pt-2">
          <span className="text-gray-400">Expected LGR:</span>
          <span className="text-white font-medium">{expectedLGR} LGR</span>
        </div>
      </div>
    </div>
  );
};
