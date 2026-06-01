"use client"

import { useMemo } from "react"
import useChartData from "./use-chart-data"
import useChartDisplay from "./use-chart-display"

// TODO: This conponent should be named OHLCV
export default function Graph() {
  const { data } = useChartData()
  const { candleWidth, columnWidth, getAbsYCoord, offsetX, viewportWidth } =
    useChartDisplay()

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
  }, [data, candleWidth, columnWidth, getAbsYCoord, offsetX, viewportWidth])

  return (
    <>
      {bullishPath && (
        <path
          d={bullishPath}
          className="fill-teal-400 stroke-teal-700 stroke-1 transform-content"
        />
      )}

      {bearishPath && (
        <path
          d={bearishPath}
          className="fill-rose-400 stroke-rose-700 stroke-1 transform-content"
        />
      )}
    </>
  )
}
