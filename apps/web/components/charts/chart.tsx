import { Candle } from "@/types"
import { ReactNode, useRef } from "react"
import DataProvider from "./data-provider"
import SVG from "./svg"
import DisplayProvider from "./display-provider"

export type ChartProps = {
  data: Candle[]
  children: ReactNode
}

export default function Chart({ children, data }: ChartProps) {
  const ref = useRef<SVGSVGElement | null>(null)
  return (
    <DataProvider data={data}>
      <DisplayProvider ref={ref}>
        <SVG ref={ref}>{children}</SVG>
      </DisplayProvider>
    </DataProvider>
  )
}
