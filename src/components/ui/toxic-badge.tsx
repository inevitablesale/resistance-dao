
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toxicBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 toxic-glow",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-toxic-dark text-toxic-neon border border-toxic-neon/50 shadow-[0_0_8px_rgba(57,255,20,0.3)]",
        secondary:
          "border-transparent bg-black/40 text-toxic-muted border border-toxic-neon/30",
        outline: "text-toxic-neon border border-toxic-neon/50",
        danger: "bg-red-950 text-red-400 border border-red-500/50 shadow-[0_0_8px_rgba(255,0,0,0.3)]",
        warning: "bg-amber-950 text-amber-400 border border-amber-500/50 shadow-[0_0_8px_rgba(255,192,20,0.3)]",
        success: "bg-green-950 text-green-400 border border-green-500/50 shadow-[0_0_8px_rgba(0,255,128,0.3)]",
        info: "bg-blue-950 text-blue-400 border border-blue-500/50 shadow-[0_0_8px_rgba(20,192,255,0.3)]",
        critical: "bg-red-950 text-red-400 border border-red-500/70 shadow-[0_0_12px_rgba(255,0,0,0.5)] animate-pulse",
        access: "bg-purple-950 text-purple-400 border border-purple-500/50 shadow-[0_0_8px_rgba(192,20,255,0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToxicBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toxicBadgeVariants> {}

function ToxicBadge({ className, variant, ...props }: ToxicBadgeProps) {
  return (
    <div className={cn(toxicBadgeVariants({ variant }), className)} {...props} />
  )
}

export { ToxicBadge, toxicBadgeVariants }
