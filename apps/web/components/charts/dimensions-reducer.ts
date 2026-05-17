import { Action } from "@/types"

export type DimensionsState = {
  candleWidth: number
  columnWidth: number
  graphWidth: number
  height: number
  valueAxisWidth: number
  width: number
}

export type DimensionsAction = Action<
  "RESIZE_CHART",
  {
    height: number
    width: number
    columnWidth: number
    candleWidth: number
  }
>

export const dimensionsReducer = (
  state: DimensionsState,
  action: DimensionsAction
) => {
  switch (action.type) {
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
