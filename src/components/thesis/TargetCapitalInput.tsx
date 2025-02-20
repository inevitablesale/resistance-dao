
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { ethers } from "ethers";
import { LGR_PRICE_USD } from "@/lib/constants";

interface TargetCapitalInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string[];
}

// Constants in LGR terms
const MIN_TARGET_CAPITAL_LGR = 1000;
const MAX_TARGET_CAPITAL_LGR = 25000000;

export const convertUSDToLGRWei = (lgrAmount: string): ethers.BigNumber => {
  console.log("[TargetCapital] Input value:", lgrAmount, "Type:", typeof lgrAmount);
  
  if (!lgrAmount || isNaN(parseFloat(lgrAmount))) {
    console.log("[TargetCapital] Invalid input, returning 0");
    return ethers.BigNumber.from(0);
  }
  
  // Convert string to number and validate
  const lgrValue = parseFloat(lgrAmount);
  const wholeLGRAmount = Math.floor(lgrValue);
  console.log("[TargetCapital] Parsed values:", {
    original: lgrAmount,
    parsed: lgrValue,
    floored: wholeLGRAmount
  });
  
  if (wholeLGRAmount < MIN_TARGET_CAPITAL_LGR) {
    throw new Error(`Minimum target capital is ${MIN_TARGET_CAPITAL_LGR.toLocaleString()} LGR ($${(MIN_TARGET_CAPITAL_LGR * LGR_PRICE_USD).toLocaleString()} USD)`);
  }
  if (wholeLGRAmount > MAX_TARGET_CAPITAL_LGR) {
    throw new Error(`Maximum target capital is ${MAX_TARGET_CAPITAL_LGR.toLocaleString()} LGR ($${(MAX_TARGET_CAPITAL_LGR * LGR_PRICE_USD).toLocaleString()} USD)`);
  }
  
  try {
    // Convert the whole LGR amount to wei (18 decimals)
    console.log("[TargetCapital] Converting to wei:", wholeLGRAmount.toString());
    const result = ethers.utils.parseUnits(wholeLGRAmount.toString(), 18);
    console.log("[TargetCapital] Converted wei value:", result.toString());
    return result;
  } catch (error) {
    console.error("[TargetCapital] Error converting to wei:", error);
    return ethers.BigNumber.from(0);
  }
};

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
    // No decimals allowed for LGR tokens
    if (parts.length > 1) {
      return parts[0];
    }
    return numericValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    console.log("[TargetCapital] Formatted input value:", formattedValue);
    onChange(formattedValue);
  };

  const calculateUSDAmount = (lgrAmount: string): string => {
    if (!lgrAmount) return "0";
    const lgrValue = parseFloat(lgrAmount);
    if (isNaN(lgrValue)) return "0";
    const usdAmount = lgrValue * LGR_PRICE_USD;
    return usdAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getHelperText = () => {
    if (!value) return "";
    const lgrValue = parseFloat(value);
    if (isNaN(lgrValue)) return "Please enter a valid number";
    if (lgrValue < MIN_TARGET_CAPITAL_LGR) {
      return `Minimum target capital is ${MIN_TARGET_CAPITAL_LGR.toLocaleString()} LGR`;
    }
    if (lgrValue > MAX_TARGET_CAPITAL_LGR) {
      return `Maximum target capital is ${MAX_TARGET_CAPITAL_LGR.toLocaleString()} LGR`;
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
          {value && `≈ $${calculateUSDAmount(value)} USD`}
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">LGR</span>
      </div>
      {(error || getHelperText()) && (
        <p className="text-sm text-red-500">
          {error?.[0] || getHelperText()}
        </p>
      )}
    </div>
  );
};

