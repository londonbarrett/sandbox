import Chart from "@/components/charts/chart"
import Grid from "@/components/charts/grid"
import Graph from "@/components/charts/graph"
import ccxt from "ccxt"
import data from "@/components/charts/2000.json"
import CrossHair from "@/components/charts/cross-hair"
import Status from "@/components/charts/status"
import Symbol from "@/components/charts/symbol"
import ValueAxis from "@/components/charts/value-axis"
import fs from "fs"

async function fetchTenThousandCandles() {
  // 1. Initialize exchange with rate limiter enabled
  const exchange = new ccxt.binance({ enableRateLimit: true })

  const symbol = "BTC/USDT"
  const timeframe = "1h"
  const targetCount = 2000
  const limitPerRequest = 1000 // Max allowed by Binance per call

  // 2. Initialize the result array with the proper CCXT type
  let allCandles: ccxt.OHLCV[] = []

  // Start fetching from 10,000 hours ago
  let since = exchange.milliseconds() - targetCount * 60 * 60 * 1000

  console.log(`Starting download of ${targetCount} candles...`)

  // 3. Loop until we hit our target size
  while (allCandles.length < targetCount) {
    try {
      const candles: ccxt.OHLCV[] = await exchange.fetchOHLCV(
        symbol,
        timeframe,
        since,
        limitPerRequest
      )

      if (candles.length === 0) {
        console.log("No more candles available on the exchange.")
        break
      }

      allCandles = allCandles.concat(candles)

      // Get the timestamp of the last candle received
      const lastCandleTs = candles[candles.length - 1][0]

      // Set 'since' to the next millisecond to avoid duplicating the last candle
      if (lastCandleTs) {
        since = lastCandleTs + 1
      }

      console.log(`Fetched ${allCandles.length}/${targetCount} candles...`)
    } catch (error) {
      console.error("Fetch failed, retrying...", error)
      // Wait 1 second before retrying to respect rate limits
      await exchange.sleep(1000)
    }
  }

  // 4. Trim any extra candles if we exceeded 10,000
  const finalCandles = allCandles.slice(0, targetCount)
  console.log(`Successfully fetched ${finalCandles.length} candles.`)
  return finalCandles
}

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

/**
 *
 * Components moving on panning:
 * graph
 *
 */

export default async function Page() {
  // const long = await fetchTenThousandCandles()
  // console.log(long)
  // const write = fs.writeFileSync("long.json", JSON.stringify(long, null, 2))
  return (
    <div className="flex h-full flex-col p-6">
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
