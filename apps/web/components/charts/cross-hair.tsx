"use client"

import { getUtcOffset } from "@store/preferences"
import { memo, use } from "react"
import { ChartContext } from "@common/hooks/use-chart"

export const CrossHair = memo(() => {
  const columnWidth = useAppSelector(getColumnWidth)
  const height = useAppSelector((state) => getHeight(state))
  const mouseCoords = useAppSelector(getMouseCoords)
  const graphWidth = useAppSelector(getGraphWidth)
  const utcOffset = useAppSelector(getUtcOffset)

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
        : (graphWidth - columnWidth) / columnWidth,
    ) *
    columnWidth +
    columnWidth / 2

  return (
    <g>
      {mouseCoords.chartId === id && (
        <line
          className="stroke-indigo-200 [stroke-dasharray:3]"
          x1={0}
          x2={graphWidth}
          y1={mouseCoords.y}
          y2={mouseCoords.y}
        />
      )}
      <line
        className="stroke-indigo-200 [stroke-dasharray:3]"
        x1={snappedPosition}
        x2={snappedPosition}
        y1={0}
        y2={height}
      />
    </g>
  )
})

CrossHair.displayName = "game.components.cross-hair"
