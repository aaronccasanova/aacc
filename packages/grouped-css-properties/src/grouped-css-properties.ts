import { color } from './groups/color'
import { layout } from './groups/layout'
import { motion } from './groups/motion'
import { shape } from './groups/shape'
import { spacing } from './groups/spacing'
import { typography } from './groups/typography'

export const groupedCSSProperties = {
  color,
  layout,
  motion,
  shape,
  spacing,
  typography,
} as const

export type GroupedCSSProperties = typeof groupedCSSProperties
