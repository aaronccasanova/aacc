/**
 * TODO: Remove this experimental utility.
 * const theme = constrainedIdentity<Theme>()({
 *   inferred: 'properties'
 * })
 *
 * const groups = constrainedIdentity<Groups>()({...})
 */
export const constrainedIdentity =
  <T>() =>
  <U extends T>(value: U) =>
    value
