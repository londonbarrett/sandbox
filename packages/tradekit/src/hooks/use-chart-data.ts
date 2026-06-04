import { use, useCallback } from "react"
import { DataContext } from "../providers/data-provider"
import { setIndicator as setIndicatorAction } from "../reducers/data-reducer"

export default function useChartData() {
  const { state, dispatch } = use(DataContext)

  const setIndicator = useCallback(
    (key: string, values: (number | null)[]) => {
      dispatch(setIndicatorAction(key, values))
    },
    [dispatch],
  )

  return {
    data: state.data,
    maxValue: state.maxValue,
    minValue: state.minValue,
    indicators: state.indicators,
    setIndicator,
  }
}
