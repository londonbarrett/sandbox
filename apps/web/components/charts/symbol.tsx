"use client"

import { memo } from "react"
import useChartDimensions from "./use-chart-dimensions"

export type SymbolProps = {
  symbol: string
  interval: string
}

const Symbol = memo(({ symbol, interval }: SymbolProps) => {
  const { valueAxisWidth } = useChartDimensions()

  return (
    <text
      transform={`translate(${-(valueAxisWidth / 2)}, 0)`}
      className="fill-slate-200/10 text-4xl font-bold select-none sm:text-7xl"
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {`${symbol} - ${interval}`}
    </text>
  )
})

Symbol.displayName = "common.components.chart.symbol"

export default Symbol
