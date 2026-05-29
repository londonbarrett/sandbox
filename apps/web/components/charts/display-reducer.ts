import { PayloadAction } from "@/types"

export type DisplayState = {
  candleFactor: number
  candleWidth: number
  columnWidth: number
  dataLength: number
  displayCandles: number
  graphWidth: number
  height: number
  maxDisplayCandles: number
  maxOffsetX: number
  minDisplayCandles: number
  minOffsetX: number
  offsetX: number
  viewportWidth: number
  valueAxisWidth: number
  width: number
}

export type DisplayAction =
  | PayloadAction<
      "RESIZE",
      { dataLength: number; height: number; width: number }
    >
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
    case "RESIZE": {
      console.log("REDUCER RESIZE")
      const viewportWidth = action.payload.width - state.valueAxisWidth
      const columnWidth = viewportWidth / state.displayCandles
      const graphWidth = action.payload.dataLength * columnWidth
      const maxOffsetX = viewportWidth / 4
      const minOffsetX = viewportWidth - graphWidth - viewportWidth / 4
      return {
        ...state,
        // TODO: Candle Scale factor should be in a config object
        candleWidth: columnWidth * state.candleFactor,
        columnWidth,
        dataLength: action.payload.dataLength,
        graphWidth,
        height: action.payload.height,
        maxOffsetX,
        minOffsetX,
        offsetX: maxOffsetX,
        viewportWidth,
        width: action.payload.width,
      }
    }
    case "ZOOM": {
      const offsetX =
        ((state.displayCandles + action.payload) * state.offsetX) /
        state.displayCandles
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

      // console.log(
      //   "NEW OFFSETX",
      //   offsetX,
      //   action.payload,
      //   state.displayCandles,
      //   state.offsetX
      // )

      const displayCandles =
        action.payload > 0
          ? state.displayCandles + action.payload <
            state.maxDisplayCandles
            ? state.displayCandles + action.payload
            : state.maxDisplayCandles
          : state.displayCandles + action.payload >
              state.minDisplayCandles
            ? state.displayCandles + action.payload
            : state.minDisplayCandles

      const columnWidth = state.viewportWidth / displayCandles
      const graphWidth = state.dataLength * columnWidth
      const maxOffsetX = state.viewportWidth / 4
      const minOffsetX =
        state.viewportWidth - graphWidth - state.viewportWidth / 4

      return {
        ...state,
        displayCandles,
        columnWidth,
        candleWidth: columnWidth * state.candleFactor,
        maxOffsetX,
        minOffsetX,
      }
    }
    default:
      return state
  }
}
