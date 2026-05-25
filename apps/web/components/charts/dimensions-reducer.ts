import { PayloadAction } from "@/types"

// TODO: Split into chart dimensions and graph dimensions
export type DimensionsState = {
  // graphDimensions
  candleWidth: number
  columnWidth: number
  graphWidth: number
  // chart dimensions
  viewportWidth: number
  height: number
  valueAxisWidth: number
  width: number
}

export type DimensionsAction = PayloadAction<
  "RESIZE",
  {
    candleWidth: number
    columnWidth: number
    graphWidth: number
    height: number
    width: number
  }
>

export const dimensionsReducer = (
  state: DimensionsState,
  action: DimensionsAction
) => {
  switch (action.type) {
    case "RESIZE": {
      console.log("REDUXER RESIZE")
      return {
        ...state,
        ...action.payload,
        viewportWidth: action.payload.width - state.valueAxisWidth,
      }
    }
    default:
      return state
  }
}
