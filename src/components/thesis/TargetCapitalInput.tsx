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

// Constants from the contract (in LGR tokens)
const MIN_TARGET_CAPITAL_LGR = 1000;
const MAX_TARGET_CAPITAL_LGR = 25000000;

export const convertUSDToLGRWei = (lgrAmount: string): ethers.BigNumber => {
  // Return 0 if empty or invalid
  if (!lgrAmount || isNaN(parseFloat(lgrAmount))) {
    throw new Error(`Please enter a valid number between ${MIN_TARGET_CAPITAL_LGR.toLocaleString()} and ${MAX_TARGET_CAPITAL_LGR.toLocaleString()} LGR`);
  }
  
  // Convert string to number and validate
  const lgrValue = parseFloat(lgrAmount);
  
  // Ensure the value is within bounds
  if (lgrValue < MIN_TARGET_CAPITAL_LGR) {
    throw new Error(`Minimum target capital is ${MIN_TARGET_CAPITAL_LGR.toLocaleString()} LGR ($${(MIN_TARGET_CAPITAL_LGR * LGR_PRICE_USD).toLocaleString()} USD)`);
  }
  if (lgrValue > MAX_TARGET_CAPITAL_LGR) {
    throw new Error(`Maximum target capital is ${MAX_TARGET_CAPITAL_LGR.toLocaleString()} LGR ($${(MAX_TARGET_CAPITAL_LGR * LGR_PRICE_USD).toLocaleString()} USD)`);
  }
  
  try {
    // Convert to string with no decimals (contract expects whole LGR amounts)
    const wholeLGRAmount = Math.floor(lgrValue).toString();
    // Convert to Wei (18 decimals)
    return ethers.utils.parseUnits(wholeLGRAmount, 18);
  } catch (error) {
    console.error("Error converting to wei:", error);
    throw new Error("Invalid amount format");
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
        {value && (
          <div className="text-sm bg-white/5 px-3 py-1.5 rounded-full text-teal-500 font-medium border border-teal-500/20 animate-fade-in">
            ≈ ${calculateUSDAmount(value)} USD
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder={`Enter amount in LGR (min: ${MIN_TARGET_CAPITAL_LGR.toLocaleString()})`}
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
