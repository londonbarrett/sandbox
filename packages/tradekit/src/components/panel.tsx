import { createContext, ReactNode, useReducer } from "react"
import {
  CoordsAction,
  initialState as coordsInitialState,
  coordsReducer,
  CoordsState,
} from "../reducers/coords-reducer"
import {
  PanelAction,
  initialState as panelInitialState,
  panelReducer,
  PanelState,
} from "../reducers/panel-reducer"

export type PanelProps = {
  children: ReactNode
}

export const CoordsContext = createContext<{
  state: CoordsState
  dispatch: React.Dispatch<CoordsAction>
}>({ state: coordsInitialState, dispatch: () => {} })

export const PanelContext = createContext<{
  state: PanelState
  dispatch: React.Dispatch<PanelAction>
}>({ state: panelInitialState, dispatch: () => {} })

export default function Panel({ children }: PanelProps) {
  const [panelState, panelDispatch] = useReducer(
    panelReducer,
    panelInitialState
  )
  const [coordsState, coordsDispatch] = useReducer(
    coordsReducer,
    coordsInitialState
  )
  return (
    <PanelContext
      value={{ state: panelState, dispatch: panelDispatch }}
    >
      <CoordsContext
        value={{ state: coordsState, dispatch: coordsDispatch }}
      >
        {children}
      </CoordsContext>
    </PanelContext>
  )
}
