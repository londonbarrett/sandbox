"use client"

import { useEffect, useMemo } from "react"
import useChartData from "../hooks/use-chart-data"
import useChartDisplay from "../hooks/use-chart-display"
import { ema } from "../calculations"

export type EMAGraphProps = {
  className?: string
  color?: string
  period: number
}

export default function EMAGraph({
  className,
  color = "#f59e0b",
  period = 200,
}: EMAGraphProps) {
  const { data, setIndicator } = useChartData()
  const { columnWidth, getAbsYCoord, offsetX, viewportWidth } =
    useChartDisplay()

  const closes = useMemo(() => data.map((c) => c.close), [data])

  const emaValues = useMemo(() => ema(closes, period), [closes, period])

  useEffect(() => {
    setIndicator(`ema-${period}`, emaValues)
  }, [emaValues, period, setIndicator])

  const pathD = useMemo(() => {
    if (columnWidth <= 0 || viewportWidth <= 0 || data.length === 0) {
      return ""
    }

    const startIndex = Math.max(0, Math.floor(-offsetX / columnWidth))
    const endIndex = Math.min(
      data.length - 1,
      Math.floor((-offsetX + viewportWidth) / columnWidth)
    )

    let d = ""
    let started = false

    for (let i = startIndex; i <= endIndex; i++) {
      const value = emaValues[i]
      if (value === null || value === undefined) continue

      const x = offsetX + columnWidth * i + columnWidth / 2
      const y = getAbsYCoord(value)

      if (!started) {
        d += `M ${x} ${y}`
        started = true
      } else {
        d += `L ${x} ${y}`
      }
    }

    return d
  }, [emaValues, columnWidth, getAbsYCoord, offsetX, viewportWidth])

  if (!pathD) return null

  return (
    <g className={className}>
      <path
        d={pathD}
        fill="none"
        style={{
          stroke: color,
          strokeWidth: 2,
        }}
      />
    </g>
  )
}
