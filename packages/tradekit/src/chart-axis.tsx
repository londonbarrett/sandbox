"use client"

import { useMemo } from "react"
import useChartDisplay from "./hooks/use-chart-display"
import useMouseCoords from "./hooks/use-mouse-coords"
import {
  createLinearScale,
  getCurrencyFormatter,
  niceTicks,
} from "./util"

export type CandleChartAxisProps = {
  className?: string
  pixelsPerTick?: number
}

export default function CandleChartAxis({
  className,
  pixelsPerTick = 50,
}: CandleChartAxisProps) {
  const {
    height,
    valueAxisWidth,
    viewportWidth,
    getValueAt,
    visibleMin,
    visibleMax,
  } = useChartDisplay()
  const { coords } = useMouseCoords()
  const formatCurrency = getCurrencyFormatter

  const ticks = useMemo(() => {
    const scale = createLinearScale(
      [visibleMax, visibleMin],
      [0, height]
    )
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(height / pixelsPerTick)
    )
    return niceTicks(visibleMin, visibleMax, numberOfTicksTarget).map(
      (value) => ({
        value,
        offset: scale(value),
      })
    )
  }, [height, visibleMin, visibleMax, pixelsPerTick])

  return (
    <g className={className} transform={`translate(${viewportWidth})`}>
      {ticks.map(({ value, offset }) => (
        <text
          key={value}
          style={{ fill: "var(--chart-label)", fontSize: 9 }}
          textAnchor="middle"
          x={valueAxisWidth / 2}
          y={offset + 3}
        >
          {formatCurrency(value)}
        </text>
      ))}

      {/* Legend */}
      <g>
        {coords.y > 0 && (
          <>
            <rect
              style={{
                fill: "var(--chart-label)",
                opacity: 0.8,
              }}
              x={4}
              y={coords.y - 8}
              width={valueAxisWidth - 8}
              height={16}
              rx={2}
            />
            <text
              style={{ fill: "var(--chart-bg)", fontSize: 9 }}
              textAnchor="middle"
              x={valueAxisWidth / 2}
              y={coords.y + 3}
            >
              {formatCurrency(getValueAt(coords.y))}
            </text>
          </>
        )}
      </g>

      <line
        style={{ stroke: "var(--chart-axis)", strokeWidth: 2 }}
        x1={0}
        x2={0}
        y1={0}
        y2="100%"
      />
    </g>
  )
}
