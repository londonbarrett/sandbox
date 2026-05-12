"use client"

import * as d3 from "d3"
import { use, useMemo } from "react"
import { MouseCoordsContext } from "../svg"
import useChartData from "../use-chart-data"
import useChartDisplay from "../use-chart-display"
import { getCurrencyFormatter } from "../util"
import Legend from "./legend"

export default function ValueAxis() {
  const { maxValue, minValue } = useChartData()
  const {
    dimensions: { graphWidth, height, valueAxisWidth },
    getValueAt,
  } = useChartDisplay()
  const mouseCoords = use(MouseCoordsContext)
  const formatCurrency = getCurrencyFormatter

  const ticks = useMemo(() => {
    const scale = d3
      .scaleLinear()
      .domain([maxValue, minValue])
      .range([0, height])
    // TODO: move pixelsPerTick to a reducer or context so it can be dynamic based on zoom level
    const pixelsPerTick = 50
    const numberOfTicksTarget = Math.max(1, Math.floor(height / pixelsPerTick))
    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      offset: scale(value),
    }))
  }, [maxValue, minValue, height])

  return (
    <g transform={`translate(${graphWidth})`}>
      {ticks.map(({ value, offset }) => (
        <text
          className="fill-foreground text-[9px] select-none"
          key={value}
          textAnchor="middle"
          x={valueAxisWidth / 2}
          y={offset + 3}
        >
          {formatCurrency(value)}
        </text>
      ))}
      <Legend
        label={formatCurrency(getValueAt(mouseCoords.y))}
        value={mouseCoords.y}
      />
      <line
        className="stroke-slate-600 stroke-2"
        x1={0}
        x2={0}
        y1={0}
        y2="100%"
      />
    </g>
  )
}
