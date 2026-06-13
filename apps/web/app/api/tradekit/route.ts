import { NextRequest, NextResponse } from "next/server"
import { ChartCoords } from "../../../../../packages/tradekit/src/types"
import { OHLCV } from "ccxt"
import path from "path"
import fs from "fs"
import z from "zod"

const schema = z.object({
  count: z
    .string()
    .regex(/\^d+$/, "Must be a numeric string")
    .transform(Number),
})

export const GET = async (request: NextRequest) => {
  const count = request.nextUrl.searchParams.get("count") as
    | string
    | "0"

  const validation = schema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  )

  console.log(
    "VALIDATION",
    validation.data?.count,
    Object.fromEntries(request.nextUrl.searchParams)
  )

  try {
    const file = fs.readFileSync(
      path.resolve(`./data/${count}.json`),
      "utf-8"
    )
    const data = (await JSON.parse(file)) as OHLCV[]
    return NextResponse.json({
      data: data.slice(0, parseInt(count)),
    })
  } catch {
    throw "FUCK FILE"
  }
}

export const POST = async (coords: ChartCoords) => {
  return NextResponse.json({ data: coords })
}
