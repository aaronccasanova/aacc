import type { IsStringLiteral } from 'type-fest'
import dedent from 'dedent'

export type PromptTemplateInputVariableName = string

type PromptTemplateInputVariableNameError =
  'Error: `PromptTemplateInputVariableName` must be a string literal type'

export interface PromptTemplateInputVariableConfig {
  name: PromptTemplateInputVariableName
  default?: string
  schema?: { parse: (inputValue: string) => string }
  onFormat?: (inputValue: string) => string
}

export type PromptTemplateInputVariable =
  | PromptTemplateInputVariableName
  | PromptTemplateInputVariableConfig
  | PromptTemplateResult<PromptTemplateInputVariable[]>

type ExtractInputVariableName<
  InputVariables extends PromptTemplateInputVariable[],
> = InputVariables[number] extends infer InputVariable
  ? InputVariable extends PromptTemplateInputVariableName
    ? IfStringLiteral<InputVariable, InputVariable, never>
    : InputVariable extends { name: infer InputVariableName }
    ? IfStringLiteral<InputVariableName, InputVariableName, never>
    : InputVariable extends PromptTemplateResult<infer InnerInputVariables>
    ? ExtractInputVariableName<InnerInputVariables>
    : never
  : never

type ExtractInputVariableNameWithDefault<
  InputVariables extends PromptTemplateInputVariable[],
> = InputVariables[number] extends infer InputVariable
  ? InputVariable extends { name: infer InputVariableName; default: string }
    ? IfStringLiteral<InputVariableName, InputVariableName, never>
    : InputVariable extends PromptTemplateResult<infer InnerInputVariables>
    ? ExtractInputVariableNameWithDefault<InnerInputVariables>
    : never
  : never

type FormatInputValues<
  InputVariableName extends PromptTemplateInputVariableName,
  InputVarNameWithDefault extends PromptTemplateInputVariableName,
> = Prettify<
  {
    [N in Exclude<InputVariableName, InputVarNameWithDefault>]: string
  } & {
    [N in InputVarNameWithDefault]?: string
  }
>

export type PromptTemplateFormat<
  InputVariables extends PromptTemplateInputVariable[],
  InputVariableName extends PromptTemplateInputVariableName = ExtractInputVariableName<InputVariables>,
  InputVarNameWithDefault extends PromptTemplateInputVariableName = ExtractInputVariableNameWithDefault<InputVariables>,
> = (
  inputValues: [InputVariableName] extends [never]
    ? void
    : FormatInputValues<InputVariableName, InputVarNameWithDefault>,
) => string

export type PromptTemplateResult<
  InputVariables extends PromptTemplateInputVariable[],
> = {
  templateStrings: TemplateStringsArray
  inputVariables: InputVariables
  format: PromptTemplateFormat<InputVariables>
}

/**
 * Validates input variable names are a string literal type.
 *
 * Note: We only need to handle `PromptTemplateInputVariableName`s and `PromptTemplateInputVariableConfig`s
 * as `PromptTemplateInputVariable`s in nested `PromptTemplateResult`s should already be validated.
 */
type ValidateInputVariables<
  InputVariables extends PromptTemplateInputVariable[],
> = {
  [Index in keyof InputVariables]: InputVariables[Index] extends PromptTemplateInputVariableName
    ? IfStringLiteral<
        InputVariables[Index],
        InputVariables[Index],
        PromptTemplateInputVariableNameError
      >
    : InputVariables[Index] extends { name: infer InputVariableName }
    ? IfStringLiteral<
        InputVariableName,
        InputVariables[Index],
        InputVariables[Index] & { name: PromptTemplateInputVariableNameError }
      >
    : InputVariables[Index]
}

export interface PromptTemplateOptions {
  /**
   * @default true
   */
  dedent?: boolean
}

type ExtractPromptTemplateResult<
  T extends TemplateStringsArray | PromptTemplateOptions,
  InputVariables extends PromptTemplateInputVariable[],
> = T extends TemplateStringsArray
  ? PromptTemplateResult<InputVariables>
  : PromptTemplate

type PromptTemplate = <
  T extends TemplateStringsArray | PromptTemplateOptions,
  InputVariables extends PromptTemplateInputVariable[],
>(
  templateStringsOrOptions: T,
  ...inputVariables: ValidateInputVariables<InputVariables>
) => ExtractPromptTemplateResult<T, InputVariables>

type CreatePromptTemplate = (options: PromptTemplateOptions) => PromptTemplate

const createPromptTemplate: CreatePromptTemplate = (options) => {
  const promptTemplate: PromptTemplate = <
    T extends TemplateStringsArray | PromptTemplateOptions,
    InputVariables extends PromptTemplateInputVariable[],
  >(
    templateStringsOrOptions: T,
    ...inputVariables: ValidateInputVariables<InputVariables>
  ): ExtractPromptTemplateResult<T, InputVariables> => {
    if (!isTemplateStrings(templateStringsOrOptions)) {
      const newPromptTemplate: PromptTemplate = createPromptTemplate({
        ...options,
        ...templateStringsOrOptions,
      })

      return newPromptTemplate as ExtractPromptTemplateResult<T, InputVariables>
    }

    const format: PromptTemplateFormat<InputVariables> = (inputValues_) => {
      const inputValues: { [inputVariableName: string]: string } =
        inputValues_ ?? {}

      const formatted = interleave(
        templateStringsOrOptions,
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

      return options.dedent ? dedent(formatted) : formatted
    }

    const promptTemplateResult: PromptTemplateResult<InputVariables> = {
      templateStrings: templateStringsOrOptions,
      inputVariables: inputVariables as InputVariables,
      format,
    }

    return promptTemplateResult as ExtractPromptTemplateResult<
      T,
      InputVariables
    >
  }

  return promptTemplate
}

function isTemplateStrings(
  templateStringsOrOptions: TemplateStringsArray | PromptTemplateOptions,
): templateStringsOrOptions is TemplateStringsArray {
  return Array.isArray(templateStringsOrOptions)
}

function interleave(
  templateStrings: TemplateStringsArray,
  inputVariables: PromptTemplateInputVariable[],
  cb: (inputVariableConfig: PromptTemplateInputVariableConfig) => string,
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

export const promptTemplate: PromptTemplate = createPromptTemplate({
  dedent: true,
})

type IfStringLiteral<T, Then, Else> = IsStringLiteral<T> extends true
  ? Then
  : Else

// https://www.totaltypescript.com/concepts/the-prettify-helper
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
