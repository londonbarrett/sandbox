import { use } from "react"
import { DataContext } from "../data-provider"

export default function useChartData() {
  const { state } = use(DataContext)

  return {
    data: state.data,
    maxValue: state.maxValue,
    minValue: state.minValue,
  }
}
