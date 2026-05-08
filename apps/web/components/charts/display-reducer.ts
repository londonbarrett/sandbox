import { Action, Coords } from "@/types"

export type DisplayState = {
  candleWidth: number
  columnWidth: number
  coords: Coords
  graphWidth: number
  height: number
  valueAxisWidth: number
  width: number
  zoom: number
}

export type DisplayAction =
  | Action<"SET_MOUSE_COORDS", Coords>
  | Action<
      "RESIZE_CHART",
      {
        height: number
        width: number
        columnWidth: number
        candleWidth: number
      }
    >

export const displayReducer = (state: DisplayState, action: DisplayAction) => {
  switch (action.type) {
    case "SET_MOUSE_COORDS": {
      return { ...state, coords: action.payload }
    }
    case "RESIZE_CHART": {
      return {
        ...state,
        ...action.payload,
        graphWidth: action.payload.width - state.valueAxisWidth,
        candleWidth: action.payload.candleWidth,
        columnWidth: action.payload.columnWidth,
      }
    }
    default:
      return state
  }
}

export const setMouseCoords = (coords: Coords) => ({
  type: "SET_MOUSE_COORDS",
  payload: coords,
})

export const resizeChart = ({
  candleWidth,
  columnWidth,
  height,
  width,
}: {
  candleWidth: number
  columnWidth: number
  height: number
  width: number
}): DisplayAction => ({
  type: "RESIZE_CHART",
  payload: {
    candleWidth,
    columnWidth,
    height,
    width,
  },
})
