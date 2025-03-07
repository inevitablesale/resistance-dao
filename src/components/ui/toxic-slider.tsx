import * as React from "react";
import { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { Radiation } from "lucide-react";

const ToxicSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    showValue?: boolean;
    valuePrefix?: string;
    valueSuffix?: string;
    glowIntensity?: "low" | "medium" | "high";
    showRadiation?: boolean;
  }
>(({ 
  className, 
  showValue = false, 
  valuePrefix = "", 
  valueSuffix = "", 
  glowIntensity = "medium",
  showRadiation = false,
  ...props 
}, ref) => {
  const [hovering, setHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);
  
  const handleDragStart = () => {
    setIsDragging(true);
    // Play sound effect if needed
    const audio = new Audio("/sounds/slider-click.mp3");
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    // Play sound effect if needed
    const audio = new Audio("/sounds/slider-release.mp3");
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };
  
  const glowClasses = {
    low: "shadow-[0_0_3px_rgba(57,255,20,0.3)]",
    medium: "shadow-[0_0_8px_rgba(57,255,20,0.5)]",
    high: "shadow-[0_0_15px_rgba(57,255,20,0.7)]"
  };
  
  return (
    <div className="relative">
      <SliderPrimitive.Root
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-black/50 border border-toxic-neon/20">
          <SliderPrimitive.Range className="absolute h-full bg-toxic-neon/70" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb 
          className={cn(
            "block h-5 w-5 rounded-full border border-toxic-neon bg-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic-neon focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            glowClasses[glowIntensity],
            (hovering || isDragging) && "h-6 w-6 border-2"
          )}
        >
          {showRadiation && (
            <Radiation className="h-3 w-3 text-toxic-neon absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      
      {showValue && props.value && (
        <div className="mt-1 text-xs text-toxic-neon font-mono">
          {valuePrefix}{Array.isArray(props.value) ? props.value[0] : props.value}{valueSuffix}
        </div>
      )}
    </div>
  );
});

ToxicSlider.displayName = SliderPrimitive.Root.displayName;

export { ToxicSlider };
