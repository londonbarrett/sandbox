import { Action, Candle } from "@/types"

export type ValueExtractor = (candle: Candle) => number[]

export const extractor: ValueExtractor = (candle: Candle) => [
  candle.high,
  candle.low,
]

export type DataState = {
  data: Candle[]
  extractor?: ValueExtractor
  maxValue: number
  minValue: number
}

export type DataAction = Action<"SET_DATA", Candle[]>

export const dataReducer = (state: DataState, action: DataAction) => {
  switch (action.type) {
    case "SET_DATA": {
      const data = action.payload
      const allValues = data.flatMap(
        (bar) => state.extractor?.(bar) || [bar.low, bar.high]
      )
      const maxValue = Number(Math.max(...allValues))
      const minValue = Number(Math.min(...allValues)) * 0.9
      return { ...state, data, maxValue, minValue }
    }
    default:
      return state
  }
}

export const setData = (data: Candle[]): DataAction => ({
  type: "SET_DATA",
  payload: data,
})
