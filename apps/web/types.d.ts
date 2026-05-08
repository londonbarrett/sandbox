type Action<K, T> = {
  type: K
  payload: T
}

/**
 * GAME TYPES
 */

export type Candle = {
  close: number
  high: number
  index: number
  low: number
  open: number
  time: number
  volume: number
}

export type ChartConfig = {
  height: number
  maxValue: number
  minValue: number
  seqDelay: number
  valueAxisWidth: number
}

export type Chart = {
  breakpoint: number
  count: number
  data: Array<Candle>
  date: string
  hour: string
  interval: string
  minute: string
  query: string
  symbol: string
}

export type Dimensions = {
  height: number
  width: number
}

export type Coords = {
  candle?: Candle
  x: number
  y: number
}
