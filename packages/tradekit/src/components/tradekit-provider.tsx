"use client"

import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from "react"
import {
  DataAction,
  dataReducer,
  DataState,
  setData,
} from "../reducers/data-reducer"
import { Candle } from "../types"
import Panel from "./panel"

const initialState: DataState = {
  data: [],
  maxValue: 0,
  minValue: 0,
}

export const TradekitContext = createContext<{
  state: DataState
  dispatch: Dispatch<DataAction>
}>({ state: initialState, dispatch: () => {} })

export type TradekitProviderProps = {
  children: ReactNode
  data: Candle[]
}

export function TradekitProvider({
  children,
  data,
}: TradekitProviderProps) {
  const [state, dispatch] = useReducer(dataReducer, initialState)

  useEffect(
    function initEffect() {
      dispatch(setData(data))
    },
    [data]
  )

  return (
    <TradekitContext value={{ state, dispatch }}>
      <Panel>{children}</Panel>
    </TradekitContext>
  )
}
