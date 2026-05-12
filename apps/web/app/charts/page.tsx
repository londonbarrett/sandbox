import Chart from "@/components/charts/chart"
import Grid from "@/components/charts/grid"
import Graph from "@/components/charts/graph"
import ccxt from "ccxt"
import data from "@/components/charts/btc.json"
import CrossHair from "@/components/charts/cross-hair"
import Status from "@/components/charts/status"
import Symbol from "@/components/charts/symbol"
import ValueAxis from "@/components/charts/value-axis"

export const fetchOHLCV = async () => {
  const exchange = new ccxt.coinbase({ enableRateLimit: true })
  const symbol = "BTC/USD"
  const timeframe = "1h"
  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe)
  return ohlcv
}

const extractor = (candle: Array<number | undefined>, index: number) => {
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
  return (
    <div className="flex flex-col h-full p-6">
      <Chart data={data.map(extractor)} height="600" width="100%">
        <Grid />
        <ValueAxis />
        <Symbol symbol="BTC/USD" interval="1h" />
        <Graph />
        <CrossHair />
        <Status symbol="BTC/USD" interval="1h" />
      </Chart>
    </div>
  )
}
