import { layout } from './groups/layout'

export const groupedCSSProperties = {
  layout,
} as const

export type GroupedCSSProperties = typeof groupedCSSProperties
