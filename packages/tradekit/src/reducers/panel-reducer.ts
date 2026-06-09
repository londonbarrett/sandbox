import { ChartCoords, PayloadAction } from "../types"

export type PanelState = {
  candleFactor: number
  candleWidth: number
  columnWidth: number
  dataLength: number
  displayCandles: number
  graphWidth: number
  maxDisplayCandles: number
  maxOffsetX: number
  minDisplayCandles: number
  minOffsetX: number
  offsetX: number
  viewportWidth: number
  valueAxisWidth: number
  width: number
}

export const initialState: PanelState = {
  candleFactor: 0.8,
  candleWidth: 0,
  columnWidth: 0,
  displayCandles: 100,
  dataLength: 0,
  graphWidth: 0,
  maxDisplayCandles: 400,
  minDisplayCandles: 50,
  maxOffsetX: 0,
  minOffsetX: 0,
  offsetX: 0,
  valueAxisWidth: 60,
  viewportWidth: 0,
  width: 0,
}

export type PanelAction =
  | PayloadAction<"RESIZE", { dataLength: number; width: number }>
  | PayloadAction<"PAN", number>
  | PayloadAction<"ZOOM", { delta: number; coords: ChartCoords }>

export const panelReducer = (
  state: PanelState,
  action: PanelAction
): PanelState => {
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
      const viewportWidth = action.payload.width - state.valueAxisWidth
      const columnWidth = viewportWidth / state.displayCandles
      const graphWidth = action.payload.dataLength * columnWidth
      const maxOffsetX = 0
      const minOffsetX = Math.min(0, viewportWidth - graphWidth)
      return {
        ...state,
        candleWidth: columnWidth * state.candleFactor,
        columnWidth,
        dataLength: action.payload.dataLength,
        graphWidth,
        maxOffsetX,
        minOffsetX,
        offsetX: minOffsetX,
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

      const effectiveMax = Math.min(
        state.maxDisplayCandles,
        state.dataLength
      )
      const displayCandles =
        delta > 0
          ? state.displayCandles + delta < effectiveMax
            ? state.displayCandles + delta
            : effectiveMax
          : state.displayCandles + delta > state.minDisplayCandles
            ? state.displayCandles + delta
            : state.minDisplayCandles

      const columnWidth = state.viewportWidth / displayCandles
      const graphWidth = state.dataLength * columnWidth
      const maxOffsetX = 0
      const minOffsetX = Math.min(0, state.viewportWidth - graphWidth)

      const mouseX = action.payload.coords.x
      const graphAnchor = mouseX - state.offsetX
      const zoomRatio = graphWidth / state.graphWidth
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
