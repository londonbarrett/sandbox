import { getCandleCount } from "@common/store/selectors/chart-data"
import { useChart } from "@hooks/use-chart"
import { useAppSelector } from "@store/hooks"
import { getColumnWidth } from "@store/selectors/chart-display"
import { Candle } from "@types"
import { memo, useMemo } from "react"

export type MovingAverageProps = {
  data: Candle[]
}

const MovingAverage = memo(({ data }: MovingAverageProps) => {
  const { getAbsYCoord } = useChart()
  const candleCount = useAppSelector(getCandleCount)
  const columnWidth = useAppSelector(getColumnWidth)

  // Create path data for the EMA line
  const emaPathData = useMemo(() => {
    const validEmaPoints = data
      .slice(0, candleCount)
      .map((candle, index) => {
        // Check if candle has EMA data and it's a valid number
        if (
          candle.EMA_200 &&
          !isNaN(candle.EMA_200) &&
          candle.EMA_200 !== 0
        ) {
          const x = columnWidth * index + columnWidth * 0.5 // Center of candle
          const y = getAbsYCoord(candle.EMA_200)
          return `${index === 0 ? "M" : "L"} ${x} ${y}`
        }
        return null
      })
      .filter(Boolean)

    const pathData = validEmaPoints.join(" ")
    return pathData
  }, [candleCount, columnWidth, getAbsYCoord])

  // Don't render if no valid EMA data
  if (!emaPathData || emaPathData === "") {
    return null
  }

  return (
    <g>
      <path
        className="fill-none stroke-yellow-400 stroke-1"
        d={emaPathData}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
})

MovingAverage.displayName = "common.components.price-chart.moving-average"

export default MovingAverage
