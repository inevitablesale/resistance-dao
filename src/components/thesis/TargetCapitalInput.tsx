
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

// Helper to ensure the value fits in uint128
const MAX_UINT128 = ethers.BigNumber.from(2).pow(128).sub(1);

export const convertUSDToLGRWei = (lgrAmount: string): ethers.BigNumber => {
  if (!lgrAmount || isNaN(parseFloat(lgrAmount))) {
    throw new Error("Invalid amount");
  }
  
  // Convert string to number and validate
  const lgrValue = parseFloat(lgrAmount);
  const wholeLGRAmount = Math.floor(lgrValue);
  
  if (wholeLGRAmount < MIN_TARGET_CAPITAL_LGR) {
    throw new Error(`Minimum target capital is ${MIN_TARGET_CAPITAL_LGR.toLocaleString()} LGR ($${(MIN_TARGET_CAPITAL_LGR * LGR_PRICE_USD).toLocaleString()} USD)`);
  }
  if (wholeLGRAmount > MAX_TARGET_CAPITAL_LGR) {
    throw new Error(`Maximum target capital is ${MAX_TARGET_CAPITAL_LGR.toLocaleString()} LGR ($${(MAX_TARGET_CAPITAL_LGR * LGR_PRICE_USD).toLocaleString()} USD)`);
  }
  
  try {
    // Convert the whole LGR amount to wei (18 decimals)
    const weiValue = ethers.utils.parseUnits(wholeLGRAmount.toString(), 18);
    
    // Validate that the value fits in uint128
    if (weiValue.gt(MAX_UINT128)) {
      console.error("Value exceeds uint128 max:", {
        weiValue: weiValue.toString(),
        maxUint128: MAX_UINT128.toString()
      });
      throw new Error("Amount too large for contract (exceeds uint128)");
    }

    // Log the conversion details
    console.log("Target capital conversion:", {
      inputAmount: lgrAmount,
      wholeLGRAmount,
      weiValueDecimal: weiValue.toString(),
      weiValueHex: weiValue.toHexString(),
      fits_uint128: weiValue.lte(MAX_UINT128)
    });

    return weiValue;
  } catch (error) {
    console.error("Error converting to wei:", error);
    throw error;
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
