
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formAnimationVariants } from "@/lib/animations";
import { LGR_PRICE_USD } from "@/lib/constants";

interface TargetCapitalInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string[];
}

// Constants in LGR terms
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

  const getValidationStatus = () => {
    if (!value) return "neutral";
    const lgrValue = parseFloat(value);
    if (isNaN(lgrValue)) return "error";
    if (lgrValue < MIN_TARGET_CAPITAL_LGR || lgrValue > MAX_TARGET_CAPITAL_LGR) return "error";
    return "success";
  };

  return (
    <motion.div 
      className="space-y-2"
      variants={formAnimationVariants.field}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium text-white mb-2 flex items-center gap-2">
          Target Capital (LGR)
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </Label>
        <AnimatePresence mode="wait">
          <motion.div 
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm text-gray-400"
          >
            {value && `≈ $${calculateUSDAmount(value)} USD`}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter amount in LGR"
          className={cn(
            "bg-black/50 border-white/10 text-white placeholder:text-gray-500 pl-12 transition-all duration-200",
            error ? "border-red-500 animate-shake" : 
            getValidationStatus() === "success" ? "border-green-500" : "",
            "focus:ring-2 focus:ring-yellow-500/20 hover:border-white/20"
          )}
          value={value}
          onChange={handleChange}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">LGR</span>
      </div>
      <AnimatePresence mode="wait">
        {(error || getHelperText()) && (
          <motion.p 
            className={cn(
              "text-sm",
              error ? "text-red-500" : "text-gray-400"
            )}
            variants={formAnimationVariants.error}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, height: 0 }}
          >
            {error?.[0] || getHelperText()}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
