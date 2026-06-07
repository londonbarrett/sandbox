"use client"

import { usePanel } from "../hooks/use-panel"
import { useChart } from "../hooks/use-chart"

export type CrosshairProps = {
  className?: string
}

export function Crosshair({ className }: CrosshairProps) {
  const { coords, height } = useChart()
  const { columnWidth, viewportWidth, offsetX } = usePanel()

  if (coords.x + coords.y === 0) {
    return null
  }

  if (!columnWidth || columnWidth === 0 || !viewportWidth) {
    return null
  }

  const offsetXAdjustment = -offsetX % columnWidth
  const snappedPosition =
    Math.floor((coords.x + offsetXAdjustment) / columnWidth) *
      columnWidth +
    columnWidth / 2 -
    offsetXAdjustment

  return (
    <g className={className}>
      <line
        style={{
          stroke: "var(--chart-crosshair)",
          strokeDasharray: "3",
        }}
        x1={0}
        x2={viewportWidth}
        y1={coords.y}
        y2={coords.y}
      />
      <line
        style={{
          stroke: "var(--chart-crosshair)",
          strokeDasharray: "3",
        }}
        x1={snappedPosition}
        x2={snappedPosition}
        y1={0}
        y2={height}
      />
    </g>
  )
}
