import { Candle, PayloadAction } from "@/types"

export type DataState = {
  data: Candle[]
  maxValue: number
  minValue: number
}

export type DataAction = PayloadAction<"SET_DATA", Candle[]>

export const dataReducer = (state: DataState, action: DataAction) => {
  switch (action.type) {
    case "SET_DATA": {
      const data = action.payload
      const allValues = data.flatMap((candle) => [
        candle.high,
        candle.low,
      ])
      const maxValue = Number(Math.max(...allValues))
      const minValue = Number(Math.min(...allValues))
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
