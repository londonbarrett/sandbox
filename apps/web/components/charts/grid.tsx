"use client"

import * as d3 from "d3"
import { useMemo } from "react"
import useChartData from "./use-chart-data"
import useChartDisplay from "./use-chart-display"

export default function Grid() {
  const { dimensions: { graphWidth, height } } = useChartDisplay()
  const { maxValue, minValue } = useChartData()
  const lines = useMemo(() => {
    const scale = d3
      .scaleLinear()
      .domain([maxValue, minValue])
      .range([0, height])
    const pixelsPerLine = 50
    const numberOfTicksTarget = Math.max(1, Math.floor(height / pixelsPerLine))
    return scale.ticks(numberOfTicksTarget).map((value, index) => ({
      value,
      offset: scale(value),
      key: `${value}-${index}`,
    }))
  }, [height, maxValue, minValue])
  return (
    <g>
      {lines.map(({ offset, key }) => (
        <line
          className="stroke-blue-200/30"
          key={key}
          x1={0}
          x2={graphWidth}
          y1={offset}
          y2={offset}
        />
      ))}
    </g>
  )
}
