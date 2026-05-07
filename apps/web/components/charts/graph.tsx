import { Candle } from "@/types"
import { memo } from "react"
import CandleComponent from "./candle"

export type GraphProps = {
  data: Candle[]
}

export const Graph = memo(({ data }: GraphProps) => {
  const candleCount = useAppSelector(getCandleCount)
  const candleWidth = useAppSelector(getCandleWidth)
  const columnWidth = useAppSelector(getColumnWidth)
  return (
    <g>
      {data.slice(0, candleCount).map((candle, i) => (
        <CandleComponent
          data={candle}
          key={candle.time}
          width={candleWidth}
          x={columnWidth * i + columnWidth * 0.15}
        />
      ))}
    </g>
  )
})

Graph.displayName = "game.components.graph"
