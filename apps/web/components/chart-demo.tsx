"use client"

import { extractor } from "@/app/tradekit/page"
import { Candle } from "@/types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "sonner"
import { useEffect, useState } from "react"
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

export type ChartDemoProps = {
  data: Candle[]
}

export function ChartDemo({ data }: ChartDemoProps) {
  const [candles, setCandles] = useState(data)
  const [count, setCount] = useState<string | null>("300")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await fetch(`/api/tradekit?count=${count}`)
        const data: { data: number[][] } = await request.json()

        setCandles(data.data.map(extractor))
      } catch {
        toast.error("FETCH ERROR")
      }
    }
    fetchData()
  }, [count])

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col">
        <TradekitProvider data={candles}>
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
      <div>
        <Select
          onValueChange={(value) => setCount(value)}
          value={count}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a dataset" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                <SelectItem value="fack">Fack</SelectItem>
                <SelectItem value="300">300</SelectItem>
                <SelectItem value="2000">2000</SelectItem>
                <SelectItem value="10000">10000</SelectItem>
                <SelectItem value="70000">70000</SelectItem>
              </SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
