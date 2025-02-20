
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formAnimationVariants } from "@/lib/animations";

interface TargetCapitalInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string[];
}

const MIN_TARGET_CAPITAL_LGR = 1000;
const MAX_TARGET_CAPITAL_LGR = 25000000;

export const TargetCapitalInput = ({
  value,
  onChange,
  error
}: TargetCapitalInputProps) => {
  const formatValue = (val: string) => {
    const numericValue = val.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) return value;
    if (parts.length > 1) {
      return parts[0];
    }
    return numericValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    onChange(formattedValue);
  };

  return (
    <motion.div 
      variants={formAnimationVariants.field}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Label className="text-lg flex items-center gap-2 bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] bg-clip-text text-transparent font-semibold">
          Target Capital
          <HelpCircle className="h-4 w-4 text-[#9b87f5]/60" />
        </Label>
      </div>

      <div className="space-y-6 rounded-xl bg-[#1A1F2C] border border-[#9b87f5]/20 p-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter amount in LGR"
            className={cn(
              "h-14 px-16 text-xl font-medium",
              "bg-[#221F26] border-2 transition-all duration-300",
              "placeholder:text-white/20 rounded-lg",
              error ? "border-red-500" : "border-[#9b87f5]/20",
              "focus:border-[#9b87f5] focus:ring-1 focus:ring-[#9b87f5]/50",
              "hover:border-[#9b87f5]/40"
            )}
            value={value}
            onChange={handleChange}
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9b87f5]/60 font-medium">
            LGR
          </span>
        </div>

        <div className="flex justify-between text-sm text-[#9b87f5]/60">
          <span>Min: {MIN_TARGET_CAPITAL_LGR.toLocaleString()} LGR</span>
          <span>Max: {MAX_TARGET_CAPITAL_LGR.toLocaleString()} LGR</span>
        </div>
      </div>
    </motion.div>
  );
};
