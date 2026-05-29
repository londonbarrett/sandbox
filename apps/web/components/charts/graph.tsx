"use client"

import { useMemo } from "react"
import useChartData from "./use-chart-data"
import useChartDisplay from "./use-chart-display"

// TODO: This conponent should be named OHLCV
export default function Graph() {
  const { data } = useChartData()
  const { candleWidth, columnWidth, getAbsYCoord } = useChartDisplay()
  const { offsetX } = useChartDisplay()

  // Memoize path generation so it only recalculated when data or widths change
  const { bullishPath, bearishPath } = useMemo(() => {
    let bullD = ""
    let bearD = ""

    const absCandleWidth = Math.abs(candleWidth)
    const halfWidth = absCandleWidth / 2

    for (let i = 0; i < data.length; i++) {
      const candle = data[i]

      if (!candle) continue

      const up = candle.close > candle.open

      // TODO: 0.1 should be a value in a config object related to column width
      const x = columnWidth * i + columnWidth * 0.1
      const midX = x + halfWidth

      const barTop = getAbsYCoord(up ? candle.close : candle.open)
      const barBottom = getAbsYCoord(up ? candle.open : candle.close)
      const barHeight = Math.abs(barBottom - barTop)
      const yMin = Math.min(barTop, barBottom)

      const wickBottom = getAbsYCoord(candle.low)
      const wickTop = getAbsYCoord(candle.high)

      // --- 1. Path syntax for Candle Body (Rectangle using standard M -> H -> V -> H -> Z) ---
      // Move to top-left, draw top border, right border, bottom border, left border, close path
      let candleGeometry = `M ${x} ${yMin} h ${absCandleWidth} v ${barHeight} h ${-absCandleWidth} z `

      // --- 2. Path syntax for Wick lines (Move to coordinate -> line to coordinate) ---
      // Top wick
      candleGeometry += `M ${midX} ${barTop} L ${midX} ${wickTop} `
      // Bottom wick
      candleGeometry += `M ${midX} ${barBottom} L ${midX} ${wickBottom} `

      // Append data string to the correct color bucket
      if (up) {
        bullD += candleGeometry
      } else {
        bearD += candleGeometry
      }
    }

    return { bullishPath: bullD, bearishPath: bearD }
  }, [data, candleWidth, columnWidth, getAbsYCoord])

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      {/* All Bullish (Green) Candles Painted Instantly */}
      {bullishPath && (
        <path
          d={bullishPath}
          className="fill-teal-400 stroke-teal-700 stroke-1 transform-content"
        />
      )}

      {/* All Bearish (Red) Candles Painted Instantly */}
      {bearishPath && (
        <path
          d={bearishPath}
          className="fill-rose-400 stroke-rose-700 stroke-1 transform-content"
        />
      )}
    </g>
  )
}
