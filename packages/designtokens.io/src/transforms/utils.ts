export interface CreatorOptions {
  prefix?: string
  delimiter?: string
}

/**
 * Creates a CSS custom property name from an array of design token segments.
 *
 * @example
 * createCSSVar(['colors', 'blue', '500'], {prefix: 'dt'}) // '--dt-colors-blue-500'
 */
export function createCSSVar(segments: string[], options: CreatorOptions = {}) {
  const { prefix = '', delimiter = '-' } = options

  return `--${[...(prefix ? [prefix] : []), ...segments].join(delimiter)}`
}

/**
 * Higher order function to create prefixed CSS custom properties.
 *
 * @example
 * const createCSSVar = cssVarCreator({prefix: 'dt', delimiter: '_'})
 * createCSSVar(['colors', 'blue', '500']) // '--dt_colors_blue_500'
 * createCSSVar(['colors', 'red', '500']) // '--dt_colors_red_500'
 */
export function cssVarCreator(options?: CreatorOptions) {
  return (segments: string[]) => createCSSVar(segments, options)
}

/**
 * Creates a SCSS variable name from an array of design token segments.
 *
 * @example
 * createSCSSVar(['colors', 'blue', '500'], {prefix: 'dt'}) // '$dt-colors-blue-500'
 */
export function createSCSSVar(
  segments: string[],
  options: CreatorOptions = {},
) {
  const { prefix = '', delimiter = '-' } = options

  return `$${[...(prefix ? [prefix] : []), ...segments].join(delimiter)}`
}

/**
 * Higher order function to create prefixed SCSS variables.
 *
 * @example
 * const createSCSSVar = scssVarCreator({prefix: 'dt', delimiter: '_'})
 * createSCSSVar(['colors', 'blue', '500']) // '$dt_colors_blue_500'
 * createSCSSVar(['colors', 'red', '500']) // '$dt_colors_red_500'
 */
export function scssVarCreator(options?: CreatorOptions) {
  return (segments: string[]) => createSCSSVar(segments, options)
}
