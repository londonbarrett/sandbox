import { use } from "react"
import { TradekitContext } from "../components/tradekit-provider"

export function useData() {
  const { state } = use(TradekitContext)

  return {
    data: state.data,
    maxValue: state.maxValue,
    minValue: state.minValue,
  }
}
