"use client"

import { memo } from "react"
import useChatDisplay from "../hooks/use-chart-display"

export type SymbolProps = {
  className?: string
  symbol: string
  interval: string
}

export default memo(function Symbol({
  className,
  symbol,
  interval,
}: SymbolProps) {
  const { valueAxisWidth } = useChatDisplay()

  return (
    <text
      className={className}
      style={{
        fill: "var(--chart-watermark)",
        fontSize: "clamp(1.5rem, 5vw, 4.5rem)",
        fontWeight: 700,
        userSelect: "none",
      }}
      textAnchor="middle"
      dominantBaseline="middle"
      transform={`translate(${-(valueAxisWidth / 2)}, 0)`}
      x="50%"
      y="50%"
    >
      {`${symbol} - ${interval}`}
    </text>
  )
})
