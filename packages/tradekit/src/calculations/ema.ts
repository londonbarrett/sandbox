export function ema(values: number[], period: number): (number | null)[] {
  if (values.length === 0 || period <= 0) return []

  const result: (number | null)[] = []
  const multiplier = 2 / (period + 1)

  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(null)
      continue
    }

    if (i === period - 1) {
      let sum = 0
      for (let j = 0; j < period; j++) {
        const v = values[j]
        if (v !== undefined) sum += v
      }
      result.push(sum / period)
    } else {
      const prevEma = result[i - 1]
      if (prevEma === null || prevEma === undefined) {
        result.push(null)
      } else {
        const v = values[i]
        if (v === undefined) {
          result.push(null)
        } else {
          result.push((v - prevEma) * multiplier + prevEma)
        }
      }
    }
  }

  return result
}
