import React from 'react'

import { RootThemeProvider } from './RootThemeProvider'
import { MuiThemeProvider } from './MuiThemeProvider'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers(props: ProvidersProps) {
  return (
    <RootThemeProvider>
      <MuiThemeProvider>{props.children}</MuiThemeProvider>
    </RootThemeProvider>
  )
}
