import * as d3 from "d3"
import { memo, use, useMemo } from "react"
import { ChartContext } from "@common/hooks/use-chart"

export const Grid = memo(() => {
  const height = useAppSelector((state) => getHeight(state))
  const maxValue = useAppSelector((state) => getMaxValue(state))
  const minValue = useAppSelector((state) => getMinValue(state))
  const graphWidth = useAppSelector(getGraphWidth)
  const lines = useMemo(() => {
    const scale = d3
      .scaleLinear()
      .domain([maxValue, minValue])
      .range([0, height])
    const pixelsPerLine = 50
    const numberOfTicksTarget = Math.max(1, Math.floor(height / pixelsPerLine))
    return scale.ticks(numberOfTicksTarget).map((value, index) => ({
      value,
      offset: scale(value),
      key: `${value}-${index}`,
    }))
  }, [height, maxValue, minValue])
  return (
    <g>
      {lines.map(({ offset, key }) => (
        <line
          className="stroke-slate-800"
          key={key}
          x1={0}
          x2={graphWidth}
          y1={offset}
          y2={offset}
        />
      ))}
    </g>
  )
})

Grid.displayName = "game.components.grid"
