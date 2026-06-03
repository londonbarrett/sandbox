"use client"

import useMouseCoords from "./hooks/use-mouse-coords"
import { getCurrencyFormatter } from "./util"

export type CandleChartStatusProps = {
  className?: string
  symbol: string
  interval: string
  showIndex?: boolean
}

export default function CandleChartStatus({
  className,
  symbol,
  interval,
  showIndex = false,
}: CandleChartStatusProps) {
  const { coords } = useMouseCoords()
  const formatCurrency = getCurrencyFormatter

  return (
    <g
      className={className}
      style={{ transform: "translate(16px, 40px)" }}
    >
      <text
        style={{
          fill: "var(--chart-label)",
          fontSize: 14,
          fontWeight: 700,
        }}
        y={0}
      >
        {`${symbol} - ${interval}`}
      </text>
      <text style={{ fill: "var(--chart-label)", fontSize: 12 }} y={20}>
        {coords.candle ? (
          <tspan
            style={{
              fill:
                coords.candle.close >= coords.candle.open
                  ? "var(--chart-bull)"
                  : "var(--chart-bear)",
            }}
          >
            {showIndex && `i: ${coords.candle.index} `}O:{" "}
            {formatCurrency(coords.candle.open)} H:{" "}
            {formatCurrency(coords.candle.high)} L:{" "}
            {formatCurrency(coords.candle.low)} C:{" "}
            {formatCurrency(coords.candle.close)}
          </tspan>
        ) : (
          <tspan>{showIndex && `i: -- O: -- H: -- L: -- C: --`}</tspan>
        )}
      </text>
    </g>
  )
}
