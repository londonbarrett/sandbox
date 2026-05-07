import { getCurrencyFormatter } from "@common/store/selectors/game-session"
import { ChartContext, useChart } from "@hooks/use-chart"
import { useAppSelector } from "@store/hooks"
import {
  getGraphWidth,
  getHeight,
  getMaxValue,
  getMinValue,
  getMouseCoords,
  getValueAxisWidth,
} from "@store/selectors/chart-display"
import * as d3 from "d3"
import { memo, use, useMemo } from "react"
import { ValueLegend } from "../charts/value-legend"

export const ValueAxis = memo(() => {
  const { getValueAt, getYCoord } = useChart()
  const { id } = use(ChartContext)
  const formatCurrency = useAppSelector(getCurrencyFormatter)
  const height = useAppSelector((state) => getHeight(state, id))
  const maxValue = useAppSelector((state) => getMaxValue(state, id))
  const minValue = useAppSelector((state) => getMinValue(state, id))
  const mouseCoords = useAppSelector(getMouseCoords)
  const width = useAppSelector(getValueAxisWidth)
  const graphWidth = useAppSelector(getGraphWidth)

  const ticks = useMemo(() => {
    const scale = d3
      .scaleLinear()
      .domain([maxValue, minValue])
      .range([0, height])
    const pixelsPerTick = 50
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(height / pixelsPerTick),
    )
    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      offset: scale(value),
    }))
  }, [maxValue, minValue, height])

  return (
    <g transform={`translate(${graphWidth})`}>
      {ticks.map(({ value, offset }) => (
        <text
          className="fill-foreground text-2xs select-none"
          key={value}
          textAnchor="middle"
          x={width / 2}
          y={offset + 3}
        >
          {formatCurrency(value)}
        </text>
      ))}
      {mouseCoords.chartId === id && (
        <ValueLegend
          label={formatCurrency(getValueAt(mouseCoords.y))}
          type="VALUE"
          value={mouseCoords.y}
        />
      )}
      {showTargets && (
        <>
          <ValueLegend
            label={formatCurrency(entry)}
            type="ENTRY"
            value={-getYCoord(entry)}
          />
          {stopLoss && (
            <ValueLegend
              label={formatCurrency(stopLoss)}
              type="SL"
              value={-getYCoord(stopLoss)}
            />
          )}
          {takeProfit && (
            <ValueLegend
              label={formatCurrency(takeProfit)}
              type="TP"
              value={-getYCoord(takeProfit)}
            />
          )}
        </>
      )}
      <line
        className="stroke-slate-600 stroke-2"
        x1={0}
        x2={0}
        y1={0}
        y2="100%"
      />
    </g>
  )
})

ValueAxis.displayName = "common.components.price-chart.value-axis"
