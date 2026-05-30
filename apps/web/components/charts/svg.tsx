"use client"

import { Coords } from "@/types"
import {
  createContext,
  MouseEvent,
  ReactNode,
  RefObject,
  // TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import useChartDisplay from "./use-chart-display"

// TODO: Move to a separate file?
export const MouseCoordsContext = createContext<Coords>({
  candle: undefined,
  x: 0,
  y: 0,
})

export type SVGProps = {
  children: ReactNode
  height?: number | string
  ref: RefObject<SVGSVGElement | null>
  width?: number | string
}

const useMouseLock = (delay: number = 2000) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [mouseLock, setValue] = useState<"PAN" | "ZOOM">()
  const setMouseLock = (deltaX: number, deltaY: number) => {
    if (!mouseLock) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setValue("PAN")
      } else {
        setValue("ZOOM")
      }
      timeout.current = setTimeout(() => {
        setValue(undefined)
      }, delay)
    }
  }
  return { mouseLock, setMouseLock }
}

export default function SVG({
  children,
  height = "100%",
  ref,
  width = "100%",
}: SVGProps) {
  const { mouseLock, setMouseLock } = useMouseLock()
  const { getCandleAt, pan, resize, zoom } = useChartDisplay()
  const [mouseCoords, setMouseCoords] = useState<Coords>({
    candle: undefined,
    x: 0,
    y: 0,
  })

  const mouseMoveHandler = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) {
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const candle = getCandleAt(x)
        setMouseCoords({ candle, x, y })
      }
    },
    [getCandleAt, ref]
  )

  // const touchMoveHandler = useCallback(
  //   (event: TouchEvent<SVGSVGElement>) => {
  //     if (event.touches.length > 0) {
  //       const touch = event.touches[0]
  //       if (touch) {
  //         const rect = ref.current?.getBoundingClientRect()
  //         if (rect) {
  //           const x = touch.clientX - rect.left
  //           const y = touch.clientY - rect.top
  //           setMouseCoords({ x, y })
  //         }
  //       }
  //     }
  //   },
  //   [ref]
  // )

  const [mouseMode] = useState<"BOTH" | "LOCK" | "SPLIT">("BOTH")
  const wheelHandler = useCallback(
    (event: WheelEvent) => {
      event.preventDefault()
      setMouseLock(event.deltaX, event.deltaY)
      if (mouseMode === "SPLIT") {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          pan(event.deltaX)
        } else {
          zoom(event.deltaY, mouseCoords)
        }
      } else if (mouseMode === "BOTH") {
        pan(event.deltaX)
        zoom(event.deltaY, mouseCoords)
      } else if (mouseMode === "LOCK") {
        if (mouseLock === "PAN") {
          pan(event.deltaX)
        } else {
          zoom(event.deltaY, mouseCoords)
        }
      }
    },
    [mouseCoords, mouseLock, mouseMode, setMouseLock, pan, zoom]
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
    <MouseCoordsContext value={mouseCoords}>
      <svg
        className="touch-pan-y touch-none overscroll-x-none bg-blue-950"
        height={height}
        onMouseMove={mouseMoveHandler}
        // onTouchMove={touchMoveHandler}
        ref={ref}
        shapeRendering="crispEdges"
        width={width}
      >
        {children}
      </svg>
    </MouseCoordsContext>
  )
}
