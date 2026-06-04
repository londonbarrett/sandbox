import { use } from "react"
import { MouseCoordsContext } from "../providers/mouse-coords-provider"

export default function useMouseCoords() {
  const [coords, setCoords] = use(MouseCoordsContext)
  return { coords, setCoords }
}
