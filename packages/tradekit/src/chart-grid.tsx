"use client"

import { useMemo } from "react"
import useChartDisplay from "./hooks/use-chart-display"
import { createLinearScale, niceTicks } from "./util"

export type CandleChartGridProps = {
  className?: string
}

export default function CandleChartGrid({
  className,
}: CandleChartGridProps) {
  const { height, viewportWidth, visibleMin, visibleMax } =
    useChartDisplay()
  const lines = useMemo(() => {
    const scale = createLinearScale(
      [visibleMax, visibleMin],
      [0, height]
    )
    const pixelsPerLine = 50
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(height / pixelsPerLine)
    )
    return niceTicks(visibleMin, visibleMax, numberOfTicksTarget).map(
      (value, index) => ({
        value,
        offset: scale(value),
        key: `${value}-${index}`,
      })
    )
  }, [height, visibleMin, visibleMax])

  return (
    <g className={className}>
      {lines.map(({ offset, key }) => (
        <line
          key={key}
          style={{ stroke: "var(--chart-grid)" }}
          x1={0}
          x2={viewportWidth}
          y1={offset}
          y2={offset}
        />
      ))}
    </g>
  )
}
