import Chart from "@/components/charts/chart"
import Grid from "@/components/charts/grid"
import Graph from "@/components/charts/graph"
import ccxt from "ccxt"
import data from "@/components/charts/btc.json"
import CrossHair from "@/components/charts/cross-hair"

export const fetchOHLCV = async () => {
  const exchange = new ccxt.coinbase({ enableRateLimit: true })
  const symbol = "BTC/USD"
  const timeframe = "1h"
  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe)
  return ohlcv
}

const extractor = (candle: Array<number | undefined>) => {
  const [time, open, high, low, close, volume] = candle
  return {
    time: time ?? 0,
    open: open ?? 0,
    high: high ?? 0,
    low: low ?? 0,
    close: close ?? 0,
    volume: volume ?? 0,
  }
}

export default async function Page() {
  return (
    <div className="flex flex-col h-full p-6">
      <Chart data={data.map(extractor)} height="600" width="100%">
        <Grid />
        <Graph />
        <CrossHair />
      </Chart>
    </div>
  )
}
