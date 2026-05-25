import { createContext, useReducer } from "react"
import {
  DisplayAction,
  displayReducer,
  DisplayState,
} from "./display-reducer"

const initialState = {
  maxDisplayCandles: 400,
  maxOffsetX: 0,
  minDisplayCandles: 20,
  minOffsetX: 0,
  offsetX: 0,
  displayCandles: 10,
}

export const DisplayContext = createContext<{
  state: DisplayState
  dispatch: React.Dispatch<DisplayAction>
}>({ state: initialState, dispatch: () => {} })

export default function DisplayProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(displayReducer, initialState)
  return (
    <DisplayContext.Provider value={{ state, dispatch }}>
      {children}
    </DisplayContext.Provider>
  )
}
