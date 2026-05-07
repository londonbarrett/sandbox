import { createContext, RefObject, useReducer } from "react"
import { DisplayAction, DisplayState, displayReducer } from "./display-reducer"

const initialState: DisplayState = {
  candleWidth: 0,
  columnWidth: 0,
  height: 0,
  width: 0,
  coords: { x: 0, y: 0 },
  zoom: 1
}

export const DisplayContext = createContext<{
  ref: RefObject<SVGSVGElement | null>,
  state: DisplayState,
  dispatch: React.Dispatch<DisplayAction>
}>({ ref: { current: null }, state: initialState, dispatch: () => {} })

export type DisplayProviderProps = {
  children: React.ReactNode
  ref: RefObject<SVGSVGElement | null>
}

export default function DisplayProvider({
  children,
  ref,
}: DisplayProviderProps) {
  const [state, dispatch] = useReducer(displayReducer, initialState)
  return (
    <DisplayContext value={{ ref, state, dispatch }}>
      {children}
    </DisplayContext>
  )
}