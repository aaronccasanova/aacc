import {
  config as dotenvConfig,
  DotenvConfigOptions,
  DotenvConfigOutput,
  DotenvParseOutput,
} from 'dotenv'

type DotenvStrictConfigOptions<T extends ReadonlyArray<string>> =
  DotenvConfigOptions & {
    strict?: T
  }

type DotenvStrictParseOutput<T extends ReadonlyArray<string>> = {
  [K in T[number] | (string & {})]: string
}

type DotenvStrictConfigOutput<T extends ReadonlyArray<string>> = Omit<
  DotenvConfigOutput,
  'parsed'
> &
  T extends ReadonlyArray<string>
  ? { parsed: DotenvStrictParseOutput<T> }
  : { parsed?: DotenvParseOutput }

/**
 * Loads and validates environment variables.
 *
 * @param options - `dotenv` configuration options including a `strict` property.
 * @throws If any of the required variables are not found.
 *
 * @example
 * ```ts
 * const env = config({strict: ['FOO', 'BAR'] as const})
 *
 * env.parsed //=> {FOO: 'foo', BAR: 'bar'}
 * ```
 */
export function config<T extends ReadonlyArray<string>>(
  options?: DotenvStrictConfigOptions<T>,
): DotenvStrictConfigOutput<T> {
  const { strict, ...restOptions } = options ?? {}

  const output = dotenvConfig(restOptions)

  if (strict) {
    const missingVariables = strict.filter(
      (variable) => typeof process.env[variable] === 'undefined',
    )

    if (missingVariables.length > 0) {
      throw new Error(
        [
          'Missing required environment variables: ',
          missingVariables.join(', '),
        ].join(''),
      )
    }
  }

  return output as DotenvStrictConfigOutput<T>
}
