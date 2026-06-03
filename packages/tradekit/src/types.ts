export type Candle = {
  close: number
  high: number
  index: number
  low: number
  open: number
  time: number
  volume: number
}

export type ChartCoords = {
  candle?: Candle
  x: number
  y: number
}

export type Dimensions = {
  height: number
  width: number
}

export type PayloadAction<K, T> = {
  type: K
  payload: T
}
