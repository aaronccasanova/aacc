import type {
  DesignTokens,
  DesignToken,
  DesignTokenAlias,
  DesignTokenGroup,
  Exact,
} from '../types'

export function createDesignTokens<T>(tokens: Exact<T, DesignTokens>) {
  return tokens as T
}

export function createDesignToken<T>(token: Exact<T, DesignToken>) {
  return token as T
}

export function createDesignTokenAlias<T>(alias: Exact<T, DesignTokenAlias>) {
  return alias as T
}

export function createDesignTokenGroup<T>(group: Exact<T, DesignTokenGroup>) {
  return group as T
}
