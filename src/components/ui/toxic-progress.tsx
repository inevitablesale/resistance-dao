
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const ToxicProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const percentage = value || 0;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-black/50 border border-toxic-neon/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all bg-gradient-to-r from-toxic-dark via-toxic-muted to-toxic-neon",
          "relative overflow-hidden"
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      >
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-toxic-neon to-transparent -translate-x-full animate-[shine_2s_ease-in-out_infinite]"></div>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
})
ToxicProgress.displayName = ProgressPrimitive.Root.displayName

export { ToxicProgress }
