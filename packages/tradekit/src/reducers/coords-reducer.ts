import { RefObject } from "react"
import { ChartCoords, PayloadAction } from "../types"

export type CoordsState = {
  coords: ChartCoords
  activeChart: RefObject<SVGSVGElement | null>
}

export const initialState: CoordsState = {
  coords: { candle: undefined, x: 0, y: 0 },
  activeChart: { current: null },
}

export type CoordsAction = PayloadAction<
  "SET_COORDS",
  { coords: ChartCoords; activeChart: RefObject<SVGSVGElement | null> }
>

export const coordsReducer = (
  state: CoordsState,
  action: CoordsAction
): CoordsState => {
  switch (action.type) {
    case "SET_COORDS":
      return {
        ...action.payload,
      }
    default:
      return state
  }
}
