import { useContext } from "react"
import { DisplayContext } from "./display-provider"

export default function useChartDisplay() {
  const { state, dispatch } = useContext(DisplayContext)

  const setOffsetX = (deltaX: number) => {
    console.log("HOOK SET OFFSET X", deltaX)
    dispatch({ type: "SET_OFFSET_X", payload: deltaX })
  }

  const setZoom = (zoom: number) => {
    dispatch({ type: "SET_ZOOM", payload: zoom })
  }

  return {
    ...state,
    setOffsetX,
    setZoom,
  }
}
