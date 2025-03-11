
import React from "react";
import { HunterTierLevel } from "@/types/content";
import { Shield, Award, Trophy, Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HunterTierBadgeProps {
  tier: HunterTierLevel;
  multiplier: number;
  progress?: number;
  compact?: boolean;
  className?: string;
}

const tierConfig = {
  bronze: {
    color: "text-amber-700",
    bgColor: "bg-amber-700/10",
    borderColor: "border-amber-700/20",
    icon: Shield,
    label: "Bronze",
  },
  silver: {
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
    borderColor: "border-slate-400/20",
    icon: Award,
    label: "Silver",
  },
  gold: {
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    icon: Trophy,
    label: "Gold",
  },
  platinum: {
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
    icon: Crown,
    label: "Platinum",
  }
};

export const HunterTierBadge: React.FC<HunterTierBadgeProps> = ({
  tier,
  multiplier,
  progress,
  compact = false,
  className
}) => {
  const config = tierConfig[tier];
  const Icon = config.icon;
  
  if (compact) {
    return (
      <div 
        className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
          config.bgColor,
          config.color,
          className
        )}
      >
        <Icon className="h-3.5 w-3.5 mr-1" />
        <span>{config.label}</span>
      </div>
    );
  }
  
  return (
    <div className={cn("rounded-lg border p-3", config.borderColor, className)}>
      <div className="flex items-center mb-2">
        <Icon className={cn("h-5 w-5 mr-2", config.color)} />
        <span className={cn("font-medium", config.color)}>{config.label} Hunter</span>
        <div className="ml-auto bg-black/20 text-white text-xs font-medium px-2 py-0.5 rounded">
          {multiplier.toFixed(1)}x
        </div>
      </div>
      
      {typeof progress === 'number' && progress < 100 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Next tier progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-1.5" 
            indicatorClassName={cn(
              progress > 66 ? "bg-green-500" :
              progress > 33 ? "bg-yellow-500" :
              "bg-red-500"
            )}
          />
        </div>
      )}
    </div>
  );
};

export default HunterTierBadge;
