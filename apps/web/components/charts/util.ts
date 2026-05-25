import ccxt, { type OHLCV } from "ccxt"
import { useEffect, useState } from "react"

// TODO: instantiate and return function
export const getCurrencyFormatter = (
  value: number,
  style: "currency" | "decimal" = "currency",
  decimalPlaces: number = 2
) => {
  const options = {
    currency: "USD",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    style,
  }
  return Intl.NumberFormat("en-US", options).format(value)
}

export async function fetchTenThousandCandles() {
  // 1. Initialize exchange with rate limiter enabled
  const exchange = new ccxt.binance({ enableRateLimit: true })

  const symbol = "BTC/USDT"
  const timeframe = "1h"
  const targetCount = 2000
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

export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(setDebouncedValue, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [delay, value])
  return debouncedValue
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
