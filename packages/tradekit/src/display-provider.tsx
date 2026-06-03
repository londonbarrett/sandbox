"use client"

import { createContext, RefObject, useReducer } from "react"
import {
  DisplayAction,
  displayReducer,
  DisplayState,
} from "./reducers/display-reducer"

const initialState: DisplayState = {
  candleFactor: 0.8,
  candleWidth: 0,
  columnWidth: 0,
  displayCandles: 100,
  dataLength: 0,
  graphWidth: 0,
  height: 0,
  maxDisplayCandles: 400,
  minDisplayCandles: 50,
  maxOffsetX: 0,
  minOffsetX: 0,
  offsetX: 0,
  valueAxisWidth: 60,
  viewportWidth: 0,
  width: 0,
}

export const DisplayContext = createContext<{
  ref: RefObject<SVGSVGElement | null>
  state: DisplayState
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
    <DisplayContext.Provider value={{ ref, state, dispatch }}>
      {children}
    </DisplayContext.Provider>
  )
}
