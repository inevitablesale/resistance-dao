
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

const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000");
const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000");

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
    return numericValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    onChange(formattedValue);
  };

  const getHelperText = () => {
    if (!value) return "Required";
    const numValue = ethers.utils.parseEther(value || "0");
    if (numValue.lt(MIN_TARGET_CAPITAL)) {
      return `Minimum target capital is ${ethers.utils.formatEther(MIN_TARGET_CAPITAL)} ETH`;
    }
    if (numValue.gt(MAX_TARGET_CAPITAL)) {
      return `Maximum target capital is ${ethers.utils.formatEther(MAX_TARGET_CAPITAL)} ETH`;
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
          {value && `≈ ${ethers.utils.formatEther(ethers.utils.parseEther(value || "0"))} ETH`}
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
