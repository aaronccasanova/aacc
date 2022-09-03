export type UnCategorized = typeof unCategorized

export const unCategorized = [
  // TODO: Investigate -epub- prefixed properties
  // https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side
  '-epub-caption-side',
  '-epub-hyphens',
  '-epub-text-combine',
  '-epub-text-emphasis-color',
  '-epub-text-emphasis-style',
  '-epub-text-emphasis',
  '-epub-text-orientation',
  '-epub-text-transform',
  '-epub-word-break',
  '-epub-writing-mode',
  '-internal-text-autosizing-status',
  'epub-caption-side',
  'epub-hyphens',
  'epub-text-combine',
  'epub-text-emphasis-color',
  'epub-text-emphasis-style',
  'epub-text-emphasis',
  'epub-text-orientation',
  'epub-text-transform',
  'epub-word-break',
  'epub-writing-mode',
] as const
