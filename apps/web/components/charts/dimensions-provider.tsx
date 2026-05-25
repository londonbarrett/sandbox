"use client"

import { createContext, RefObject, useReducer } from "react"
import {
  DimensionsAction,
  dimensionsReducer,
  DimensionsState,
} from "./dimensions-reducer"

const initialState: DimensionsState = {
  candleWidth: 0,
  columnWidth: 0,
  graphWidth: 0,
  height: 0,
  valueAxisWidth: 60,
  viewportWidth: 0,
  width: 0,
}

export const DimensionsContext = createContext<{
  ref: RefObject<SVGSVGElement | null>
  state: DimensionsState
  dispatch: React.Dispatch<DimensionsAction>
}>({ ref: { current: null }, state: initialState, dispatch: () => {} })

export type DimensionsProviderProps = {
  children: React.ReactNode
  ref: RefObject<SVGSVGElement | null>
}

export default function DimensionsProvider({
  children,
  ref,
}: DimensionsProviderProps) {
  const [state, dispatch] = useReducer(dimensionsReducer, initialState)
  return (
    <DimensionsContext value={{ ref, state, dispatch }}>
      {children}
    </DimensionsContext>
  )
}
