/**
 * Type representing both a Design Token and Design Token Alias Properties.
 *
 * Design Token: https://design-tokens.github.io/community-group/format/#design-token
 * Design Token Alias: https://design-tokens.github.io/community-group/format/#alias-reference
 */
export interface DesignTokenProperties {
  $type?: string
  $description?: string
  $metadata?: unknown
  $extensions?: unknown
}

export interface DesignToken extends DesignTokenProperties {
  $value: string | number
}

export interface DesignTokenAlias extends DesignTokenProperties {
  $value: string
}

/**
 * Design Token Group: https://design-tokens.github.io/community-group/format/#groups-0
 */
export interface DesignTokenGroup {
  $description?: string
  // This discriminate `$tokens` property allows TypeScript to statically validate
  // whether or not the current token is a DesignToken or DesignTokenGroup.
  // Note: This is the only place we deviate from the Design Tokens Format Module.
  $tokens: {
    [tokenOrGroupName: string]:
      | DesignToken
      | DesignTokenAlias
      | DesignTokenGroup
  }
}

export type AllDesignTokens = DesignToken | DesignTokenAlias | DesignTokenGroup

/** Root Design Tokens Type */
export type DesignTokens = {
  [tokenOrGroupName: string]: AllDesignTokens
}

// The following utility types are copied directly from `ts-toolbelt`:
// https://millsp.github.io/ts-toolbelt/modules/function_exact.html

type Narrowable = string | number | bigint | boolean

export type Exact<A, W> = W extends unknown
  ? A extends W
    ? A extends Narrowable
      ? A
      : {
          [K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never
        }
    : W
  : never
