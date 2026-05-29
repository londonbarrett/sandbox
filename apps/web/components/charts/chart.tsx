"use client"

import { ReactNode, useRef } from "react"
import DataProvider from "./data-provider"
import SVG from "./svg"
import { Candle } from "@/types"
import DisplayProvider from "./display-provider"

export type ChartProps = {
  children: ReactNode
  data: Candle[]
  height: number | string
  width: number | string
}

export default function Chart({
  children,
  data,
  height,
  width,
}: ChartProps) {
  const ref = useRef<SVGSVGElement | null>(null)
  return (
    <DataProvider data={data}>
      <DisplayProvider ref={ref}>
        <SVG ref={ref} height={height} width={width}>
          {children}
        </SVG>
      </DisplayProvider>
    </DataProvider>
  )
}
