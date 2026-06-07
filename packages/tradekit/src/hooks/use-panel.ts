import { ChartCoords, Dimensions } from "../types"
import { useCallback, use, useMemo } from "react"
import { DisplayContext } from "../providers/display-provider"
import { useData } from "./use-data"

export const usePanel = () => {
  const { data, maxValue, minValue } = useData()
  const { state, dispatch } = use(DisplayContext)
  const { offsetX, columnWidth, viewportWidth } = state

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
      dispatch({
        type: "RESIZE",
        payload: {
          dataLength: data.length,
          width: dimensions.width,
        },
      })
    },
    [data.length, dispatch]
  )

  const zoom = useCallback(
    (delta: number, coords: ChartCoords) => {
      dispatch({ type: "ZOOM", payload: { delta, coords } })
    },
    [dispatch]
  )
  return {
    ...state,
    getCandleAt,
    pan,
    resize,
    zoom,
    visibleMin,
    visibleMax,
  }
}
