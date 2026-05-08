"use client"

import { Coords } from "@/types"
import {
  createContext,
  MouseEvent,
  ReactNode,
  RefObject,
  TouchEvent,
  useCallback,
  useEffect,
  useState,
} from "react"
import useChartDisplay from "./use-chart-display"

export const MouseCoordsContext = createContext<Coords>({ x: 0, y: 0 })

export type SVGProps = {
  children: ReactNode
  height?: number | string
  ref: RefObject<SVGSVGElement | null>
  width?: number | string
}

export default function SVG({
  children,
  height = "100%",
  ref,
  width = "100%",
}: SVGProps) {
  const [mouseCoords, setMouseCoords] = useState<Coords>({ x: 0, y: 0 })
  const { resizeChart } = useChartDisplay()

  const mouseMoveHandler = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) {
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        setMouseCoords({ x, y })
      }
    },
    [ref]
  )

  const touchMoveHandler = useCallback((event: TouchEvent<SVGSVGElement>) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      if (touch) {
        const rect = ref.current?.getBoundingClientRect()
        if (rect) {
          const x = touch.clientX - rect.left
          const y = touch.clientY - rect.top
          setMouseCoords({ x, y })
        }
      }
    }
  }, [ref])

  // const wheelHandler = useCallback(
  //   (event: WheelEvent<SVGSVGElement>) => {
  //     let delta = zoom
  //     if (event.deltaY < 0) {
  //       delta = 0.002
  //     } else {
  //       delta = -0.002
  //     }
  //     if (zoom + delta > 0 && zoom + delta < 0.1) {
  //       setZoom((prev) => Number((prev + delta).toFixed(3)))
  //     }
  //   },
  //   [setZoom, zoom]
  // )

  useEffect(
    function resizeEffect() {
      const container = ref.current
      const observer = new ResizeObserver((entries) => {
        const height = entries[0]?.contentRect.height || 0
        const width = entries[0]?.contentRect.width || 0
        resizeChart({ height, width })
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
    [ref, resizeChart]
  )

  return (
    <MouseCoordsContext value={mouseCoords}>
      <svg
        className="touch-none bg-blue-950"
        height={height}
        onMouseMove={mouseMoveHandler}
        onTouchMove={touchMoveHandler}
        // onWheel={wheelHandler}
        ref={ref}
        width={width}
      >
        {children}
      </svg>
    </MouseCoordsContext>
  )
}
