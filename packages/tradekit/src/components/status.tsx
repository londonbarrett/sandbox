"use client"

import { useMemo } from "react"
import { useChart } from "../hooks/use-chart"
import { useCoords } from "../hooks/use-coords"
import { getCurrencyFormatter } from "../util"

export type StatusProps = {
  className?: string
  symbol: string
  interval: string
  showIndex?: boolean
  showIndicators?: boolean
  showOHLCV?: boolean
}

function formatIndicatorKey(key: string): string {
  return key.toUpperCase()
}

export function Status({
  className,
  symbol,
  interval,
  showIndex = false,
  showIndicators = false,
  showOHLCV,
}: StatusProps) {
  const { coords } = useCoords()
  const { hasPriceGraph, indicators } = useChart()
  const formatCurrency = getCurrencyFormatter
  const showOHLCVValue = showOHLCV ?? hasPriceGraph
  const candle = coords.candle

  const indicatorEntries = useMemo(() => {
    if (!showIndicators) return []

    return Object.entries(indicators).flatMap(([key, values]) => {
      const value = candle ? values[candle.index] : undefined
      if (value === null || value === undefined) {
        return [`${formatIndicatorKey(key)}: --`]
      }
      return [`${formatIndicatorKey(key)}: ${formatCurrency(value)}`]
    })
  }, [showIndicators, candle, indicators, formatCurrency])

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
        {showOHLCVValue && candle ? (
          <tspan
            style={{
              fill:
                candle.close >= candle.open
                  ? "var(--chart-bull)"
                  : "var(--chart-bear)",
            }}
          >
            {showIndex && `i: ${candle.index} `}O:{" "}
            {formatCurrency(candle.open)} H:{" "}
            {formatCurrency(candle.high)} L:{" "}
            {formatCurrency(candle.low)} C:{" "}
            {formatCurrency(candle.close)}
          </tspan>
        ) : showOHLCVValue ? (
          <tspan>{showIndex && `i: -- O: -- H: -- L: -- C: --`}</tspan>
        ) : null}
        {indicatorEntries.length > 0 && (
          <tspan>{showOHLCVValue ? " " : ""}{indicatorEntries.join(" ")}</tspan>
        )}
      </text>
    </g>
  )
}
