"use client"

import { memo } from "react"
import useChartDisplay from "./use-chart-display"

export type SymbolProps = {
  symbol: string
  interval: string
}

const Symbol = memo(({ symbol, interval }: SymbolProps) => {
  const {dimensions: {valueAxisWidth}} = useChartDisplay()

  return (
    <text
      transform={`translate(${-(valueAxisWidth / 2)}, 0)`}
      className="fill-slate-200/10 select-none text-4xl sm:text-7xl font-bold"
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
