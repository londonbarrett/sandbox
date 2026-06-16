"use client"

import { cn } from "../lib/utils"
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

  return (
    <g className={cn(className)}>
      <foreignObject x={0} y={0} width={600} height={200}>
        <div className="p-4 font-mono text-xs text-chart-label flex flex-col gap-2">
          <div className="text-sm font-bold">
            {symbol} - {interval}
          </div>
          {showOHLCVValue && (
            <div
              data-direction={
                candle
                  ? candle.close >= candle.open
                    ? "bull"
                    : "bear"
                  : undefined
              }
              className="data-[direction=bull]:text-chart-bull data-[direction=bear]:text-chart-bear"
            >
              {showIndex && `i: ${candle ? candle.index : "--"} `}O:{" "}
              {candle ? formatCurrency(candle.open) : "--"} H:{" "}
              {candle ? formatCurrency(candle.high) : "--"} L:{" "}
              {candle ? formatCurrency(candle.low) : "--"} C:{" "}
              {candle ? formatCurrency(candle.close) : "--"}
            </div>
          )}
          {showIndicators &&
            Object.entries(indicators).map(([key, values]) => {
              const value = candle ? values[candle.index] : undefined
              const display =
                value !== null && value !== undefined
                  ? formatCurrency(value)
                  : "--"
              return (
                <div key={key}>
                  {formatIndicatorKey(key)}: {display}
                </div>
              )
            })}
        </div>
      </foreignObject>
    </g>
  )
}
