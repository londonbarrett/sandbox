import { PayloadAction } from "@/types"
import { DimensionsState } from "./dimensions-reducer"

export type DisplayState = {
  maxDisplayCandles: number
  maxOffsetX: number
  minDisplayCandles: number
  minOffsetX: number
  offsetX: number
  displayCandles: number
}

export type DisplayAction =
  | PayloadAction<"GAUGE", DimensionsState>
  | PayloadAction<"PAN", number>
  | PayloadAction<"ZOOM", number>

export const displayReducer = (
  state: DisplayState,
  action: DisplayAction
): DisplayState => {
  switch (action.type) {
    case "PAN": {
      const nextOffset =
        state.offsetX - action.payload < state.minOffsetX
          ? state.minOffsetX
          : state.offsetX - action.payload > state.maxOffsetX
            ? state.maxOffsetX
            : state.offsetX - action.payload
      return { ...state, offsetX: nextOffset }
    }
    case "GAUGE": {
      console.log("GAUGE")
      return {
        ...state,
        maxOffsetX: action.payload.viewportWidth / 4,
        minOffsetX:
          action.payload.viewportWidth -
          action.payload.graphWidth -
          action.payload.viewportWidth / 4,
        offsetX: 0,
        // action.payload.viewportWidth -
        // action.payload.graphWidth -
        // action.payload.viewportWidth / 4,
      }
    }
    case "ZOOM":
      // state.displayCandles + deltaX      =>    newOffsetX
      // state.displayCandles               =>    state.offsetX
      //

      // const newDisplayCandles =

      // if (action.payload > 0) {
      //   return {
      //     ...state,
      //     offsetX: newOffsetX,
      //     displayCandles:
      //       state.displayCandles + action.payload <
      //       state.maxDisplayCandles
      //         ? state.displayCandles + action.payload
      //         : state.maxDisplayCandles,
      //   }
      // } else {
      //   return {
      //     ...state,
      //     displayCandles:
      //       state.displayCandles + action.payload >
      //       state.minDisplayCandles
      //         ? state.displayCandles + action.payload
      //         : state.minDisplayCandles,
      //   }
      // }

      // const newOffsetX =
      //   (action.zoom * state.offsetX * newDisplayCandles) /
      //   state.displayCandles

      const offsetX =
        ((state.displayCandles + action.payload) * state.offsetX) /
        state.displayCandles

      console.log(
        "NEW OFFSETX",
        offsetX,
        action.payload,
        state.displayCandles,
        state.offsetX
      )

      if (action.payload > 0) {
        return {
          ...state,
          offsetX,
          displayCandles:
            state.displayCandles + action.payload <
            state.maxDisplayCandles
              ? state.displayCandles + action.payload
              : state.maxDisplayCandles,
        }
      } else {
        return {
          ...state,
          offsetX,
          displayCandles:
            state.displayCandles + action.payload >
            state.minDisplayCandles
              ? state.displayCandles + action.payload
              : state.minDisplayCandles,
        }
      }
    default:
      return state
  }
}
