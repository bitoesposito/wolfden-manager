"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  variant,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  variant?: "default" | "warning" | "orange" | "destructive"
  "aria-label"?: string
}) {
  const displayValue = value || 0;
  
  // Determine colors based on variant:
  // Primary (undefined): timer not started or empty bar
  // Green (default): active timer with > 30 minutes
  // Yellow (warning): <= 30 minutes
  // Orange: <= 20 minutes
  // Red (destructive): <= 10 minutes or expired
  const getColors = () => {
    switch (variant) {
      case "destructive":
        return {
          bg: "bg-destructive/20",
          indicator: "bg-destructive"
        };
      case "orange":
        return {
          bg: "bg-orange-500/20",
          indicator: "bg-orange-500"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/20",
          indicator: "bg-yellow-500"
        };
      case "default":
        return {
          bg: "bg-green-500/20",
          indicator: "bg-green-500"
        };
      default:
        // Primary theme color when variant is undefined (timer not started)
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
      aria-label={ariaLabel}
      aria-valuenow={displayValue}
      aria-valuemin={0}
      aria-valuemax={100}
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
