import { ChartCoords, PayloadAction } from "../types"

export type ChartState = {
  coords: ChartCoords
  height: number
}

export const initialState: ChartState = {
  coords: { candle: undefined, x: 0, y: 0 },
  height: 0,
}

export type ChartAction =
  | PayloadAction<"PAN", number>
  | PayloadAction<"RESIZE", number>
  | PayloadAction<"SET_COORDS", ChartCoords>

export const chartReducer = (
  state: ChartState,
  action: ChartAction
): ChartState => {
  switch (action.type) {
    case "PAN": {
      return state
    }
    case "RESIZE":
      return {
        ...state,
        height: action.payload,
      }
    case "SET_COORDS":
      return {
        ...state,
        coords: action.payload,
      }
    default:
      return state
  }
}
