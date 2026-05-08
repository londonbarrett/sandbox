"use client"

import { MouseCoordsContext } from "./svg"
import useChartDisplay from "./use-chart-display"
import { use } from "react"

export default function CrossHair() {
  const mouseCoords = use(MouseCoordsContext)
  const {
    dimensions: { columnWidth, height, graphWidth },
  } = useChartDisplay()

  if (mouseCoords.x + mouseCoords.y === 0) {
    return null
  }

  // Prevent division by zero or NaN values
  if (!columnWidth || columnWidth === 0 || !graphWidth) {
    return null
  }

  const snappedPosition =
    Math.floor(
      (mouseCoords.x || 0) < graphWidth
        ? (mouseCoords.x || 0) / columnWidth
        : (graphWidth - columnWidth) / columnWidth
    ) *
      columnWidth +
    columnWidth / 2

  return (
    <g>
      <line
        className="stroke-indigo-200 [stroke-dasharray:3]"
        x1={0}
        x2={graphWidth}
        y1={mouseCoords.y}
        y2={mouseCoords.y}
      />
      <line
        className="stroke-indigo-200 [stroke-dasharray:3]"
        x1={snappedPosition}
        x2={snappedPosition}
        y1={0}
        y2={height}
      />
    </g>
  )
}

CrossHair.displayName = "game.components.cross-hair"
