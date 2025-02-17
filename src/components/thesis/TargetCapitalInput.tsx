
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { ethers } from "ethers";

interface TargetCapitalInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string[];
}

// These are in LGR tokens (contract expects LGR values)
const MIN_TARGET_CAPITAL = "1000"; // 1,000 LGR
const MAX_TARGET_CAPITAL = "25000000"; // 25M LGR
const LGR_PRICE_USD = 0.10; // $0.10 per LGR token

export const TargetCapitalInput = ({
  value,
  onChange,
  error
}: TargetCapitalInputProps) => {
  const formatValue = (val: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = val.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) return value;
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return `${parts[0]}.${parts[1].substring(0, 2)}`;
    }
    return numericValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    onChange(formattedValue);
  };

  const calculateUSDAmount = (lgrAmount: string): string => {
    if (!lgrAmount) return "0";
    const lgrValue = parseFloat(lgrAmount);
    const usdAmount = lgrValue * LGR_PRICE_USD;
    return usdAmount.toFixed(2);
  };

  const getHelperText = () => {
    if (!value) return "";
    const numValue = parseFloat(value);
    const minValue = parseFloat(MIN_TARGET_CAPITAL);
    const maxValue = parseFloat(MAX_TARGET_CAPITAL);
    
    if (numValue < minValue) {
      return `Minimum target capital is ${MIN_TARGET_CAPITAL.toLocaleString()} LGR`;
    }
    if (numValue > maxValue) {
      return `Maximum target capital is ${MAX_TARGET_CAPITAL.toLocaleString()} LGR`;
    }
    return "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium text-white mb-2 flex items-center gap-2">
          Target Capital (LGR)
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </Label>
        <div className="text-sm text-gray-400">
          {value && `≈ $${calculateUSDAmount(value)}`}
        </div>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter amount in LGR"
          className={cn(
            "bg-black/50 border-white/10 text-white placeholder:text-gray-500 pl-12",
            error ? "border-red-500" : ""
          )}
          value={value}
          onChange={handleChange}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🪙</span>
      </div>
      {(error || getHelperText()) && (
        <p className="text-sm text-red-500">
          {error?.[0] || getHelperText()}
        </p>
      )}
    </div>
  );
};
