import {
  createContext,
  memo,
  ReactNode,
  RefObject,
  useReducer,
} from "react"
import {
  ChartAction,
  chartReducer,
  ChartState,
  initialState,
} from "../reducers/chart-reducer"

export const ChartContext = createContext<{
  dispatch: React.Dispatch<ChartAction>
  ref: RefObject<SVGSVGElement | null>
  state: ChartState
}>({
  ref: { current: null },
  state: initialState,
  dispatch: () => null,
})

export type ChartProviderProps = {
  children: ReactNode
  ref: RefObject<SVGSVGElement | null>
}

export const ChartProvider = memo(function ChartProvider({
  children,
  ref,
}: ChartProviderProps) {
  const [state, dispatch] = useReducer(chartReducer, initialState)

  return (
    <ChartContext value={{ dispatch, ref, state }}>
      {children}
    </ChartContext>
  )
})
