
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toxicButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-toxic-dark text-toxic-neon border border-toxic-neon/60 shadow-[0_0_10px_rgba(57,255,20,0.3)]",
        outline: "border border-toxic-neon/80 bg-transparent text-toxic-neon shadow-[0_0_10px_rgba(57,255,20,0.2)]",
        ghost: "bg-transparent text-toxic-neon hover:bg-toxic-neon/10",
        glowing: "bg-toxic-dark/90 text-toxic-neon border border-toxic-neon shadow-[0_0_15px_rgba(57,255,20,0.5)]",
        marketplace: "bg-toxic-dark/80 text-toxic-neon border border-toxic-neon/80 shadow-[0_0_12px_rgba(57,255,20,0.4)] hover:bg-toxic-dark/60",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToxicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toxicButtonVariants> {
  asChild?: boolean
}

const ToxicButton = React.forwardRef<HTMLButtonElement, ToxicButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(toxicButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{props.children}</span>
        <span className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-toxic-neon/30 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_forwards]"></span>
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-toxic-neon/10 transition-opacity duration-300"></span>
        {variant === 'glowing' && (
          <>
            <span className="absolute inset-0 bg-toxic-neon/5 animate-pulse"></span>
            <span className="absolute -inset-[1px] border border-toxic-neon/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </>
        )}
        {variant === 'marketplace' && (
          <>
            <span className="absolute inset-0 bg-toxic-neon/5 animate-pulse"></span>
            <span className="absolute -inset-[1px] border border-toxic-neon/70 rounded-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-toxic-neon/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[gradient_3s_ease-in-out_infinite]"></span>
          </>
        )}
      </Comp>
    )
  }
)
ToxicButton.displayName = "ToxicButton"

export { ToxicButton, toxicButtonVariants }
