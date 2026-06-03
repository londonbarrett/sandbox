import { createContext, Dispatch, ReactNode, useState } from "react"
import { ChartCoords } from "./types"

export const MouseCoordsContext = createContext<
  [ChartCoords, Dispatch<ChartCoords>]
>([{ candle: undefined, x: 0, y: 0 }, () => {}])

export type MouseCoordsProviderProps = {
  children: ReactNode
}

export default function MouseCoordsProvider({
  children,
}: MouseCoordsProviderProps) {
  const coordsState = useState<ChartCoords>({
    candle: undefined,
    x: 0,
    y: 0,
  })
  return (
    <MouseCoordsContext value={coordsState}>
      {children}
    </MouseCoordsContext>
  )
}
