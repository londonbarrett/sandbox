import ccxt, { type OHLCV } from "ccxt"
import fs from "fs"
export async function fetchTenThousandCandles(
  targetCount: number = 1000
) {
  // 1. Initialize exchange with rate limiter enabled
  const exchange = new ccxt.binance({ enableRateLimit: true })

  const symbol = "BTC/USDT"
  const timeframe = "1h"
  const limitPerRequest = 1000 // Max allowed by Binance per call

  // 2. Initialize the result array with the proper CCXT type
  // ccxt.OHLCV is a number[] (timestamp, open, high, low, close, volume)
  let allCandles: OHLCV[] = []

  // Start fetching from 10,000 hours ago
  let since = exchange.milliseconds() - targetCount * 60 * 60 * 1000

  console.log(`Starting download of ${targetCount} candles...`)

  // 3. Loop until we hit our target size
  while (allCandles.length < targetCount) {
    try {
      const candles: OHLCV[] = await exchange.fetchOHLCV(
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
      const lastCandle = candles[candles.length - 1]
      if (!lastCandle) {
        break
      }

      const lastCandleTs = lastCandle[0]

      // Set 'since' to the next millisecond to avoid duplicating the last candle
      if (lastCandleTs) {
        since = lastCandleTs + 1
      }

      console.log(
        `Fetched ${allCandles.length}/${targetCount} candles...`
      )
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

const main = async (candles: number) => {
  const data = await fetchTenThousandCandles(candles)
  fs.writeFileSync(
    `./components/charts/${candles}.json`,
    JSON.stringify(data)
  )
}

main(70000).catch((error) => {
  console.error("Error fetching candles:", error)
  process.exit(1)
})
