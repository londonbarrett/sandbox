// app/api/cache/route.js
import { ttlCache } from "@/lib/ttl-cache"
import { NextRequest, NextResponse } from "next/server"

// GET: Returns all active keys in the cache
export async function GET() {
  const activeItems = ttlCache.getAllActive()
  return NextResponse.json(activeItems)
}

// POST: Adds a new item to the cache
export async function POST(request: NextRequest) {
  try {
    const { key, value, ttl } = await request.json()

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and Value are required" },
        { status: 400 }
      )
    }

    ttlCache.set(key, value, ttl)
    return NextResponse.json({
      success: true,
      message: `Key "${key}" cached.`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
