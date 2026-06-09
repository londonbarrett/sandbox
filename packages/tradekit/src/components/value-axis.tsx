"use client"

import { useMemo } from "react"
import { usePanel } from "../hooks/use-panel"
import { useChart } from "../hooks/use-chart"
import {
  createLinearScale,
  getCurrencyFormatter,
  niceTicks,
} from "../util"
import { useCoords } from "../hooks/use-coords"

export type ValueAxisProps = {
  className?: string
  pixelsPerTick?: number
}

export function ValueAxis({
  className,
  pixelsPerTick = 50,
}: ValueAxisProps) {
  const { valueAxisWidth, viewportWidth, visibleMin, visibleMax } =
    usePanel()
  const { getValueAt, height, ref } = useChart()
  const { activeChart, coords } = useCoords()
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
      {ref === activeChart && (
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
      )}

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
