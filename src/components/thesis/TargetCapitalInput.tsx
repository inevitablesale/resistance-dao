
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formAnimationVariants } from "@/lib/animations";
import { LGR_PRICE_USD } from "@/lib/constants";

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
        <Label className="text-lg text-[#A379FF] flex items-center gap-2">
          Target Capital
          <HelpCircle className="h-4 w-4 text-[#8247E5]/60" />
        </Label>
      </div>

      <div className="space-y-6 rounded-xl bg-[#0A0B0D]/80 border border-[#8247E5]/20 p-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter amount in LGR"
            className={cn(
              "h-14 px-16 text-xl font-medium bg-black/40 border transition-all duration-300",
              "placeholder:text-white/20 rounded-lg",
              error ? "border-[#FF3B3B]" : "border-[#8247E5]/20",
              "focus:border-[#8247E5]/40 focus:ring-0"
            )}
            value={value}
            onChange={handleChange}
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40">
            LGR
          </span>
        </div>

        <div className="flex justify-between text-sm text-white/40">
          <span>Min: {MIN_TARGET_CAPITAL_LGR.toLocaleString()} LGR</span>
          <span>Max: {MAX_TARGET_CAPITAL_LGR.toLocaleString()} LGR</span>
        </div>
      </div>
    </motion.div>
  );
};
