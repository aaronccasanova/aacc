export type Layout = typeof layout

export const layout = [
  // TODO: Investigate -epub- prefixed properties
  // https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side
  '-epub-caption-side',
  'align-items',
  'align-self',
  'display',
  'flex-basis',
  'flex-direction',
  'flex-grow',
  'flex-shrink',
  'flex-wrap',
  'flex',
  'grid-area',
  'grid-auto-columns',
  'grid-auto-rows',
  'grid-column-end',
  'grid-column-start',
  'grid-column',
  'grid-row-end',
  'grid-row-start',
  'grid-row',
  'grid-template-areas',
  'grid-template-columns',
  'grid-template-rows',
  'grid-template',
  'grid',
] as const
