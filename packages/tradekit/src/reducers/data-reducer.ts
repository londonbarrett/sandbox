import { Candle, PayloadAction } from "../types"

export type DataState = {
  data: Candle[]
  maxValue: number
  minValue: number
  indicators: Record<string, (number | null)[]>
}

export type DataAction =
  | PayloadAction<"SET_DATA", Candle[]>
  | PayloadAction<"SET_INDICATOR", { key: string; values: (number | null)[] }>

export const dataReducer = (state: DataState, action: DataAction) => {
  switch (action.type) {
    case "SET_DATA": {
      const data = action.payload
      return { ...state, data, indicators: {} }
    }
    case "SET_INDICATOR": {
      const { key, values } = action.payload
      return {
        ...state,
        indicators: { ...state.indicators, [key]: values },
      }
    }
    default:
      return state
  }
}

export const setData = (data: Candle[]): DataAction => ({
  type: "SET_DATA",
  payload: data,
})

export const setIndicator = (
  key: string,
  values: (number | null)[]
): DataAction => ({
  type: "SET_INDICATOR",
  payload: { key, values },
})
