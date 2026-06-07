import { use, useCallback } from "react"
import { TradekitContext } from "../providers/tradekit-provider"
import { setIndicator as setIndicatorAction } from "../reducers/data-reducer"

export function useData() {
  const { state, dispatch } = use(TradekitContext)

  const setIndicator = useCallback(
    (key: string, values: (number | null)[]) => {
      dispatch(setIndicatorAction(key, values))
    },
    [dispatch]
  )

  return {
    data: state.data,
    maxValue: state.maxValue,
    minValue: state.minValue,
    indicators: state.indicators,
    setIndicator,
  }
}
