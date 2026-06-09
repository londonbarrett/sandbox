import { RefObject, use } from "react"
import { CoordsContext } from "../components/panel"
import { ChartCoords } from "../types"

export const useCoords = () => {
  const { state, dispatch } = use(CoordsContext)

  const setCoords = (
    coords: ChartCoords,
    activeChart: RefObject<SVGSVGElement | null>
  ) => {
    dispatch({
      type: "SET_COORDS",
      payload: {
        coords,
        activeChart,
      },
    })
  }

  return { ...state, setCoords }
}
