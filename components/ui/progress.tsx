"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  variant,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  variant?: "default" | "warning" | "orange" | "destructive"
}) {
  const displayValue = value || 0;
  
  // Determine colors based on variant
  // Colore primario (undefined): timer non avviato o barra vuota
  // Verde (default): timer attivo con > 30 minuti
  // Giallo (warning): <= 30 minuti
  // Arancio (orange): <= 20 minuti
  // Rosso (destructive): <= 10 minuti o scaduto
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
        // Colore primario del tema quando variant è undefined (timer non avviato)
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
