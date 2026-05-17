import { createContext, useReducer } from "react"
import { displayReducer } from "./display-reducer"

const initialState = {
  offsetX: 0,
  zoom: 1,
}

export const DisplayContext = createContext<{
  state: typeof initialState
  dispatch: React.Dispatch<any>
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
