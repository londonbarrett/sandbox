"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import type { ActiveEntry } from "@/lib/cache/ttl-cache"
import { FormEvent, useCallback, useEffect, useState } from "react"

type CacheDashboardProps = {
  initialData: ActiveEntry<string, unknown>[]
}

export default function CacheDashboard({
  initialData,
}: CacheDashboardProps) {
  // console.log("INITIAL", initialData)
  const [cacheItems, setCacheItems] = useState(initialData)
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [ttl, setTtl] = useState(1000000)

  const fetchCache = useCallback(async () => {
    try {
      const res = await fetch("/api/johnny")
      if (res.ok) {
        const data = await res.json()
        setCacheItems(data)
      }
    } catch (err) {
      console.error("Failed to pull cache:", err)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchCache, 500)
    return () => clearInterval(interval)
  }, [fetchCache])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!key || !value) return

    await fetch("/api/johnny", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, ttl }),
    })

    setKey("")
    setValue("")
    fetchCache()
  }

  return (
    <main className="flex flex-col items-center gap-4">
      <div className="flex w-1/2 flex-col gap-4">
        <h1>TTL Cache</h1>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Input
            type="number"
            placeholder="TTL (in milliseconds)"
            value={ttl}
            onChange={(e) => setTtl(Number(e.target.value))}
          />
          <Button type="submit">Add to Cache</Button>
        </form>

        <h2>Active Cache Entries</h2>
        <div className="rounded-md border border-solid border-lime-300 p-4">
          {cacheItems.length === 0 ? (
            <p style={{ color: "#666", margin: 0 }}>
              The cache is currently empty or expired.
            </p>
          ) : (
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              {cacheItems.map((item) => (
                <li key={item.key} style={{ margin: "8px 0" }}>
                  <strong>{item.key}</strong>: {String(item.value)}
                  <span className="">
                    ({(item.timeLeftMs / 1000).toFixed(1)}s remaining)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
