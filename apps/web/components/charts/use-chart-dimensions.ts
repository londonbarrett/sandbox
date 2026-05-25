"use client"

import { Dimensions } from "@/types"
import { DimensionsContext } from "./dimensions-provider"
import { use, useCallback } from "react"
import useChartData from "./use-chart-data"
import useChartDisplay from "./use-chart-display"

export default function useChartDimensions() {
  const { displayCandles, offsetX } = useChartDisplay()
  const { data, maxValue, minValue } = useChartData()
  const { dispatch, ref, state } = use(DimensionsContext)
  const { height, valueAxisWidth } = state

  const getCandleAt = useCallback(
    (x: number) => {
      const i = Math.floor((x - offsetX) / state.columnWidth)
      return data[i]
    },
    [state.columnWidth, data, offsetX]
  )

  // TODO: Find better naming for helper functions
  const getValueAt = useCallback(
    (y: number) => {
      const value =
        (Math.abs(y - height) / height) * (maxValue - minValue) +
        minValue
      return value
    },
    [height, maxValue, minValue]
  )

  const getXPosition = useCallback(
    (clientX: number) =>
      clientX -
      Math.floor(ref.current?.getBoundingClientRect().left || 0),
    [ref]
  )

  const getYCoord = useCallback(
    (value: number) =>
      ((value - minValue) / (maxValue - minValue)) * height - height,
    [height, maxValue, minValue]
  )

  const getAbsYCoord = useCallback(
    (value: number) =>
      Math.abs(
        ((value - minValue) / (maxValue - minValue)) * height - height
      ),
    [height, maxValue, minValue]
  )

  const getYPosition = useCallback(
    (clientY: number) =>
      clientY -
      Math.floor(ref.current?.getBoundingClientRect().top || 0),
    [ref]
  )

  /**
   * Zoom should be related to the number of candles visible in the chart
   */
  const resize = useCallback(
    (dimensions: Dimensions) => {
      if (data.length > 0) {
        const columnWidth =
          (dimensions.width - valueAxisWidth) / displayCandles
        dispatch({
          type: "RESIZE",
          payload: {
            graphWidth: columnWidth * data.length,
            // TODO: Candle Scale factor should be in a config object
            candleWidth: columnWidth * 0.8,
            columnWidth,
            height: dimensions.height,
            width: dimensions.width,
          },
        })
      }
    },
    [data, dispatch, displayCandles, valueAxisWidth]
  )

  return {
    ...state,
    getCandleAt,
    getValueAt,
    getXPosition,
    getAbsYCoord,
    getYCoord,
    getYPosition,
    resize,
  }
}
