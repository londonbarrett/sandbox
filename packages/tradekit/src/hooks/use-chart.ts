import { use, useCallback } from "react"
import { ChartContext } from "../components/chart"
import { Dimensions } from "../types"
import { usePanel } from "./use-panel"

export const useChart = () => {
  const { visibleMax, visibleMin, resize: panelResize } = usePanel()
  const {
    dispatch,
    ref,
    state: { height },
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
    height,
    ref,
    resize,
  }
}
