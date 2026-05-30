import { Coords, PayloadAction } from "@/types"

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
  | PayloadAction<"ZOOM", { delta: number; coords: Coords }>

export const displayReducer = (
  state: DisplayState,
  action: DisplayAction
): DisplayState => {
  switch (action.type) {
    case "PAN": {
      console.log("PAN")
      const nextOffset =
        state.offsetX - action.payload < state.minOffsetX
          ? state.minOffsetX
          : state.offsetX - action.payload > state.maxOffsetX
            ? state.maxOffsetX
            : state.offsetX - action.payload
      return { ...state, offsetX: nextOffset }
    }
    case "RESIZE": {
      console.log("RESIZE")
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
      const delta =
        action.payload.delta > 10
          ? 10
          : action.payload.delta < -10
            ? -10
            : action.payload.delta

      const displayCandles =
        delta > 0
          ? state.displayCandles + delta < state.maxDisplayCandles
            ? state.displayCandles + delta
            : state.maxDisplayCandles
          : state.displayCandles + delta > state.minDisplayCandles
            ? state.displayCandles + delta
            : state.minDisplayCandles

      const columnWidth = state.viewportWidth / displayCandles
      const graphWidth = state.dataLength * columnWidth
      const maxOffsetX = state.viewportWidth / 4
      const minOffsetX =
        state.viewportWidth - graphWidth - state.viewportWidth / 4

      // 1. Get the mouse X position relative to the viewport container
      const mouseX = action.payload.coords.x

      // 2. Find where that mouse position sits relative to the unscaled graph
      const graphAnchor = mouseX - state.offsetX

      // 3. Calculate the exact scaling ratio between the new width and old width
      const zoomRatio = graphWidth / state.graphWidth

      // 4. Scale the graph position around the mouse cursor and clamp it to bounds
      const rawOffsetX = mouseX - graphAnchor * zoomRatio
      const offsetX = Math.max(
        minOffsetX,
        Math.min(maxOffsetX, rawOffsetX)
      )

      return {
        ...state,
        displayCandles,
        columnWidth,
        candleWidth: columnWidth * state.candleFactor,
        graphWidth,
        maxOffsetX,
        minOffsetX,
        offsetX,
      }
    }
    default:
      return state
  }
}
