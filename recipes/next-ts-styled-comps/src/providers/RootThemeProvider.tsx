import React from 'react'
import { ThemeKey, ThemeKeys, isThemeKey, themeKeys } from '@aacc/design-tokens'

import { isServer } from '../utils'
import {
  defaultThemeKey,
  localStorageThemeKey,
  rootThemeClass,
} from '../themes'

export interface RootThemeContextValue {
  themeKey: ThemeKey
  themeKeys: ThemeKeys
  setThemeKey: (theme: ThemeKey) => void
}

export const RootThemeContext = React.createContext<RootThemeContextValue>({
  themeKey: defaultThemeKey,
  themeKeys,
  setThemeKey: () => {},
})

export function useRootTheme() {
  const context = React.useContext(RootThemeContext)

  if (context === undefined) {
    throw new Error('useRootTheme must be used within a RootThemeProvider')
  }

  return context
}

export interface RootThemeProviderProps {
  children: React.ReactNode
}

export function RootThemeProvider(props: RootThemeProviderProps) {
  const [themeKey, setThemeKey] = React.useState<ThemeKey>(() => {
    if (isServer()) return defaultThemeKey

    const root = window.document.documentElement
    const initialTheme = root.dataset.initialTheme

    return isThemeKey(initialTheme) ? initialTheme : defaultThemeKey
  })

  const handleSetThemeKey = React.useCallback(
    (newThemeKey: ThemeKey) => {
      if (!isThemeKey(newThemeKey)) return

      const root = window.document.documentElement

      root.classList.replace(
        `${rootThemeClass}-${themeKey}`,
        `${rootThemeClass}-${newThemeKey}`,
      )

      setThemeKey(newThemeKey)

      localStorage.setItem(localStorageThemeKey, newThemeKey)
    },
    [themeKey],
  )

  const contextValue = React.useMemo(
    () => ({
      themeKey,
      themeKeys,
      setThemeKey: handleSetThemeKey,
    }),
    [themeKey, handleSetThemeKey],
  )

  return (
    <RootThemeContext.Provider value={contextValue}>
      {props.children}
    </RootThemeContext.Provider>
  )
}
