"use client"

import { ReactNode, useRef } from "react"
import ChartController from "./chart-controller"
import DataProvider from "../providers/data-provider"
import DisplayProvider from "../providers/display-provider"
import { Candle } from "../types"
import MouseCoordsProvider from "../providers/mouse-coords-provider"

export type ChartProps = {
  children: ReactNode
  className?: string
  data: Candle[]
  height?: number | string
  width?: number | string
}

export default function Chart({
  children,
  className,
  data,
  height = "100%",
  width = "100%",
}: ChartProps) {
  const ref = useRef<SVGSVGElement | null>(null)

  return (
    <DataProvider data={data}>
      <DisplayProvider ref={ref}>
        <MouseCoordsProvider>
          <ChartController
            className={className}
            height={height}
            ref={ref}
            width={width}
          >
            {children}
          </ChartController>
        </MouseCoordsProvider>
      </DisplayProvider>
    </DataProvider>
  )
}
