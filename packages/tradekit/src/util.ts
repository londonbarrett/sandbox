import { useEffect, useState } from "react"

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

export function createLinearScale(
  domain: [number, number],
  range: [number, number]
) {
  const [d0, d1] = domain
  const [r0, r1] = range
  const slope = (r1 - r0) / (d1 - d0)
  return (value: number) => r0 + (value - d0) * slope
}

export function niceTicks(
  start: number,
  stop: number,
  count: number
): number[] {
  const step = tickStep(start, stop, count)
  const t0 = Math.ceil(start / step) * step
  const t1 = Math.floor(stop / step) * step
  const result: number[] = []
  for (let v = t0; v <= t1; v += step) {
    result.push(parseFloat(v.toPrecision(12)))
  }
  return result
}

function tickStep(start: number, stop: number, count: number): number {
  const step = (stop - start) / Math.max(0, count)
  const power = Math.floor(Math.log10(step))
  const error = step / 10 ** power
  let factor: number
  if (error >= Math.sqrt(50)) factor = 10
  else if (error >= Math.sqrt(10)) factor = 5
  else if (error >= Math.sqrt(2)) factor = 2
  else factor = 1
  return factor * 10 ** power
}
