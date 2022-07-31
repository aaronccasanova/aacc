// #########################
// Reserved properties types
// #########################

export type CommonReservedProps = {
  $description: string
}

export type CommonReservedTokenProps = CommonReservedProps & {
  $type: string
}

export type ReservedDesignTokensProps = CommonReservedProps & {
  // $value is an invalid reserved property at the top level
  $value: never
}

export type ReservedDesignTokenGroupProps = CommonReservedProps & {
  // $value is an invalid reserved property for token groups
  $value: never
}

export type ReservedDesignTokenBaseProps = CommonReservedTokenProps & {
  $value: string | number
}

export type ReservedDesignTokenAliasProps = CommonReservedTokenProps & {
  $value: string
}

export type ReservedDesignTokenCompositeProps = CommonReservedTokenProps & {
  // TODO: Add support for | JsonArray
  $value: JsonObject
}

// #################################
// Parse design tokens utility types
// #################################

/** Validates and infers the root design tokens object */
export type ParseDesignTokens<T> = ValidateObject<
  T,
  {
    [K in keyof T]: K extends `$${infer Prop}`
      ? ParseReservedProps<ReservedDesignTokensProps, Prop, T[K]>
      : ParseDesignTokenOrGroup<T[K]>
  }
>

export type ParseDesignTokenOrGroup<T> = ValidateObject<
  T,
  HasKey<T, '$value'> extends true
    ? ParseDesignToken<T>
    : ParseDesignTokenGroup<T>
>

export type ParseDesignTokenGroup<T> = ValidateObject<
  T,
  {
    [K in keyof T]: K extends `$${infer Prop}`
      ? ParseReservedProps<ReservedDesignTokenGroupProps, Prop, T[K]>
      : ParseDesignTokenOrGroup<T[K]>
  }
>

export type ParseDesignToken<T extends { [key: string]: any }> = ValidateObject<
  T,
  T['$value'] extends JsonObject
    ? ParseDesignTokenComposite<T>
    : T['$value'] extends `{${string}}`
    ? ParseDesignTokenAlias<T>
    : T['$value'] extends string | number
    ? ParseDesignTokenBase<T>
    : never
>

export type ParseDesignTokenBase<T> = ValidateObject<
  T,
  {
    [K in keyof T]: K extends `$${infer Prop}`
      ? '$value' extends `$${Prop}`
        ? ParseReservedValue<ReservedDesignTokenBaseProps, T[K]>
        : ParseReservedProps<ReservedDesignTokenBaseProps, Prop, T[K]>
      : never
  }
>

export type ParseDesignTokenAlias<T> = ValidateObject<
  T,
  {
    [K in keyof T]: K extends `$${infer Prop}`
      ? '$value' extends `$${Prop}`
        ? ParseReservedValue<ReservedDesignTokenAliasProps, T[K]>
        : ParseReservedProps<ReservedDesignTokenAliasProps, Prop, T[K]>
      : never
  }
>

// https://design-tokens.github.io/community-group/format/#composite-types
export type ParseDesignTokenComposite<T> = ValidateObject<
  T,
  {
    [K in keyof T]: K extends `$${infer Prop}`
      ? '$value' extends `$${Prop}`
        ? ParseReservedValue<ReservedDesignTokenCompositeProps, T[K]>
        : ParseReservedProps<ReservedDesignTokenCompositeProps, Prop, T[K]>
      : never
  }
>

// ##################################
// Extract design token utility types
// ##################################

// TODO: This is a bit buggy because it appears to be additionally matching alias tokens
export type ExtractDesignTokenBase<T, U = ExtractObjectDeep<T>> = Extract<
  U,
  ParseDesignTokenBase<U>
>

export type ExtractDesignTokenAlias<T, U = ExtractObjectDeep<T>> = Extract<
  U,
  ParseDesignTokenAlias<U>
>

export type ExtractDesignTokenComposite<T, U = ExtractObjectDeep<T>> = Extract<
  U,
  ParseDesignTokenComposite<U>
>

export type ExtractDesignTokenGroup<T, U = ExtractObjectDeep<T>> = Extract<
  U,
  ParseDesignTokenGroup<U>
>

export type ExtractDesignTokenValue<T, U = ExtractObjectDeep<T>> = U extends {
  $value: infer V
}
  ? V
  : never

// ###################
// Parse utility types
// ###################

type ParseReservedProps<
  R,
  Prop extends string,
  Else,
> = `$${Prop}` extends keyof R ? R[`$${Prop}`] : Else

type ParseReservedValue<
  R extends { $value: any },
  Value,
> = Value extends R['$value'] ? Value : never

type HasKey<T, U> = Extract<keyof T, U> extends never ? false : true

/**
 * Recursively extract objects JSON objects into a union
 */
type ExtractObjectDeep<T> = {
  [K in keyof T]: T[K] extends JsonObject
    ? T[K] | ExtractObjectDeep<T[K]>
    : never
}[keyof T]

// ########################
// Validation utility types
// ########################

/**
 * Ensures the input is valid JSON and keys are not using restricted characters:
 * https://design-tokens.github.io/community-group/format/#character-restrictions
 */
type ValidateObject<T, IfValid> = IsJsonObject<
  T,
  HasRestrictedCharInKey<T, IfValid>
>

type IsJsonObject<T, IfTrue> = T extends JsonObject
  ? IfTrue
  : 'ERROR: The token or group is not a valid JSON object'

type HasRestrictedCharInKey<T, Else> = HasKey<
  T,
  | RestrictedCharPermutations<'.'>
  | RestrictedCharPermutations<'{'>
  | RestrictedCharPermutations<'}'>
> extends true
  ? 'ERROR: The token or group name contains restricted characters: { (left curly brace), } (right curly brace), . (period)'
  : Else

type RestrictedCharPermutations<T extends string> =
  | T
  | `${string}${T}`
  | `${T}${string}`
  | `${string}${T}${string}`

// ##########################################
// The following is copy/paste from type-fest
// ##########################################

/**
Matches a JSON object.
This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.
@category JSON
*/
export type JsonObject = { [Key in PropertyKey]?: JsonValue }

/**
Matches a JSON array.
@category JSON
*/
type JsonArray = JsonValue[]

/**
Matches any valid JSON primitive value.
@category JSON
*/
type JsonPrimitive = string | number | boolean | null

/**
Matches any valid JSON value.
@see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.
@category JSON
*/
type JsonValue = JsonPrimitive | JsonObject | JsonArray
