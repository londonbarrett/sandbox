import { PayloadAction } from "../types"

export type ChartState = {
  height: number
}

export const initialState: ChartState = {
  height: 0,
}

export type ChartAction = PayloadAction<"RESIZE", number>

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
    default:
      return state
  }
}
