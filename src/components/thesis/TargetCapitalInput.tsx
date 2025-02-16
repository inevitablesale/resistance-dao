
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

export const TargetCapitalInput = ({
  value,
  onChange,
  error
}: TargetCapitalInputProps) => {
  const formatValue = (val: string) => {
    const numericValue = val.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) return value;
    return numericValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    onChange(formattedValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-lg font-medium text-white flex items-center gap-2">
            Target Capital
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </Label>
          <p className="text-sm text-gray-400">
            Set the target capital for your investment thesis
          </p>
        </div>
        {value && (
          <div className="text-sm text-gray-400">
            ≈ {ethers.utils.formatEther(ethers.utils.parseEther(value || "0"))} ETH
          </div>
        )}
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Enter amount in USD"
          className={cn(
            "bg-[#161920] border-gray-800 text-white h-12 pl-8",
            error ? "border-red-500" : ""
          )}
          value={value}
          onChange={handleChange}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error[0]}</p>
      )}
    </div>
  );
};
