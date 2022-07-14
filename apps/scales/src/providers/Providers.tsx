import React from 'react'

import { RootThemeProvider } from './RootThemeProvider'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers(props: ProvidersProps) {
  return <RootThemeProvider>{props.children}</RootThemeProvider>
}
