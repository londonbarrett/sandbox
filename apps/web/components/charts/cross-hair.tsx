"use client"

import { MouseCoordsContext } from "./svg"
import useChartDisplay from "./use-chart-display"
import { use } from "react"

export default function CrossHair() {
  const mouseCoords = use(MouseCoordsContext)
  const { columnWidth, height, viewportWidth } = useChartDisplay()
  const { offsetX } = useChartDisplay()

  if (mouseCoords.x + mouseCoords.y === 0) {
    return null
  }

  // Prevent division by zero or NaN values
  if (!columnWidth || columnWidth === 0 || !viewportWidth) {
    return null
  }

  const offsetXAdjustment = -offsetX % columnWidth

  const snappedPosition =
    Math.floor((mouseCoords.x + offsetXAdjustment) / columnWidth) *
      columnWidth +
    columnWidth / 2 -
    offsetXAdjustment

  return (
    <g>
      <line
        className="stroke-indigo-200 [stroke-dasharray:3]"
        x1={0}
        x2={viewportWidth}
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
