"use client"

import { useChart } from "../hooks/use-chart"
import { useCoords } from "../hooks/use-coords"
import { usePanel } from "../hooks/use-panel"

export type CrosshairProps = {
  className?: string
}

export function Crosshair({ className }: CrosshairProps) {
  const { height, ref } = useChart()
  const { activeChart, coords } = useCoords()
  const { columnWidth, offsetX, viewportWidth } = usePanel()

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
      {ref === activeChart && (
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
      )}
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
