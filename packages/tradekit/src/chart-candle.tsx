"use client"

import { useMemo } from "react"
import useChartData from "./hooks/use-chart-data"
import useChartDisplay from "./hooks/use-chart-display"

export type CandleChartCandleProps = {
  className?: string
}

export default function ChartCandles({
  className,
}: CandleChartCandleProps) {
  const { data } = useChartData()
  const {
    candleWidth,
    columnWidth,
    getAbsYCoord,
    offsetX,
    viewportWidth,
  } = useChartDisplay()

  const { bullishPath, bearishPath } = useMemo(() => {
    if (columnWidth <= 0 || viewportWidth <= 0 || data.length === 0) {
      return { bullishPath: "", bearishPath: "" }
    }

    const absCandleWidth = Math.abs(candleWidth)
    const halfWidth = absCandleWidth / 2

    const startIndex = Math.max(0, Math.floor(-offsetX / columnWidth))
    const endIndex = Math.min(
      data.length - 1,
      Math.floor((-offsetX + viewportWidth) / columnWidth)
    )

    let bullD = ""
    let bearD = ""

    for (let i = startIndex; i <= endIndex; i++) {
      const candle = data[i]
      if (!candle) continue

      const up = candle.close > candle.open

      const x = offsetX + columnWidth * i + columnWidth * 0.1
      const midX = x + halfWidth

      const barTop = getAbsYCoord(up ? candle.close : candle.open)
      const barBottom = getAbsYCoord(up ? candle.open : candle.close)
      const barHeight = Math.abs(barBottom - barTop)
      const yMin = Math.min(barTop, barBottom)

      const wickBottom = getAbsYCoord(candle.low)
      const wickTop = getAbsYCoord(candle.high)

      let candleGeometry = `M ${x} ${yMin} h ${absCandleWidth} v ${barHeight} h ${-absCandleWidth} z `

      candleGeometry += `M ${midX} ${barTop} L ${midX} ${wickTop} `
      candleGeometry += `M ${midX} ${barBottom} L ${midX} ${wickBottom} `

      if (up) {
        bullD += candleGeometry
      } else {
        bearD += candleGeometry
      }
    }

    return { bullishPath: bullD, bearishPath: bearD }
  }, [
    data,
    candleWidth,
    columnWidth,
    getAbsYCoord,
    offsetX,
    viewportWidth,
  ])

  return (
    <g className={className}>
      {bullishPath && (
        <path
          d={bullishPath}
          style={{
            fill: "var(--chart-bull)",
            stroke: "var(--chart-bull-stroke)",
            strokeWidth: 1,
          }}
        />
      )}

      {bearishPath && (
        <path
          d={bearishPath}
          style={{
            fill: "var(--chart-bear)",
            stroke: "var(--chart-bear-stroke)",
            strokeWidth: 1,
          }}
        />
      )}
    </g>
  )
}
