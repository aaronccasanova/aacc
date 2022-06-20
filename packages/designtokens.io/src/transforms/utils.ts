export interface CreatorOptions {
  prefix?: string
  delimiter?: string
}

/**
 * Creates a CSS custom property name from an array of names leading to a design token.
 *
 * @example
 * createCSSVar(['colors', 'blue', '500'], {prefix: 'dt'}) // '--dt-colors-blue-500'
 */
export function createCSSVar(path: string[], options: CreatorOptions = {}) {
  const { prefix = '', delimiter = '-' } = options

  return `--${[...(prefix ? [prefix] : []), ...path].join(delimiter)}`
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
  return (path: string[]) => createCSSVar(path, options)
}

/**
 * Creates a SCSS variable name from an array of names leading to a design token.
 *
 * @example
 * createSCSSVar(['colors', 'blue', '500'], {prefix: 'dt'}) // '$dt-colors-blue-500'
 */
export function createSCSSVar(path: string[], options: CreatorOptions = {}) {
  const { prefix = '', delimiter = '-' } = options

  return `$${[...(prefix ? [prefix] : []), ...path].join(delimiter)}`
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
  return (path: string[]) => createSCSSVar(path, options)
}
