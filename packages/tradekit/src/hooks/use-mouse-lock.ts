import { useRef, useState } from "react"

export default function useMouseLock(delay: number = 300) {
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
