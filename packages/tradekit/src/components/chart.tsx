"use client"

import { ReactNode, useRef } from "react"
import { ChartController } from "./chart-controller"
import { ChartProvider } from "../providers/chart-provider"

export type ChartProps = {
  children: ReactNode
  className?: string
  height?: number | string
  width?: number | string
}

export function Chart({
  children,
  className,
  height = "100%",
  width = "100%",
}: ChartProps) {
  const ref = useRef<SVGSVGElement | null>(null)

  return (
    <ChartProvider ref={ref}>
      <ChartController
        className={className}
        height={height}
        ref={ref}
        width={width}
      >
        {children}
      </ChartController>
    </ChartProvider>
  )
}
