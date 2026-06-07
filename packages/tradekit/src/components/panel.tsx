import { ReactNode } from "react"

export type PanelProps = {
  children: ReactNode
}

export default function Panel({ children }: PanelProps) {
  return <>{children}</>
}
