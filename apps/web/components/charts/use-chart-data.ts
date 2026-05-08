import { DataContext } from "./data-provider"
import { use } from "react"

export default function useChartData() {
  const { state } = use(DataContext)
  return {
    data: state.data,
    maxValue: state.maxValue,
    minValue: state.minValue,
  }
}
