import { getCandleCount } from "@common/store/selectors/chart-data"
import { getCurrencyFormatter } from "@common/store/selectors/game-session"
import { getIntervalName } from "@common/util/format"
import { useAppSelector } from "@store/hooks"
import { getMouseCoords } from "@store/selectors/chart-display"
import { getCurrentChart } from "@store/selectors/game-session"
import { Candle } from "@types"
import { memo } from "react"

export type StatusProps = {
  data: Candle[]
  showIndex?: boolean
}

export const Status = memo(
  ({ data, showIndex = false }: StatusProps) => {
    const candleCount = useAppSelector(getCandleCount)
    const currentChart = useAppSelector(getCurrentChart)
    const mouseCoords = useAppSelector(getMouseCoords)
    const formatCurrency = useAppSelector(getCurrencyFormatter)

    const currentCandle = data[mouseCoords.index]
    const hasValidData = mouseCoords.index < candleCount && currentCandle

    return (
      <g className="translate-x-4 translate-y-20">
        <text
          className="fill-foreground select-none text-sm md:text-lg font-bold"
          y={0}
        >
          {`${currentChart?.symbol} - ${getIntervalName(currentChart?.interval)}`}
        </text>
        <text
          className="fill-foreground select-none text-xs"
          y={20}
        >
          {hasValidData ? (
            <tspan
              className={
                currentCandle.close >= currentCandle.open
                  ? "fill-teal-400"
                  : "fill-rose-400"
              }
            >
              {showIndex && `i: ${mouseCoords.index} `}O:{" "}
              {formatCurrency(currentCandle.open)} H:{" "}
              {formatCurrency(currentCandle.high)} L:{" "}
              {formatCurrency(currentCandle.low)} C:{" "}
              {formatCurrency(currentCandle.close)}
            </tspan>
          ) : (
            <tspan className="fill-foreground">
              {showIndex && `i: ${mouseCoords.index} `}O: -- H: -- L: --
              C: --
            </tspan>
          )}
        </text>
        <text
          className={`select-none text-xs ${hasValidData ? "fill-yellow-400" : "fill-foreground"
            }`}
          y={40}
        >
          EMA 200:{" "}
          {hasValidData
            ? formatCurrency(currentCandle.EMA_200)
            : "--"}
        </text>
      </g>
    )
  },
)

Status.displayName = "game.Status"
