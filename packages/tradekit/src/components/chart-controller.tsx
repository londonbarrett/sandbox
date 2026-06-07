import { usePanel } from "../hooks/use-panel"
import { useChart } from "../hooks/use-chart"
import useMouseLock from "../hooks/use-mouse-lock"

import {
  MouseEvent,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react"

type ChartControllerProps = {
  children: ReactNode
  className?: string
  height: number | string
  ref: RefObject<SVGSVGElement | null>
  width: number | string
}

export function ChartController({
  children,
  className,
  height,
  ref,
  width,
}: ChartControllerProps) {
  const { mouseLock, setMouseLock } = useMouseLock()
  const { getCandleAt, pan, zoom } = usePanel()
  const { coords, resize, setCoords } = useChart()

  const mouseMoveHandler = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) {
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const candle = getCandleAt(x)
        setCoords({ candle, x, y })
      }
    },
    [getCandleAt, ref]
  )

  const [mouseMode] = useState<"BOTH" | "LOCK" | "SPLIT">("BOTH")
  const wheelHandler = useCallback(
    (event: WheelEvent) => {
      event.preventDefault()
      setMouseLock(event.deltaX, event.deltaY)
      if (mouseMode === "SPLIT") {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          pan(event.deltaX)
        } else {
          zoom(event.deltaY, coords)
        }
      } else if (mouseMode === "BOTH") {
        pan(event.deltaX)
        zoom(event.deltaY, coords)
      } else if (mouseMode === "LOCK") {
        if (mouseLock === "PAN") {
          pan(event.deltaX)
        } else {
          zoom(event.deltaY, coords)
        }
      }
    },
    [coords, mouseLock, mouseMode, setMouseLock, pan, zoom]
  )

  useEffect(
    function resizeEffect() {
      const container = ref.current
      const observer = new ResizeObserver((entries) => {
        const height = entries[0]?.contentRect.height || 0
        const width = entries[0]?.contentRect.width || 0
        resize({ height, width })
      })

      if (container) {
        observer.observe(container)
      }

      return () => {
        if (container) {
          observer.unobserve(container)
        }
      }
    },
    [ref, resize]
  )

  useEffect(() => {
    const container = ref.current
    if (container) {
      container.addEventListener("wheel", wheelHandler, {
        passive: false,
      })
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", wheelHandler)
      }
    }
  }, [ref, wheelHandler])

  return (
    <svg
      className={className}
      height={height}
      onMouseMove={mouseMoveHandler}
      ref={ref}
      shapeRendering="crispEdges"
      style={{ backgroundColor: "var(--chart-bg)" }}
      width={width}
    >
      {children}
    </svg>
  )
}
