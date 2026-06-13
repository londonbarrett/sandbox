import { use, useCallback } from "react"
import { ChartContext } from "../components/chart"
import { Dimensions } from "../types"
import { usePanel } from "./use-panel"
import { setIndicator as setIndicatorAction } from "../reducers/chart-reducer"

export const useChart = () => {
  const { visibleMax, visibleMin, resize: panelResize } = usePanel()
  const {
    dispatch,
    ref,
    state: { hasPriceGraph, height, indicators },
  } = use(ChartContext)

  const getValueAt = useCallback(
    (y: number) => {
      const value =
        (Math.abs(y - height) / height) * (visibleMax - visibleMin) +
        visibleMin
      return value
    },
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

  const getYCoord = useCallback(
    (value: number) =>
      ((value - visibleMin) / (visibleMax - visibleMin)) * height -
      height,
    [height, visibleMax, visibleMin]
  )

  const getXPosition = useCallback(
    (clientX: number) =>
      clientX -
      Math.floor(ref.current?.getBoundingClientRect().left || 0),
    [ref]
  )

  const getYPosition = useCallback(
    (clientY: number) =>
      clientY -
      Math.floor(ref.current?.getBoundingClientRect().top || 0),
    [ref]
  )

  const setHasPriceGraph = useCallback(
    (value: boolean) => {
      dispatch({ type: "SET_PRICE_GRAPH", payload: value })
    },
    [dispatch]
  )

  const setIndicator = useCallback(
    (key: string, values: (number | null)[]) => {
      dispatch(setIndicatorAction(key, values))
    },
    [dispatch]
  )

  const resize = useCallback(
    (dimensions: Dimensions) => {
      panelResize(dimensions)
      dispatch({
        type: "RESIZE",
        payload: dimensions.height,
      })
    },
    [dispatch, panelResize]
  )

  return {
    getAbsYCoord,
    getValueAt,
    hasPriceGraph,
    height,
    indicators,
    ref,
    resize,
    setHasPriceGraph,
    setIndicator,
  }
}
