import type { Exact, DesignTokens } from 'designtokens.io'

import { lightTheme } from './light'
import { darkTheme } from './dark'
import { dimTheme } from './dim'

export * from './light'
export * from './dark'
export * from './dim'

export const themes = createThemes({
  light: lightTheme,
  dark: darkTheme,
  dim: dimTheme,
})

export type Themes = typeof themes

export type ThemeKey = keyof Themes

export type ThemeKeys = ThemeKey[]

export const themeKeys = Object.keys(themes) as ThemeKeys

export function isThemeKey(key: unknown): key is ThemeKey {
  return themeKeys.includes(key as ThemeKey)
}

type CreateThemesValue = {
  [themeKey: string]: DesignTokens
}

function createThemes<T>(val: Exact<T, CreateThemesValue>) {
  return val as T
}
