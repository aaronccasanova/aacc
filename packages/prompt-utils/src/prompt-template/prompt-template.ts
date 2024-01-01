import dedent from 'dedent'

import type {
  CreateTaggedPromptTemplate,
  ExtractInputValues,
  ExtractInputVariableName,
  ExtractInputVariableNameOptional,
  ExtractInputVariableNameRequired,
  ExtractTaggedPromptTemplateResult,
  PromptTemplateBase,
  PromptTemplateInputValues,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableConfig,
  PromptTemplateInputVariableName,
  PromptTemplateOptions,
  TaggedPromptTemplate,
  ValidateInputVariables,
} from './types'

const createTaggedPromptTemplate: CreateTaggedPromptTemplate = (options) => {
  const taggedPromptTemplate: TaggedPromptTemplate = <
    T extends TemplateStringsArray | PromptTemplateOptions,
    InputVariables extends PromptTemplateInputVariable[],
  >(
    templateStringsOrOptions: T,
    ...inputVariables: ValidateInputVariables<InputVariables>
  ): ExtractTaggedPromptTemplateResult<T, InputVariables> => {
    if (isPromptTemplateOptions(templateStringsOrOptions)) {
      return createTaggedPromptTemplate({
        ...options,
        ...templateStringsOrOptions,
      }) as ExtractTaggedPromptTemplateResult<T, InputVariables>
    }

    return new PromptTemplate(
      templateStringsOrOptions,
      inputVariables,
      options,
    ) as ExtractTaggedPromptTemplateResult<T, InputVariables>
  }

  return taggedPromptTemplate
}

export const promptTemplate: TaggedPromptTemplate = createTaggedPromptTemplate(
  {},
)

export class PromptTemplate<
  InputVariables extends PromptTemplateInputVariable[],
