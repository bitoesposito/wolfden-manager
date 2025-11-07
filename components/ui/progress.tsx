"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  variant?: "default" | "warning" | "destructive"
}) {
  const displayValue = value || 0;
  
  // Determine colors based on variant
  const getColors = () => {
    switch (variant) {
      case "destructive":
        return {
          bg: "bg-destructive/20",
          indicator: "bg-destructive"
        };
      case "warning":
        return {
          bg: "bg-orange-500/20",
          indicator: "bg-orange-500"
        };
      default:
        return {
          bg: "bg-primary/20",
          indicator: "bg-primary"
        };
    }
  };
  
  const colors = getColors();
  
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        colors.bg,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-transform duration-1000 ease-linear",
          colors.indicator
        )}
        style={{ transform: `translateX(-${100 - Math.min(100, displayValue)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
