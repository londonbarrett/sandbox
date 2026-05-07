import { useAppSelector } from "@common/store/hooks"
import { getValueAxisWidth } from "@common/store/selectors/chart-display"
import { getIntervalName } from "@common/util/format"
import { memo } from "react"

export type SymbolProps = {
  symbol: string
  interval: string
}

const Symbol = memo(({ symbol, interval }: SymbolProps) => {
  const valueAxisWidth = useAppSelector(getValueAxisWidth)

  return (
    <text
      transform={`translate(${-(valueAxisWidth / 2)}, 0)`}
      className="fill-slate-200/10 select-none text-4xl sm:text-7xl font-bold"
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {`${symbol} - ${getIntervalName(interval)}`}
    </text>
  )
})

Symbol.displayName = "common.components.chart.symbol"

export default Symbol