> implements PromptTemplateBase
{
  static create = promptTemplate

  templateStrings: TemplateStringsArray

  inputVariables: ValidateInputVariables<InputVariables>

  prefix: string

  suffix: string

  #dedent: boolean

  constructor(
    templateStrings: TemplateStringsArray,
    inputVariables: ValidateInputVariables<InputVariables>,
    options?: PromptTemplateOptions,
  ) {
    this.templateStrings = templateStrings
    this.inputVariables = inputVariables
    this.prefix = options?.prefix ?? ''
    this.suffix = options?.suffix ?? ''
    this.#dedent = options?.dedent ?? true
  }

  format(inputValues: ExtractInputValues<InputVariables>): string {
    const normalizedInputValues: PromptTemplateInputValues = inputValues ?? {}

    let prompt = this.#interleave({
      onPromptTemplate: (nestedPromptTemplate) =>
        nestedPromptTemplate.format(normalizedInputValues),
      //
      onInputVariableName: (inputVariableName) =>
        normalizedInputValues[inputVariableName] ?? '',
      //
      onInputVariableConfig: (inputVariableConfig) => {
        let inputValue =
          normalizedInputValues[inputVariableConfig.name] ??
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
    })

    prompt = this.#dedent ? dedent(prompt) : prompt

    prompt = `${this.prefix}${prompt}${this.suffix}`

    return prompt
  }

  /**
   * Recursively extracts and deduplicates all input variable names.
   */
  getInputVariableNames(): ExtractInputVariableName<InputVariables>[] {
    const inputVariableNamesSet = new Set<PromptTemplateInputVariableName>()

    this.#walkInputVariables(this.inputVariables, {
      onInputVariableName: (inputVariableName) => {
        inputVariableNamesSet.add(inputVariableName)
      },
      onInputVariableConfig: (inputVariableConfig) => {
        inputVariableNamesSet.add(inputVariableConfig.name)
      },
    })

    const inputVariableNames = Array.from(inputVariableNamesSet)

    return inputVariableNames as ExtractInputVariableName<InputVariables>[]
  }

  /**
   * Recursively extracts and deduplicates all required input variable names (without a default value).
   */
  getInputVariableNamesRequired(): ExtractInputVariableNameRequired<InputVariables>[] {
    const inputVariableNamesRequiredSet =
      new Set<PromptTemplateInputVariableName>()

    this.#walkInputVariables(this.inputVariables, {
      onInputVariableName: (inputVariableName) => {
        inputVariableNamesRequiredSet.add(inputVariableName)
      },
      onInputVariableConfig: (inputVariableConfig) => {
        if (!isInputVariableConfigOptional(inputVariableConfig)) {
          inputVariableNamesRequiredSet.add(inputVariableConfig.name)
        }
      },
    })

    const inputVariableNamesRequired = Array.from(inputVariableNamesRequiredSet)

    return inputVariableNamesRequired as ExtractInputVariableNameRequired<InputVariables>[]
  }

  /**
   * Recursively extracts and deduplicates all optional input variable names (with a default value and filtering out required input variable names).
   */
  getInputVariableNamesOptional(): ExtractInputVariableNameOptional<InputVariables>[] {
    const inputVariableNamesOptionalAllSet =
      new Set<PromptTemplateInputVariableName>()

    const inputVariableNamesRequiredSet =
      new Set<PromptTemplateInputVariableName>()

    this.#walkInputVariables(this.inputVariables, {
      onInputVariableName: (inputVariableName) => {
        inputVariableNamesRequiredSet.add(inputVariableName)
      },
      onInputVariableConfig: (inputVariableConfig) => {
        if (isInputVariableConfigOptional(inputVariableConfig)) {
          inputVariableNamesOptionalAllSet.add(inputVariableConfig.name)
        } else {
          inputVariableNamesRequiredSet.add(inputVariableConfig.name)
        }
      },
    })

    const inputVariableNamesOptional: PromptTemplateInputVariableName[] = []

    for (const inputVariableNameOptionalAll of inputVariableNamesOptionalAllSet) {
      if (!inputVariableNamesRequiredSet.has(inputVariableNameOptionalAll)) {
        inputVariableNamesOptional.push(inputVariableNameOptionalAll)
      }
    }

    return inputVariableNamesOptional as ExtractInputVariableNameOptional<InputVariables>[]
  }

  #walkInputVariables(
    inputVariables: PromptTemplateInputVariable[],
    callbacks: {
      onInputVariableName?: (
        inputVariableName: PromptTemplateInputVariableName,
      ) => void
      onInputVariableConfig?: (
        inputVariableConfig: PromptTemplateInputVariableConfig,
      ) => void
      onPromptTemplate?: (promptTemplate: PromptTemplateBase) => void
    },
  ) {
    for (const inputVariable of inputVariables) {
      if (isInputVariableName(inputVariable)) {
        callbacks.onInputVariableName?.(inputVariable)
        //
      } else if (isInputVariableConfig(inputVariable)) {
        callbacks.onInputVariableConfig?.(inputVariable)
        //
      } else {
        callbacks.onPromptTemplate?.(inputVariable)

        this.#walkInputVariables(inputVariable.inputVariables, callbacks)
      }
    }
  }

  #interleave(callbacks: {
    onInputVariableName: (
      inputVariableName: PromptTemplateInputVariableName,
    ) => string
    onInputVariableConfig: (
      inputVariableConfig: PromptTemplateInputVariableConfig,
    ) => string
    onPromptTemplate: (promptTemplate: PromptTemplateBase) => string
  }): string {
    let interleaved = ''

    for (let i = 0; i < this.templateStrings.length; i += 1) {
      interleaved += this.templateStrings[i]

      if (i < this.inputVariables.length) {
        const inputVariable = this.inputVariables[i]!

        if (isInputVariableName(inputVariable)) {
          interleaved += callbacks.onInputVariableName(inputVariable)
          //
        } else if (isInputVariableConfig(inputVariable)) {
          interleaved += callbacks.onInputVariableConfig(inputVariable)
          //
        } else {
          interleaved += callbacks.onPromptTemplate(inputVariable)
        }
      }
    }

    return interleaved
  }
}

function isInputVariableName(
  inputVariable: PromptTemplateInputVariable,
): inputVariable is PromptTemplateInputVariableName {
  return typeof inputVariable === 'string'
}

function isInputVariableConfig(
  inputVariable: PromptTemplateInputVariable,
): inputVariable is PromptTemplateInputVariableConfig {
  return !isInputVariableName(inputVariable) && 'name' in inputVariable
}

function isInputVariableConfigOptional(
  inputVariable: PromptTemplateInputVariable,
): inputVariable is PromptTemplateInputVariableConfig & { default: string } {
  return isInputVariableConfig(inputVariable) && 'default' in inputVariable
}

// function isPromptTemplate(
//   inputVariable: PromptTemplateInputVariable,
// ): inputVariable is PromptTemplateBase {
//   return inputVariable instanceof PromptTemplate
// }

function isTemplateStringsArray(
  templateStringsOrOptions: TemplateStringsArray | PromptTemplateOptions,
): templateStringsOrOptions is TemplateStringsArray {
  return Array.isArray(templateStringsOrOptions)
}

export function isPromptTemplateOptions(
  templateStringsOrOptions: TemplateStringsArray | PromptTemplateOptions,
): templateStringsOrOptions is PromptTemplateOptions {
  return !isTemplateStringsArray(templateStringsOrOptions)
}
