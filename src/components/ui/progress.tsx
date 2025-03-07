
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Calculate the gradient color based on progress percentage
  const getProgressColor = (percentage: number) => {
    if (percentage <= 25) return 'from-apocalypse-red to-toxic-dark';
    if (percentage <= 50) return 'from-toxic-dark to-toxic-army';
    if (percentage <= 75) return 'from-toxic-army to-toxic-muted';
    return 'from-toxic-muted to-toxic-neon';
  };

  const percentage = value || 0;
  const gradientClass = getProgressColor(percentage);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-black border border-toxic-muted/30",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all bg-gradient-to-r",
          gradientClass,
          "relative overflow-hidden"
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      >
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-toxic-neon to-transparent -translate-x-full animate-[shine_2s_ease-in-out_infinite]"></div>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
