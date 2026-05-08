"use client"

import { createContext, Dispatch, ReactNode, useEffect, useReducer } from "react"
import {
  DataAction,
  dataReducer,
  DataState,
  setData
} from "./data-reducer"
import { Candle } from "@/types"

const initialState = {
  data: [],
  maxValue: 0,
  minValue: 0,
}

export const DataContext = createContext<{
  state: DataState
  dispatch: Dispatch<DataAction>
}>({ state: initialState, dispatch: () => {} })

export type DataProviderProps = {
  children: ReactNode
  data: Candle[]
}

export default function DataProvider({ children, data }: DataProviderProps) {
  const [state, dispatch] = useReducer(dataReducer, initialState)

  useEffect(
    function initEffect() {
      dispatch(setData(data))
    },
    [data]
  )

  return (
    <DataContext value={{ state, dispatch }}>{children}</DataContext>
  )
}
