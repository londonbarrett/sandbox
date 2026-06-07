"use client"

import { useMemo } from "react"
import { usePanel } from "../hooks/use-panel"
import { createLinearScale, niceTicks } from "../util"
import { useChart } from "../hooks/use-chart"

export type GridProps = {
  className?: string
}

export function Grid({ className }: GridProps) {
  const { viewportWidth, visibleMin, visibleMax } = usePanel()
  const { height } = useChart()

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
