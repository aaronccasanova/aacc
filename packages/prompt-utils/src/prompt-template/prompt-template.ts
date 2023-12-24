import type { IsStringLiteral } from 'type-fest'

export type InputVariableName = string

type InputVariableNameError =
  'Error: `InputVariableName` must be a string literal type'

export interface InputVariableConfig {
  name: InputVariableName
  default?: string
  schema?: { parse: (inputValue: string) => string }
  onFormat?: (inputValue: string) => string
}

export type InputVariable =
  | InputVariableName
  | InputVariableConfig
  | PromptTemplateResult<InputVariable[]>

type ExtractInputVariableName<T extends InputVariable[]> =
  T[number] extends infer I
    ? I extends InputVariableName
      ? IfStringLiteral<I, I, never>
      : I extends { name: infer N }
      ? IfStringLiteral<N, N, never>
      : I extends PromptTemplateResult<infer U>
      ? ExtractInputVariableName<U>
      : never
    : never

type ExtractInputVariableNameWithDefault<T extends InputVariable[]> =
  T[number] extends infer I
    ? I extends { name: infer N; default: string }
      ? IfStringLiteral<N, N, never>
      : I extends PromptTemplateResult<infer U>
      ? ExtractInputVariableNameWithDefault<U>
      : never
    : never

type PromptTemplateFormatInputValues<
  Name extends InputVariableName,
  NameWithDefault extends InputVariableName,
> = Prettify<
  {
    [N in Name as N extends NameWithDefault ? never : N]: string
  } & {
    [N in Name as N extends NameWithDefault ? N : never]?: string
  }
>

export type PromptTemplateFormat<
  T extends InputVariable[],
  Name extends InputVariableName = ExtractInputVariableName<T>,
  NameWithDefault extends InputVariableName = ExtractInputVariableNameWithDefault<T>,
> = (
  inputValues: [Name] extends [never]
    ? void
    : PromptTemplateFormatInputValues<Name, NameWithDefault>,
) => string

export type PromptTemplateResult<T extends InputVariable[]> = {
  templateStrings: TemplateStringsArray
  inputVariables: T
  format: PromptTemplateFormat<T>
}

/**
 * Validates input variable names are a string literal type.
 *
 * Note: We only need to handle `InputVariableName` and `InputVariableConfig` types
 * as nested `PromptTemplateResult` types should already be validated.
 */
type ValidateInputVariables<T extends InputVariable[]> = {
  [Index in keyof T]: T[Index] extends InputVariableName
    ? IfStringLiteral<T[Index], T[Index], InputVariableNameError>
    : T[Index] extends { name: infer N }
    ? IfStringLiteral<N, T[Index], T[Index] & { name: InputVariableNameError }>
    : T[Index]
}

export function promptTemplate<T extends InputVariable[]>(
  templateStrings: TemplateStringsArray,
  ...inputVariables: ValidateInputVariables<T>
): PromptTemplateResult<T> {
  const format: PromptTemplateFormat<T> = (inputValues_) => {
    const inputValues: { [inputVariableName: string]: string } =
      inputValues_ ?? {}

    const formatted = interleave(
      templateStrings,
      inputVariables,
      (inputVariableConfig) => {
        let inputValue =
          inputValues[inputVariableConfig.name] ??
          inputVariableConfig.default ??
          ''

        if (inputVariableConfig?.schema) {
          inputValue = inputVariableConfig.schema.parse(inputValue)
        }

        if (inputVariableConfig?.onFormat) {
          inputValue = inputVariableConfig.onFormat(inputValue)
        }

        return inputValue
      },
    )

    return formatted
  }

  return {
    templateStrings,
    inputVariables: inputVariables as T,
    format,
  }
}

function interleave(
  templateStrings: TemplateStringsArray,
  inputVariables: InputVariable[],
  cb: (inputVariableConfig: InputVariableConfig) => string,
): string {
  let result = ''

  for (let i = 0; i < templateStrings.length; i += 1) {
    result += templateStrings[i]

    if (i < inputVariables.length) {
      const inputVariable = inputVariables[i]!

      if (typeof inputVariable === 'string') {
        result += cb({ name: inputVariable })
        //
      } else if ('name' in inputVariable) {
        result += cb(inputVariable)
        //
      } else {
        result += interleave(
          inputVariable.templateStrings,
          inputVariable.inputVariables,
          cb,
        )
      }
    }
  }

  return result
}

type IfStringLiteral<T, Then, Else> = IsStringLiteral<T> extends true
  ? Then
  : Else

// https://www.totaltypescript.com/concepts/the-prettify-helper
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
