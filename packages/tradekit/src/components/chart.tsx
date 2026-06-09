"use client"

import {
  createContext,
  ReactNode,
  RefObject,
  useReducer,
  useRef,
} from "react"
import {
  ChartAction,
  chartReducer,
  ChartState,
  initialState,
} from "../reducers/chart-reducer"
import { ChartController } from "./chart-controller"

export type ChartProps = {
  children: ReactNode
  className?: string
  height?: number | string
  width?: number | string
}

export const ChartContext = createContext<{
  dispatch: React.Dispatch<ChartAction>
  ref: RefObject<SVGSVGElement | null>
  state: ChartState
}>({
  ref: { current: null },
  state: initialState,
  dispatch: () => null,
})

export function Chart({
  children,
  className,
  height = "100%",
  width = "100%",
}: ChartProps) {
  const [state, dispatch] = useReducer(chartReducer, initialState)
  const ref = useRef<SVGSVGElement | null>(null)

  return (
    <ChartContext value={{ dispatch, ref, state }}>
      <ChartController
        className={className}
        height={height}
        ref={ref}
        width={width}
      >
        {children}
      </ChartController>
    </ChartContext>
  )
}
