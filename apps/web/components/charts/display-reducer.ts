import { Action } from "@/types"

export type DisplayState = {
  offsetX: number
  zoom: number
}

export type DisplayAction =
  | Action<"PAN_BY", { deltaX: number; maxOffset: number }>
  | Action<"SET_ZOOM", number>

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const displayReducer = (
  state: DisplayState,
  action: DisplayAction
): DisplayState => {
  switch (action.type) {
    case "PAN_BY": {
      const nextOffset = clamp(
        state.offsetX - action.payload.deltaX,
        -action.payload.maxOffset,
        action.payload.maxOffset,
      )
      return { ...state, offsetX: nextOffset }
    }
    case "SET_ZOOM":
      return { ...state, zoom: action.payload }
    default:
      return state
  }
}
