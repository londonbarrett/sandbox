"use client"

import useChartDisplay from "./hooks/use-chart-display"
import useMouseCoords from "./hooks/use-mouse-coords"

export type CandleChartCrosshairProps = {
  className?: string
}

export default function CandleChartCrosshair({
  className,
}: CandleChartCrosshairProps) {
  const { coords } = useMouseCoords()
  const { columnWidth, height, viewportWidth, offsetX } =
    useChartDisplay()

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
