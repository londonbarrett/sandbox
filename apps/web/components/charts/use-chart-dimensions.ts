"use client"

import { Dimensions } from "@/types"
import { DimensionsContext } from "./dimensions-provider"
import { use, useCallback } from "react"
import useChartData from "./use-chart-data"
import { DimensionsAction } from "./dimensions-reducer"

export default function useChartDisplay() {
  const { data, maxValue, minValue } = useChartData()
  const { dispatch, ref, state } = use(DimensionsContext)
  const { height } = state

  const getCandleAt = useCallback(
    (x: number) => {
      const i = Math.floor(x / state.columnWidth)
      return data[i]
    },
    [state.columnWidth, data]
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

  const resizeChart = useCallback(
    (dimensions: Dimensions) => {
      if (data.length > 0) {
        dispatch({
          type: "RESIZE_CHART",
          payload: {
            candleWidth: ((dimensions.width - 60) / data.length) * 0.8,
            columnWidth: (dimensions.width - 60) / data.length,
            height: dimensions.height,
            width: dimensions.width,
          },
        })
      }
    },
    [data, dispatch]
  )

  return {
    state,
    getCandleAt,
    getValueAt,
    getXPosition,
    getAbsYCoord,
    getYCoord,
    getYPosition,
    resizeChart,
  }
}
