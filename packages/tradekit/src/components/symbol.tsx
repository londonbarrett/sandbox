"use client"

import { cn } from "../lib/utils"
import { usePanel } from "../hooks/use-panel"

export type SymbolProps = {
  className?: string
  symbol: string
  interval: string
}

export function Symbol({ className, symbol, interval }: SymbolProps) {
  const { valueAxisWidth } = usePanel()

  return (
    <text
      className={cn(
        className,
        "fill-chart-watermark font-bold select-none",
      )}
      textAnchor="middle"
      dominantBaseline="middle"
      transform={`translate(${-(valueAxisWidth / 2)}, 0)`}
      x="50%"
      y="50%"
      style={{ fontSize: "clamp(1.5rem, 5vw, 4.5rem)" }}
    >
      {`${symbol} - ${interval}`}
    </text>
  )
}
