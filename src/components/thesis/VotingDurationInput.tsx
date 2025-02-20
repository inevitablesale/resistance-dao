
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { formAnimationVariants } from "@/lib/animations";

interface VotingDurationInputProps {
  value: number;
  onChange: (value: number[]) => void;
  error?: string[];
}

const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds

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
      className="space-y-4"
      variants={formAnimationVariants.field}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lg font-medium text-white flex items-center gap-2">
            Voting Duration
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </Label>
          <p className="text-sm text-gray-400">Set how long the community can vote on your thesis</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            className="text-right"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={value}
          >
            <span className="text-2xl font-bold text-white">
              {getDurationText(value)}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          {DURATION_PRESETS.map((preset) => (
            <motion.button
              key={preset.value}
              onClick={() => onChange([preset.value])}
              className={cn(
                "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all",
                value === preset.value 
                  ? "bg-yellow-500 text-black font-medium" 
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {preset.label}
            </motion.button>
          ))}
        </div>

        <Slider
          value={[value]}
          min={MIN_VOTING_DURATION}
          max={MAX_VOTING_DURATION}
          step={24 * 60 * 60} // 1 day steps
          className="w-full"
          onValueChange={onChange}
          defaultValue={[MAX_VOTING_DURATION]}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-400">
        <span>7 days (min)</span>
        <span>90 days (max)</span>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p 
            className="text-sm text-red-500"
            variants={formAnimationVariants.error}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, height: 0 }}
          >
            {error[0]}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
