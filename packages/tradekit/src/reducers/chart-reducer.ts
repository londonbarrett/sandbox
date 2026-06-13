import { PayloadAction } from "../types"

export type ChartState = {
  hasPriceGraph: boolean
  height: number
  indicators: Record<string, (number | null)[]>
}

export const initialState: ChartState = {
  hasPriceGraph: false,
  height: 0,
  indicators: {},
}

export type ChartAction =
  | PayloadAction<"RESIZE", number>
  | PayloadAction<"SET_INDICATOR", { key: string; values: (number | null)[] }>
  | PayloadAction<"SET_PRICE_GRAPH", boolean>

export const chartReducer = (
  state: ChartState,
  action: ChartAction
): ChartState => {
  switch (action.type) {
    case "RESIZE":
      return {
        ...state,
        height: action.payload,
      }
    case "SET_INDICATOR":
      return {
        ...state,
        indicators: { ...state.indicators, [action.payload.key]: action.payload.values },
      }
    case "SET_PRICE_GRAPH":
      return {
        ...state,
        hasPriceGraph: action.payload,
      }
    default:
      return state
  }
}

export const setIndicator = (
  key: string,
  values: (number | null)[]
): ChartAction => ({
  type: "SET_INDICATOR",
  payload: { key, values },
})
