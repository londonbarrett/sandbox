import { getActiveEntries, setEntry } from "@/lib/cache/service"
import { NextRequest, NextResponse } from "next/server"

type PostBody = {
  key?: string
  value?: unknown
  ttl?: number
}

export async function GET() {
  const activeItems = getActiveEntries()
  return NextResponse.json(activeItems)
}

export async function POST(request: NextRequest) {
  try {
    const { key, value, ttl }: PostBody = await request.json()

    if (key === undefined || value === undefined) {
      return NextResponse.json(
        { error: "Key and Value are required" },
        { status: 400 }
      )
    }

    setEntry(key, value, ttl)
    return NextResponse.json({
      success: true,
      message: `Key "${key}" cached.`,
    })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
