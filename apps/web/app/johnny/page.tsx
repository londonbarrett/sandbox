// app/page.js
"use client"

import { useCallback, useEffect, useState } from "react"

export default function CacheDashboard() {
  const [cacheItems, setCacheItems] = useState([])
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [ttl, setTtl] = useState(10000) // Default 10 seconds

  // Fetch data from our Next.js Route Handler
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

  // Poll the backend every 500ms for accurate UI expiration count-downs
  useEffect(() => {
    fetchCache()
    const interval = setInterval(fetchCache, 500)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!key || !value) return

    await fetch("/api/cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, ttl }),
    })

    setKey("")
    setValue("")
    fetchCache()
  }

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>⏱️ Next.js Full-Stack TTL Cache</h1>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="number"
          placeholder="TTL (in milliseconds)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          style={{ padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add to Cache
        </button>
      </form>

      {/* Live Monitor View */}
      <h2>Active Cache Entries</h2>
      <div
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        {cacheItems.length === 0 ? (
          <p style={{ color: "#666", margin: 0 }}>
            The cache is currently empty or expired.
          </p>
        ) : (
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            {cacheItems.map((item) => (
              <li key={item.key} style={{ margin: "8px 0" }}>
                <strong>{item.key}</strong>: {item.value}
                <span
                  style={{
                    color: "#d32f2f",
                    marginLeft: "10px",
                    fontSize: "0.9em",
                  }}
                >
                  ({(item.timeLeftMs / 1000).toFixed(1)}s remaining)
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
