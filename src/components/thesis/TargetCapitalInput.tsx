
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HelpCircle, AlertTriangle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const getProgressPercent = () => {
    if (!value) return 0;
    const lgrValue = parseFloat(value);
    if (isNaN(lgrValue)) return 0;
    return Math.min(100, Math.max(0, 
      ((lgrValue - MIN_TARGET_CAPITAL_LGR) / (MAX_TARGET_CAPITAL_LGR - MIN_TARGET_CAPITAL_LGR)) * 100
    ));
  };

  return (
    <motion.div 
      variants={formAnimationVariants.field}
      initial="initial"
      animate="animate"
      className="relative"
    >
      <div className="space-y-6 p-6 rounded-2xl bg-[#1A1325]/10 backdrop-blur-lg border border-[#8247E5]/20 
        hover:border-[#8247E5]/40 transition-all duration-300 group">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold bg-gradient-to-r from-[#8247E5] to-[#A379FF] 
              bg-clip-text text-transparent flex items-center gap-2">
              Target Capital
              <HelpCircle className="h-4 w-4 text-[#8247E5]/60" />
            </Label>
            <AnimatePresence mode="wait">
              {getValidationStatus() === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 text-[#00FFB7] text-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Valid Amount</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Enter amount in LGR"
              className={cn(
                "h-16 px-14 text-2xl font-medium bg-black/20 border-2 transition-all duration-300",
                "placeholder:text-white/20 rounded-xl",
                error ? "border-[#FF3B3B] shadow-[0_0_15px_rgba(255,59,59,0.1)]" : 
                getValidationStatus() === "success" 
                  ? "border-[#00FFB7] shadow-[0_0_15px_rgba(0,255,183,0.1)]" 
                  : "border-[#8247E5]/20 group-hover:border-[#8247E5]/40",
                "focus:border-[#8247E5] focus:shadow-[0_0_20px_rgba(130,71,229,0.2)]"
              )}
              value={value}
              onChange={handleChange}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">LGR</span>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 rounded-b-xl overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#8247E5] to-[#A379FF]"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercent()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              className="flex justify-between items-center text-sm text-white/40"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <span>Min: {MIN_TARGET_CAPITAL_LGR.toLocaleString()} LGR</span>
              <span>Max: {MAX_TARGET_CAPITAL_LGR.toLocaleString()} LGR</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-end gap-1"
          >
            {value && (
              <span className="text-3xl font-bold text-white">
                ≈ ${calculateUSDAmount(value)} USD
              </span>
            )}
            {(error || getHelperText()) && (
              <motion.div 
                className={cn(
                  "flex items-center gap-2 text-sm",
                  error ? "text-[#FF3B3B]" : "text-white/60"
                )}
                variants={formAnimationVariants.error}
                initial="initial"
                animate="animate"
              >
                {error && <AlertTriangle className="w-4 h-4" />}
                <span>{error?.[0] || getHelperText()}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
