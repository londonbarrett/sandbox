"use client"

import { useMemo } from "react"
import useChartData from "./hooks/use-chart-data"
import useMouseCoords from "./hooks/use-mouse-coords"
import { getCurrencyFormatter } from "./util"

export type CandleChartStatusProps = {
  className?: string
  symbol: string
  interval: string
  showIndex?: boolean
  showIndicators?: boolean
}

function formatIndicatorKey(key: string): string {
  return key.toUpperCase()
}

export default function CandleChartStatus({
  className,
  symbol,
  interval,
  showIndex = false,
  showIndicators = false,
}: CandleChartStatusProps) {
  const { coords } = useMouseCoords()
  const { indicators } = useChartData()
  const formatCurrency = getCurrencyFormatter

  const indicatorEntries = useMemo(() => {
    if (!showIndicators || !coords.candle) return []

    return Object.entries(indicators).flatMap(([key, values]) => {
      const value = values[coords.candle!.index]
      if (value === null || value === undefined) return []
      return [`${formatIndicatorKey(key)}: ${formatCurrency(value)}`]
    })
  }, [showIndicators, coords.candle, indicators, formatCurrency])

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
            {indicatorEntries.length > 0 &&
              ` ${indicatorEntries.join(" ")}`}
          </tspan>
        ) : (
          <tspan>{showIndex && `i: -- O: -- H: -- L: -- C: --`}</tspan>
        )}
      </text>
    </g>
  )
}
