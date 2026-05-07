import { Action, Coords, Dimensions } from "@/types"

export type DisplayState = {
  candleWidth: number
  columnWidth: number
  coords: Coords
  height: number
  width: number
  zoom: number
}

export type DisplayAction =
  | Action<"SET_MOUSE_COORDS", Coords>
  | Action<"RESIZE_CHART", Dimensions>

export const displayReducer = (state: DisplayState, action: DisplayAction) => {
  switch (action.type) {
    case "SET_MOUSE_COORDS": {
      return { ...state, coords: action.payload }
    }
    case "RESIZE_CHART": {
      return { ...state, ...action.payload }
    }
    default:
      return state
  }
}

export const setMouseCoords = (coords: Coords) => ({
  type: "SET_MOUSE_COORDS",
  payload: coords,
})

export const resizeChart = (dimensions: Dimensions) => ({
  type: "RESIZE_CHART",
  payload: dimensions,
})
