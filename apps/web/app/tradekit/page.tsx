import { ChartDemo } from "@/components/chart-demo"
import data from "../../data/2000.json"

export const extractor = (
  candle: Array<number | undefined>,
  index: number
) => {
  const [time, open, high, low, close, volume] = candle
  return {
    close: close ?? 0,
    high: high ?? 0,
    index,
    low: low ?? 0,
    open: open ?? 0,
    time: time ?? 0,
    volume: volume ?? 0,
  }
}

export default async function Page() {
  return <ChartDemo data={data.map(extractor)} />
}
