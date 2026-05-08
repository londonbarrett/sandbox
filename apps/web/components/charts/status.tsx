"use client"

import { use } from "react"
import { MouseCoordsContext } from "./svg"
import { getCurrencyFormatter } from "./util"

export type StatusProps = {
  symbol: string
  interval: string
  showIndex?: boolean
}

// TODO: use svg externalObject, so it's easier to stack several indicators
export default function Status({
  symbol,
  interval,
  showIndex = false,
}: StatusProps) {
  const mouseCoords = use(MouseCoordsContext)
  const formatCurrency = getCurrencyFormatter

  return (
    <g className="translate-x-4 translate-y-10">
      <text
        className="fill-foreground text-sm font-bold select-none md:text-lg"
        y={0}
      >
        {`${symbol} - ${interval}`}
      </text>
      <text className="fill-foreground text-xs select-none" y={20}>
        {mouseCoords.candle ? (
          <tspan
            className={
              mouseCoords.candle.close >= mouseCoords.candle.open
                ? "fill-teal-400"
                : "fill-rose-400"
            }
          >
            {showIndex && `i: ${mouseCoords.candle.index} `}O:{" "}
            {formatCurrency(mouseCoords.candle.open)} H:{" "}
            {formatCurrency(mouseCoords.candle.high)} L:{" "}
            {formatCurrency(mouseCoords.candle.low)} C:{" "}
            {formatCurrency(mouseCoords.candle.close)}
          </tspan>
        ) : (
          <tspan className="fill-foreground">
            {showIndex && `i: -- O: -- H: -- L: -- C: --`}
          </tspan>
        )}
      </text>
    </g>
  )
}

Status.displayName = "game.Status"
