"use client"

import { useMemo } from "react"
import useChartData from "./use-chart-data"
import useChartDisplay from "./use-chart-display"
import { createLinearScale, niceTicks } from "./util"

export default function Grid() {
  const { height, viewportWidth } = useChartDisplay()
  const { maxValue, minValue } = useChartData()
  const lines = useMemo(() => {
    const scale = createLinearScale([maxValue, minValue], [0, height])
    const pixelsPerLine = 50
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(height / pixelsPerLine)
    )
    return niceTicks(minValue, maxValue, numberOfTicksTarget).map(
      (value, index) => ({
        value,
        offset: scale(value),
        key: `${value}-${index}`,
      })
    )
  }, [height, maxValue, minValue])
  return (
    <g>
      {lines.map(({ offset, key }) => (
        <line
          className="stroke-blue-200/30"
          key={key}
          x1={0}
          x2={viewportWidth}
          y1={offset}
          y2={offset}
        />
      ))}
    </g>
  )
}
