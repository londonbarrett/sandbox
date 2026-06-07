"use client"

import { createContext, useReducer } from "react"
import {
  DisplayAction,
  displayReducer,
  DisplayState,
  initialState,
} from "../reducers/display-reducer"

export const DisplayContext = createContext<{
  state: DisplayState
  dispatch: React.Dispatch<DisplayAction>
}>({ state: initialState, dispatch: () => {} })

export type DisplayProviderProps = {
  children: React.ReactNode
}

export default function DisplayProvider({
  children,
}: DisplayProviderProps) {
  const [state, dispatch] = useReducer(displayReducer, initialState)
  return (
    <DisplayContext.Provider value={{ state, dispatch }}>
      {children}
    </DisplayContext.Provider>
  )
}
