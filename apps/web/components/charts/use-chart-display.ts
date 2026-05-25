import { useCallback, use } from "react"
import { DisplayContext } from "./display-provider"
import { DimensionsContext } from "./dimensions-provider"

export default function useChartDisplay() {
  const { state, dispatch } = use(DisplayContext)
  const { state: dimensions } = use(DimensionsContext)

  const gauge = useCallback(
    () => dispatch({ type: "GAUGE", payload: dimensions }),
    [dimensions, dispatch]
  )

  const pan = useCallback(
    (deltaX: number) =>
      dispatch({
        type: "PAN",
        payload: deltaX,
      }),
    [dispatch]
  )

  const zoom = useCallback(
    // TODO: When zooming, graph position should be locked at the position before zooming
    (zoom: number) => {
      dispatch({ type: "ZOOM", payload: zoom })
    },
    [dispatch]
  )
  return {
    ...state,
    gauge,
    pan,
    zoom,
  }
}
