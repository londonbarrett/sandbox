import {
  Chart,
  CandleChartGrid,
  CandleChartCrosshair,
  CandleChartStatus,
  CandleChartSymbol,
  CandleChartAxis,
  PriceGraph,
  EMAGraph,
} from "react-tradekit"
import ccxt from "ccxt"

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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let fileData: Array<Array<number | undefined>> = []
  try {
    fileData = (await import(`@/data/${id}.json`)).default
  } catch (error) {
    console.error(`Unable to load data for id="${id}"`, error)
  }

  return (
    <div className="flex h-full flex-col p-6">
      <Chart data={fileData.map(extractor)} height="600" width="100%">
        <CandleChartGrid />
        <CandleChartSymbol symbol="BTC/USD" interval="1h" />
        <EMAGraph period={200} />
        <EMAGraph color="#34f56e" period={50} />
        <PriceGraph />
        <CandleChartCrosshair />
        <CandleChartStatus showIndex showIndicators symbol="BTC/USD" interval="1h" />
        <CandleChartAxis />
      </Chart>
    </div>
  )
}
