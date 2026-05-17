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
  useState,
} from "react"
import useChartDimensions from "./use-chart-dimensions"
import useChartDisplay from "./use-chart-display"

// TODO: Move to a separate file?
export const MouseCoordsContext = createContext<Coords>({
  candle: undefined,
  x: 0,
  y: 0,
})

export const MouseContext = createContext<{
  offsetX: number
  setOffsetX: (xOffset: number) => void
}>({ offsetX: 0, setOffsetX: () => {} })

/**
 * Chart panning and zooming logic:
 * - Panning: When the user drags the chart, we update the offsetX state to shift the chart left or right. The getCandleAt function uses this offset to determine which candle is under the cursor.
 * - Zooming: When the user scrolls, we adjust the zoom level (not implemented in this snippet) and potentially recalculate the offsetX to keep the zoom centered around the cursor position.
 * - Mouse Coordinates: The mouseMoveHandler calculates the cursor's position relative to the SVG and updates the mouseCoords state, which can be used by child components to display tooltips or crosshairs.
 * - Resize Handling: The useEffect with ResizeObserver ensures that the chart resizes correctly when the container size changes, maintaining responsiveness.
 * - Touch Support: The touchMoveHandler (commented out) is intended to handle touch events for mobile devices, allowing users to pan the chart with their fingers. It calculates the touch position similarly to mouse movements.
 * - Performance: The use of useCallback for event handlers helps to prevent unnecessary re-renders of child components that depend on these handlers, improving performance.
 * Overall, this component serves as the foundational SVG container for the chart, managing user interactions and providing context for child components to render the chart elements based on the current state of mouse coordinates and panning/zooming offsets.
 *
 *
 */

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
  const { offsetX, setOffsetX } = useChartDisplay()
  const [mouseCoords, setMouseCoords] = useState<Coords>({
    candle: undefined,
    x: 0,
    y: 0,
  })
  // const [offsetX, setOffsetX] = useState(0)
  const { getCandleAt, resizeChart } = useChartDimensions()

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

  const wheelHandler = useCallback(
    (event: WheelEvent) => {
      event.preventDefault()
      setOffsetX(event.deltaX)
      // let delta = zoom
      // if (event.deltaY < 0) {
      //   delta = 0.002
      // } else {
      //   delta = -0.002
      // }
      // if (zoom + delta > 0 && zoom + delta < 0.1) {
      //   setZoom((prev) => Number((prev + delta).toFixed(3)))
      // }
    },
    [setOffsetX]
  )

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
    [resizeChart]
  )

  useEffect(() => {
    const container = ref.current
    if (container) {
      container.addEventListener("wheel", wheelHandler, { passive: false })
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", wheelHandler)
      }
    }
  }, [wheelHandler])

  return (
    <MouseCoordsContext value={mouseCoords}>
      <MouseContext value={{ offsetX, setOffsetX }}>
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
      </MouseContext>
    </MouseCoordsContext>
  )
}
