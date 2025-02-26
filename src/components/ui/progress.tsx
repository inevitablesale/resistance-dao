
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Calculate the gradient color based on progress percentage
  const getProgressColor = (percentage: number) => {
    if (percentage <= 25) return 'from-rose-400 to-pink-500';
    if (percentage <= 50) return 'from-amber-400 to-orange-500';
    if (percentage <= 75) return 'from-blue-400 to-indigo-500';
    return 'from-emerald-400 to-teal-500';
  };

  const percentage = value || 0;
  const gradientClass = getProgressColor(percentage);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all bg-gradient-to-r",
          gradientClass
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
