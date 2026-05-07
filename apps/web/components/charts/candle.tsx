import useChart from "./use-chart-display"
import { Candle as CandleType } from "@/types"
import clsx from "clsx"
import { memo } from "react"

export type CandleProps = {
  data: CandleType
  width: number
  x: number
}

const Candle = memo(
  ({ data, width, x }: CandleProps) => {
    const { getAbsYCoord } = useChart()
    const up = data.close > data.open
    const barTop = getAbsYCoord(up ? data.close : data.open)
    const barBottom = getAbsYCoord(up ? data.open : data.close)
    const barHeight = Math.abs(barBottom - barTop)
    const wickBottom = getAbsYCoord(data.low)
    const wickTop = getAbsYCoord(data.high)
    return (
      <g className="[transform-box: content-box] animate-in">
        <rect
          className={clsx(
            "stroke-1",
            up
              ? "fill-teal-400 stroke-teal-700"
              : "fill-rose-400 stroke-rose-700",
          )}
          height={barHeight}
          width={Math.abs(width)}
          x={x}
          y={Math.min(barTop, barBottom)}
        />
        <line
          className={clsx(
            "stroke-1",
            up ? "stroke-teal-700" : "stroke-rose-700",
          )}
          x1={x + Math.abs(width) / 2}
          x2={x + Math.abs(width) / 2}
          y1={barTop}
          y2={wickTop}
        />
        <line
          className={clsx(
            "stroke-1",
            up ? "stroke-teal-700" : "stroke-rose-700",
          )}
          x1={x + width / 2}
          x2={x + width / 2}
          y1={barBottom}
          y2={wickBottom}
        />
      </g>
    )
  }
)

Candle.displayName = "game.components.chart.candle"

export default Candle
