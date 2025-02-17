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

// Constants in USD terms
const MIN_TARGET_CAPITAL_USD = 1000;
const MAX_TARGET_CAPITAL_USD = 25000000;
const LGR_PRICE_USD = 0.10; // $0.10 per LGR token

export const convertUSDToLGRWei = (usdAmount: string): ethers.BigNumber => {
  if (!usdAmount || isNaN(parseFloat(usdAmount))) return ethers.BigNumber.from(0);
  
  // Convert USD to LGR tokens (as a number first)
  const usdValue = parseFloat(usdAmount);
  const lgrAmount = usdValue / LGR_PRICE_USD;
  
  // Validate LGR amount against contract bounds (1,000 - 25,000,000 LGR)
  const wholeLGRAmount = Math.floor(lgrAmount);
  if (wholeLGRAmount < 1000) {
    throw new Error(`Minimum target capital is 1,000 LGR (${1000 * LGR_PRICE_USD} USD)`);
  }
  if (wholeLGRAmount > 25000000) {
    throw new Error(`Maximum target capital is 25,000,000 LGR (${25000000 * LGR_PRICE_USD} USD)`);
  }
  
  try {
    // Now convert the whole LGR amount to wei (this adds 18 decimals)
    return ethers.utils.parseUnits(wholeLGRAmount.toString(), 18);
  } catch (error) {
    console.error("Error converting to wei:", error);
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
    // Limit to 2 decimal places
    if (parts[1]?.length > 2) {
      return `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    return numericValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    onChange(formattedValue);
  };

  const calculateLGRAmount = (usdAmount: string): string => {
    if (!usdAmount) return "0";
    const usdValue = parseFloat(usdAmount);
    if (isNaN(usdValue)) return "0";
    const lgrAmount = usdValue / LGR_PRICE_USD;
    return Math.floor(lgrAmount).toString(); // Return whole tokens only
  };

  const getHelperText = () => {
    if (!value) return "";
    const usdValue = parseFloat(value);
    if (isNaN(usdValue)) return "Please enter a valid number";
    if (usdValue < MIN_TARGET_CAPITAL_USD) {
      return `Minimum target capital is $${MIN_TARGET_CAPITAL_USD.toLocaleString()} USD`;
    }
    if (usdValue > MAX_TARGET_CAPITAL_USD) {
      return `Maximum target capital is $${MAX_TARGET_CAPITAL_USD.toLocaleString()} USD`;
    }
    return "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium text-white mb-2 flex items-center gap-2">
          Target Capital
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </Label>
        <div className="text-sm text-gray-400">
          {value && `≈ ${calculateLGRAmount(value)} LGR`}
        </div>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter amount in USD"
          className={cn(
            "bg-black/50 border-white/10 text-white placeholder:text-gray-500 pl-12",
            error ? "border-red-500" : ""
          )}
          value={value}
          onChange={handleChange}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
      </div>
      {(error || getHelperText()) && (
        <p className="text-sm text-red-500">
          {error?.[0] || getHelperText()}
        </p>
      )}
    </div>
  );
};
