"use client"

import Candle from "./candle"
import useChartData from "./use-chart-data"
import useChartDisplay from "./use-chart-display"

export default function Graph() {
  const { data } = useChartData()
  const {dimensions: {candleWidth, columnWidth}} = useChartDisplay()
  return (
    <g>
      {data.map((candle, i) => (
        <Candle
          data={candle}
          key={candle.time}
          width={candleWidth}
          x={columnWidth * i + columnWidth * 0.15}
        />
      ))}
    </g>
  )
}
