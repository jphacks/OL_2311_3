"use client"

import { SWRConfig } from "swr"

export type ProvidersProps = {
  children: React.ReactNode
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <SWRConfig>{children}</SWRConfig>
}

export default Providers
