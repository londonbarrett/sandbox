import ccxt from "ccxt"
import {
  Chart,
  Crosshair,
  EMAGraph,
  Grid,
  PriceGraph,
  Status,
  Symbol,
  TradekitProvider,
  ValueAxis,
} from "react-tradekit"

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
      <TradekitProvider data={fileData.map(extractor)}>
        <Chart height="500">
          <Grid />
          <Symbol symbol="BTC/USD" interval="1h" />
          <PriceGraph />
          <EMAGraph period={200} />
          <EMAGraph color="#34f56e" period={50} />
          <Crosshair />
          <Status
            showIndex
            showIndicators
            symbol="BTC/USD"
            interval="1h"
          />
          <ValueAxis />
        </Chart>
        <Chart height={300}>
          <EMAGraph period={10} />
          <EMAGraph color="#34f56e" period={20} />
          <EMAGraph color="#34f5fe" period={30} />
          <Crosshair />
          <ValueAxis />
        </Chart>
      </TradekitProvider>
    </div>
  )
}
