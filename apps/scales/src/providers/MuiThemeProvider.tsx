import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import type { ThemeKey } from '@aacc/design-tokens'
import { useRootTheme } from './RootThemeProvider'

/**
 * Extended theme example
 */
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string
    }
  }
}

const muiColorModeMap: { [T in ThemeKey]: 'light' | 'dark' } = {
  light: 'light',
  dark: 'dark',
  dim: 'dark',
}

export interface MuiThemeProviderProps {
  children: React.ReactNode
}

export function MuiThemeProvider(props: MuiThemeProviderProps) {
  const { themeKey } = useRootTheme()

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: muiColorModeMap[themeKey],
        },
        status: {
          danger: 'red',
        },
        components: {
          MuiButtonBase: {
            defaultProps: {
              disableRipple: true,
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                transition: 'none !important',
              },
            },
          },
        },
      }),
    [themeKey],
  )

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}
