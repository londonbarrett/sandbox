import { DataContext } from "./data-provider"
import { DisplayContext } from "./display-provider"
import { use, useCallback } from "react"

export default function useChartDisplay() {
  const { state: data } = use(DataContext)
  const { dispatch, ref, state: dimensions } = use(DisplayContext)
  const { columnWidth, height } = dimensions
  const { maxValue, minValue } = data

  const getCandleAt = useCallback(
    (x: number) => {
      const i = Math.floor(x / dimensions.columnWidth)
      return data.data[i]
    },
    [dimensions.columnWidth, data]
  )

  // TODO: Find better naming for helper functions
  const getValueAt = useCallback(
    (y: number) => {
      const value =
        (Math.abs(y - height) / height) * (maxValue - minValue) + minValue
      return value
    },
    [height, maxValue, minValue]
  )

  const getXPosition = useCallback(
    (clientX: number) =>
      clientX - Math.floor(ref.current?.getBoundingClientRect().left || 0),
    [ref]
  )

  const getYCoord = useCallback(
    (value: number) =>
      ((value - minValue) / (maxValue - minValue)) * height - height,
    [height, maxValue, minValue]
  )

  const getAbsYCoord = useCallback(
    (value: number) =>
      Math.abs(((value - minValue) / (maxValue - minValue)) * height - height),
    [height, maxValue, minValue]
  )

  const getYPosition = useCallback(
    (clientY: number) =>
      clientY - Math.floor(ref.current?.getBoundingClientRect().top || 0),
    [ref]
  )

  const setMouseCoords = useCallback(
    (clientX: number, clientY: number) => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) {
        const x = clientX - rect.left
        const y = clientY - rect.top
        const candle = getCandleAt(x)
        dispatch({
          type: "SET_MOUSE_COORDS",
          payload: { x, y, candle },
        })
      }
    },
    [getCandleAt, columnWidth]
  )

  const resizeChart = useCallback(
    (dimensions: { height: number; width: number }) => {
      dispatch({ type: "RESIZE_CHART", payload: dimensions })
    },
    [dispatch]
  )

  return {
    getValueAt,
    getXPosition,
    getAbsYCoord,
    getYCoord,
    getYPosition,
    setMouseCoords,
    resizeChart,
  }
}
