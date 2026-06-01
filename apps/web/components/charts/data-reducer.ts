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
      return { ...state, data }
    }
    default:
      return state
  }
}

export const setData = (data: Candle[]): DataAction => ({
  type: "SET_DATA",
  payload: data,
})
