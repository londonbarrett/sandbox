import {
  MouseEvent,
  ReactNode,
  RefObject,
  TouchEvent,
  useCallback,
  useEffect,
} from "react"
import useChartDisplay from "./use-chart-display"

export type SVGProps = {
  children: ReactNode
  ref: RefObject<SVGSVGElement | null>
}

export default function SVG({ children, ref }: SVGProps) {
  const { resizeChart, setMouseCoords } = useChartDisplay()

  const mouseMoveHandler = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      setMouseCoords(event.clientX, event.clientY)
    },
    [setMouseCoords]
  )

  const touchMoveHandler = useCallback(
    (event: TouchEvent<SVGSVGElement>) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        if (touch) {
          setMouseCoords(touch.clientX, touch.clientY)
        }
      }
    },
    [setMouseCoords]
  )

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

  useEffect(function resizeEffect() {
    const container = ref.current
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height || 0
      const width = entries[0]?.contentRect.width || 0
      resizeChart({height, width})
    })

    if (container) {
      observer.observe(container)
    }

    return () => {
      if (container) {
        observer.unobserve(container)
      }
    }
  }, [ref, resizeChart])

  return (
    <svg
      className="bg-blue-950 h-full w-full touch-none"
      height="100%"
      onMouseMove={mouseMoveHandler}
      onTouchMove={touchMoveHandler}
      // onWheel={wheelHandler}
      ref={ref}
      width="100%"
    >
      {children}
    </svg>
  )
}
