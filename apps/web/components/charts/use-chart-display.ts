import { Coords, Dimensions } from "@/types"
import { useCallback, use, useMemo } from "react"
import { DisplayContext } from "./display-provider"
import useChartData from "./use-chart-data"

export default function useChartDisplay() {
  const { data, maxValue, minValue } = useChartData()
  const { ref, state, dispatch } = use(DisplayContext)
  const { offsetX, columnWidth, viewportWidth, height } = state

  const { visibleMin, visibleMax } = useMemo(() => {
    if (data.length === 0 || columnWidth <= 0 || viewportWidth <= 0) {
      return { visibleMin: minValue, visibleMax: maxValue }
    }

    const startIndex = Math.max(0, Math.floor(-offsetX / columnWidth))
    const endIndex = Math.min(
      data.length - 1,
      Math.floor((-offsetX + viewportWidth) / columnWidth)
    )

    if (startIndex > endIndex) {
      return { visibleMin: minValue, visibleMax: maxValue }
    }

    let vMin = Infinity
    let vMax = -Infinity

    for (let i = startIndex; i <= endIndex; i++) {
      const candle = data[i]
      if (candle) {
        if (candle.low < vMin) vMin = candle.low
        if (candle.high > vMax) vMax = candle.high
      }
    }

    if (vMin === Infinity || vMax === -Infinity) {
      return { visibleMin: minValue, visibleMax: maxValue }
    }

    const range = vMax - vMin
    const padding = range * 0.05 || maxValue * 0.01 || 1

    return {
      visibleMin: vMin - padding,
      visibleMax: vMax + padding,
    }
  }, [data, offsetX, columnWidth, viewportWidth, minValue, maxValue])

  const getCandleAt = useCallback(
    (x: number) => {
      const i = Math.floor((x - offsetX) / columnWidth)
      return data[i]
    },
    [data, columnWidth, offsetX]
  )

  const getValueAt = useCallback(
    (y: number) => {
      const value =
        (Math.abs(y - height) / height) * (visibleMax - visibleMin) +
        visibleMin
      return value
    },
    [height, visibleMax, visibleMin]
  )

  const getXPosition = useCallback(
    (clientX: number) =>
      clientX -
      Math.floor(ref.current?.getBoundingClientRect().left || 0),
    [ref]
  )

  const getYCoord = useCallback(
    (value: number) =>
      ((value - visibleMin) / (visibleMax - visibleMin)) * height -
      height,
    [height, visibleMax, visibleMin]
  )

  const getAbsYCoord = useCallback(
    (value: number) =>
      Math.abs(
        ((value - visibleMin) / (visibleMax - visibleMin)) * height -
          height
      ),
    [height, visibleMax, visibleMin]
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
    (delta: number, coords: Coords) => {
      dispatch({ type: "ZOOM", payload: { delta, coords } })
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
    visibleMin,
    visibleMax,
  }
}
