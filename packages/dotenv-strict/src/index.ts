import {
  config as dotenvConfig,
  DotenvConfigOptions,
  DotenvConfigOutput,
  DotenvParseOutput,
} from 'dotenv'

type AnyEnvironmentVariable = string & {}
type StrictEnvironmentVariables = ReadonlyArray<string>

type DotenvStrictConfigOptions<T extends StrictEnvironmentVariables> =
  DotenvConfigOptions & {
    strict?: T
  }

type DotenvStrictParseOutput<T extends StrictEnvironmentVariables> = {
  [EnvironmentVariable in T[number]]: string
} & {
  [EnvironmentVariable in AnyEnvironmentVariable]: string | undefined
}

type DotenvStrictConfigOutput<T extends StrictEnvironmentVariables> = Omit<
  DotenvConfigOutput,
  'parsed'
> &
  T extends StrictEnvironmentVariables
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
export function config<T extends StrictEnvironmentVariable>(
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
