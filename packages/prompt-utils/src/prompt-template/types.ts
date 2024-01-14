import { IsStringLiteral } from 'type-fest'

import { PromptTemplate } from './prompt-template'

// ##################
// PromptTemplateBase
// ##################

export interface PromptTemplateBase {
  templateStrings: TemplateStringsArray

  inputVariables: PromptTemplateInputVariable[]

  prefix: string

  suffix: string

  format(
    inputValues?: PromptTemplateFormatInputValuesBase | void,
    options?: PromptTemplateFormatOptions,
  ): string

  getInputVariableNames(): PromptTemplateInputVariableName[]

  getInputVariableNamesRequired(): PromptTemplateInputVariableName[]

  getInputVariableNamesOptional(): PromptTemplateInputVariableName[]
}

// ###########################
// PromptTemplateInputVariable
// ###########################

export type PromptTemplateInputVariableName = string

export type PromptTemplateInputVariableNameError =
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
  | PromptTemplateBase

/**
 * Validates input variable names are a string literal type.
 *
 * Note: We only need to handle `PromptTemplateInputVariableName`s and `PromptTemplateInputVariableConfig`s
 * as `PromptTemplateInputVariable`s in nested `PromptTemplate`s should already be validated.
 */
export type ValidateInputVariables<
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

/**
 * Recursively extracts all input variable names.
 */
export type ExtractInputVariableName<
  InputVariables extends PromptTemplateInputVariable[],
> = InputVariables[number] extends infer InputVariable
  ? InputVariable extends PromptTemplateInputVariableName
    ? IfStringLiteral<InputVariable, InputVariable, never>
    : InputVariable extends { name: infer InputVariableName }
      ? IfStringLiteral<InputVariableName, InputVariableName, never>
      : InputVariable extends PromptTemplate<infer NestedInputVariables>
        ? ExtractInputVariableName<NestedInputVariables>
        : never
  : never

/**
 * Recursively extracts required input variable names (without a default value).
 */
export type ExtractInputVariableNameRequired<
  InputVariables extends PromptTemplateInputVariable[],
> = InputVariables[number] extends infer InputVariable
  ? InputVariable extends PromptTemplateInputVariableName
    ? IfStringLiteral<InputVariable, InputVariable, never>
    : InputVariable extends {
          name: infer InputVariableName
          default?: undefined
        }
      ? IfStringLiteral<InputVariableName, InputVariableName, never>
      : InputVariable extends PromptTemplate<infer NestedInputVariables>
        ? ExtractInputVariableNameRequired<NestedInputVariables>
        : never
  : never

/**
 * Recursively extracts all optional input variable names (with a default value).
 */
type ExtractInputVariableNameOptionalAll<
  InputVariables extends PromptTemplateInputVariable[],
> = InputVariables[number] extends infer InputVariable
  ? InputVariable extends { name: infer InputVariableName; default: string }
    ? IfStringLiteral<InputVariableName, InputVariableName, never>
    : InputVariable extends PromptTemplate<infer NestedInputVariables>
      ? ExtractInputVariableNameOptionalAll<NestedInputVariables>
      : never
  : never

/**
 * Recursively extracts optional input variable names (filtering out required input variable names)
 */
export type ExtractInputVariableNameOptional<
  InputVariables extends PromptTemplateInputVariable[],
  InputVariableNameRequired extends
    PromptTemplateInputVariableName = ExtractInputVariableNameRequired<InputVariables>,
> = ExtractInputVariableNameOptionalAll<InputVariables> extends infer InputVariableNameOptionalAll
  ? InputVariableNameOptionalAll extends PromptTemplateInputVariableName
    ? InputVariableNameOptionalAll extends InputVariableNameRequired
      ? never
      : InputVariableNameOptionalAll
    : never
  : never

// ####################
// PromptTemplateFormat
// ####################

export interface PromptTemplateFormatInputValuesBase {
  [inputVariableName: string]: string
}

export type PromptTemplateFormatInputValues<
  InputVariables extends PromptTemplateInputVariable[],
  InputVariableNameRequired extends
    PromptTemplateInputVariableName = ExtractInputVariableNameRequired<InputVariables>,
  InputVariableNameOptional extends
    PromptTemplateInputVariableName = ExtractInputVariableNameOptional<InputVariables>,
> = [ExtractInputVariableName<InputVariables>] extends [never]
  ? undefined | void
  : Prettify<
      {
        [InputVariableName in InputVariableNameRequired]: string
      } & {
        [InputVariableName in InputVariableNameOptional]?: string
      }
    >

export interface PromptTemplateFormatOptions {
  /**
   * @default true
   */
  validateInputValues?: boolean
}

export type PromptTemplateFormat<
  InputVariables extends PromptTemplateInputVariable[],
> = (
  inputValues: PromptTemplateFormatInputValues<InputVariables>,
  options?: PromptTemplateFormatOptions,
) => string

// #####################
// PromptTemplateOptions
// #####################

export interface PromptTemplateOptions {
  /**
   * @default true
   */
  dedent?: boolean
  prefix?: string
  suffix?: string
}

// ####################
// TaggedPromptTemplate
// ####################

export type CreateTaggedPromptTemplate = (
  options: PromptTemplateOptions,
) => TaggedPromptTemplate

export type TaggedPromptTemplate = <
  T extends TemplateStringsArray | PromptTemplateOptions,
  InputVariables extends PromptTemplateInputVariable[],
>(
  templateStringsOrOptions: T,
  ...inputVariables: ValidateInputVariables<InputVariables>
) => ExtractTaggedPromptTemplateResult<T, InputVariables>

export type ExtractTaggedPromptTemplateResult<
  T extends TemplateStringsArray | PromptTemplateOptions,
  InputVariables extends PromptTemplateInputVariable[],
> = T extends TemplateStringsArray
  ? PromptTemplate<InputVariables>
  : TaggedPromptTemplate

// #############
// Utility Types
// #############

type IfStringLiteral<T, Then, Else> = IsStringLiteral<T> extends true
  ? Then
  : Else

// https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}
