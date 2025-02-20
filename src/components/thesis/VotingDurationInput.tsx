
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Clock, AlertTriangle } from "lucide-react";
import { formAnimationVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface VotingDurationInputProps {
  value: number;
  onChange: (value: number[]) => void;
  error?: string[];
}

const MIN_VOTING_DURATION = 7 * 24 * 60 * 60;
const MAX_VOTING_DURATION = 90 * 24 * 60 * 60;

const DURATION_PRESETS = [
  { label: "1 week", value: 7 * 24 * 60 * 60 },
  { label: "2 weeks", value: 14 * 24 * 60 * 60 },
  { label: "1 month", value: 30 * 24 * 60 * 60 },
  { label: "2 months", value: 60 * 24 * 60 * 60 },
  { label: "3 months", value: 90 * 24 * 60 * 60 }
];

export const VotingDurationInput = ({
  value,
  onChange,
  error
}: VotingDurationInputProps) => {
  const getDurationText = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    if (days === 7) return "1 week";
    if (days === 14) return "2 weeks";
    if (days === 30) return "1 month";
    if (days === 60) return "2 months";
    if (days === 90) return "3 months";
    return `${days} days`;
  };

  return (
    <motion.div 
      variants={formAnimationVariants.field}
      initial="initial"
      animate="animate"
      className="relative"
    >
      <div className="space-y-6 p-6 rounded-xl bg-[#1A1F2C] border border-[#9b87f5]/20">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-lg font-semibold bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] bg-clip-text text-transparent flex items-center gap-2">
                Voting Duration
                <HelpCircle className="h-4 w-4 text-[#9b87f5]/60" />
              </Label>
              <p className="text-[#9b87f5]/60 text-sm">Set how long the community can vote on your thesis</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#221F26] border border-[#9b87f5]/20">
              <Clock className="w-4 h-4 text-[#9b87f5]" />
              <span className="text-xl font-medium text-white">
                {getDurationText(value)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-2">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onChange([preset.value])}
                className={cn(
                  "p-4 rounded-xl text-sm transition-all duration-300",
                  "border-2",
                  value === preset.value 
                    ? "bg-[#9b87f5] text-white border-transparent" 
                    : "bg-[#221F26] text-[#9b87f5]/60 border-[#9b87f5]/20 hover:border-[#9b87f5]/40"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Slider
              value={[value]}
              min={MIN_VOTING_DURATION}
              max={MAX_VOTING_DURATION}
              step={24 * 60 * 60}
              className="w-full"
              onValueChange={onChange}
              defaultValue={[MAX_VOTING_DURATION]}
            />
            
            <div className="flex justify-between text-sm text-[#9b87f5]/60">
              <span>7 days (min)</span>
              <span>90 days (max)</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p 
              className="flex items-center gap-2 text-sm text-red-500"
              variants={formAnimationVariants.error}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertTriangle className="w-4 h-4" />
              {error[0]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
