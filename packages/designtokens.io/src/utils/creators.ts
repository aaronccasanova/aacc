import type {
  ParseDesignTokens,
  ParseDesignToken,
  ParseDesignTokenBase,
  ParseDesignTokenAlias,
  ParseDesignTokenComposite,
  ParseDesignTokenGroup,
} from '../types'

export function createDesignTokens<T>(tokens: ParseDesignTokens<T>) {
  return tokens as T
}

export function createDesignToken<T>(token: ParseDesignToken<T>) {
  return token as T
}

export function createDesignTokenBase<T>(token: ParseDesignTokenBase<T>) {
  return token as T
}

export function createDesignTokenAlias<T>(token: ParseDesignTokenAlias<T>) {
  return token as T
}

export function createDesignTokenComposite<T>(
  token: ParseDesignTokenComposite<T>,
) {
  return token as T
}

export function createDesignTokenGroup<T>(token: ParseDesignTokenGroup<T>) {
  return token as T
}

// type Widen<T> = T extends string ? string : T extends number ? number : T

type MergeTypes<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K]
      : T[K]
    : K extends keyof U
    ? K extends keyof T
      ? U[K] | T[K]
      : U[K]
    : never
}

type Fixture1 = {
  // $a: 'hi'
  $a: string
  $c: null
}

type Fixture2 = {
  $a: number
  $b: string
}

type Fixture3 = {
  $a: 'by'
}

export type Test = MergeTypes<Fixture1, Fixture2>
export type Tester = MergeTypes<Test, Fixture3>

export type ExtractDesignTokenBase<
  Union,
  Stop = false,
  Collection = {},
> = Stop extends true
  ? Collection
  : (
      Union extends unknown ? (distributedUnion: Union) => void : never
    ) extends (mergedIntersection: infer Obj) => void
  ? ExtractDesignTokenBase<Union, MergeTypes<Collection, Obj>>
  : never

export type Test2 = ExtractDesignTokenBase<Fixture1 | Fixture2>
