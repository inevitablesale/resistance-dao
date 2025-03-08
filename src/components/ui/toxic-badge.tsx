
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-toxic-neon text-background shadow hover:bg-toxic-neon/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-apocalypse-red text-destructive-foreground shadow hover:bg-apocalypse-red/80",
        outline: "border border-toxic-neon/30 text-toxic-neon hover:bg-toxic-neon/10",
        alert: "border border-apocalypse-red/30 text-apocalypse-red animate-pulse",
        warning: "border border-yellow-400/30 text-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function ToxicBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { ToxicBadge, badgeVariants }
