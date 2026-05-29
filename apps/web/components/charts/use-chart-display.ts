import { Dimensions } from "@/types"
import { useCallback, use } from "react"
import { DisplayContext } from "./display-provider"
import useChartData from "./use-chart-data"

export default function useChartDisplay() {
  const { data, maxValue, minValue } = useChartData()
  const { ref, state, dispatch } = use(DisplayContext)

  const getCandleAt = useCallback(
    (x: number) => {
      const i = Math.floor((x - state.offsetX) / state.columnWidth)
      return data[i]
    },
    [data, state.columnWidth, state.offsetX]
  )

  // TODO: Find better naming for helper functions
  const getValueAt = useCallback(
    (y: number) => {
      const value =
        (Math.abs(y - state.height) / state.height) *
          (maxValue - minValue) +
        minValue
      return value
    },
    [state.height, maxValue, minValue]
  )

  const getXPosition = useCallback(
    (clientX: number) =>
      clientX -
      Math.floor(ref.current?.getBoundingClientRect().left || 0),
    [ref]
  )

  const getYCoord = useCallback(
    (value: number) =>
      ((value - minValue) / (maxValue - minValue)) * state.height -
      state.height,
    [state.height, maxValue, minValue]
  )

  const getAbsYCoord = useCallback(
    (value: number) =>
      Math.abs(
        ((value - minValue) / (maxValue - minValue)) * state.height -
          state.height
      ),
    [state.height, maxValue, minValue]
  )

  const getYPosition = useCallback(
    (clientY: number) =>
      clientY -
      Math.floor(ref.current?.getBoundingClientRect().top || 0),
    [ref]
  )

  const pan = useCallback(
    (payload: number) =>
      dispatch({
        type: "PAN",
        payload,
      }),
    [dispatch]
  )

  const resize = useCallback(
    (dimensions: Dimensions) => {
      if (data.length > 0) {
        console.log("USE DIMENSIONS RESIZE")
        dispatch({
          type: "RESIZE",
          payload: {
            dataLength: data.length,
            height: dimensions.height,
            width: dimensions.width,
          },
        })
      }
    },
    [data, dispatch]
  )

  const zoom = useCallback(
    // TODO: When zooming, graph position should be locked at the position before zooming
    (payload: number) => {
      dispatch({ type: "ZOOM", payload })
    },
    [dispatch]
  )
  return {
    ...state,
    getAbsYCoord,
    getCandleAt,
    getValueAt,
    getXPosition,
    getYCoord,
    getYPosition,
    pan,
    resize,
    zoom,
  }
}
