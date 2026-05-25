import Chart from "@/components/charts/chart"
import Grid from "@/components/charts/grid"
import Graph from "@/components/charts/graph"
import ccxt from "ccxt"
import data from "@/components/charts/300.json"
import CrossHair from "@/components/charts/cross-hair"
import Status from "@/components/charts/status"
import Symbol from "@/components/charts/symbol"
import ValueAxis from "@/components/charts/value-axis"

export const fetchOHLCV = async () => {
  const exchange = new ccxt.coinbase({ enableRateLimit: true })
  const symbol = "BTC/USD"
  const timeframe = "1h"
  const ohlcv = await exchange.fetchOHLCV(
    symbol,
    timeframe,
    new Date("2023-01-01T00:00:00Z").getTime(),
    1000
  )
  return ohlcv
}

const extractor = (
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
  // const long = await fetchTenThousandCandles()
  // console.log(long)
  // const write = fs.writeFileSync("long.json", JSON.stringify(long, null, 2))
  return (
    <div className="flex h-full flex-col p-6">
      <Chart data={data.map(extractor)} height="600" width="100%">
        <Grid />
        <Symbol symbol="BTC/USD" interval="1h" />
        <Graph />
        <CrossHair />
        <Status showIndex symbol="BTC/USD" interval="1h" />
        <ValueAxis />
      </Chart>
    </div>
  )
}
