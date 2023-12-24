import { expectType } from 'tsd'

import { promptTemplate, PromptTemplateFormat, PromptTemplateResult } from '..'

import { getInputValues } from './utils'

/**
Test `promptTemplate` with empty string
*/
{
  const promptTemplateResult = promptTemplate``

  type InputVariables = []

  type InputValues = void

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with basic string
*/
{
  const promptTemplateResult = promptTemplate`0`

  type InputVariables = []

  type InputValues = void

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with literal `InputVariableName`
*/
{
  const promptTemplateResult = promptTemplate`${'a'}`

  type InputVariables = ['a']

  type InputValues = { a: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with literal `InputVariableConfig`
*/
{
  const promptTemplateResult = promptTemplate`${{
    name: 'b' as const,
  }}`

  type InputVariables = [{ name: 'b' }]

  type InputValues = { b: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with literal `InputVariableConfig` with default
*/
{
  const promptTemplateResult = promptTemplate`${{
    name: 'b' as const,
    default: 'value',
  }}`

  type InputVariables = [{ name: 'b'; default: string }]

  type InputValues = { b?: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig`
*/
{
  const promptTemplateResult = promptTemplate`${'a'}${{
    name: 'b' as const,
  }}`

  type InputVariables = ['a', { name: 'b' }]

  type InputValues = { a: string; b: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig` with default
*/
{
  const promptTemplateResult = promptTemplate`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}`

  type InputVariables = ['a', { name: 'b'; default: string }]

  type InputValues = { a: string; b?: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig`, and
  literal `InputVariableName`
*/
{
  const promptTemplateResult = promptTemplate`${'a'}${{
    name: 'b' as const,
  }}${'c'}`

  type InputVariables = ['a', { name: 'b' }, 'c']

  type InputValues = { a: string; b: string; c: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig` with default, and
  literal `InputVariableName`
*/
{
  const promptTemplateResult = promptTemplate`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}${'c'}`

  type InputVariables = ['a', { name: 'b'; default: string }, 'c']

  type InputValues = { a: string; b?: string; c: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with empty string
*/
{
  const promptTemplateResultNested = promptTemplate``

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<[]>]

  type InputValues = void

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with basic string
*/
{
  const promptTemplateResultNested = promptTemplate`0`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<[]>]

  type InputValues = void

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with literal `InputVariableName`
*/
{
  const promptTemplateResultNested = promptTemplate`${'a'}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<['a']>]

  type InputValues = { a: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with literal `InputVariableConfig`
*/
{
  const promptTemplateResultNested = promptTemplate`${{
    name: 'b' as const,
  }}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<[{ name: 'b' }]>]

  type InputValues = { b: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with literal `InputVariableConfig` with default
*/
{
  const promptTemplateResultNested = promptTemplate`${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<[{ name: 'b'; default: string }]>]

  type InputValues = { b?: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig`
*/
{
  const promptTemplateResultNested = promptTemplate`${'a'}${{
    name: 'b' as const,
  }}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<['a', { name: 'b' }]>]

  type InputValues = { a: string; b: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig` with default
*/
{
  const promptTemplateResultNested = promptTemplate`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [
    PromptTemplateResult<['a', { name: 'b'; default: string }]>,
  ]

  type InputValues = { a: string; b?: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig`, and
  literal `InputVariableName`
 */
{
  const promptTemplateResultNested = promptTemplate`${'a'}${{
    name: 'b' as const,
  }}${'c'}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<['a', { name: 'b' }, 'c']>]

  type InputValues = { a: string; b: string; c: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig` with default, and
  literal `InputVariableName`
*/
{
  const promptTemplateResultNested = promptTemplate`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}${'c'}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [
    PromptTemplateResult<['a', { name: 'b'; default: string }, 'c']>,
  ]

  type InputValues = { a: string; b?: string; c: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with empty string
*/
{
  const promptTemplateResultNestedDeep = promptTemplate``

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<[PromptTemplateResult<[]>]>]

  type InputValues = void

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with basic string
*/
{
  const promptTemplateResultNestedDeep = promptTemplate`0`

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<[PromptTemplateResult<[]>]>]

  type InputValues = void

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableName`
*/
{
  const promptTemplateResultNestedDeep = promptTemplate`${'a'}`

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [PromptTemplateResult<[PromptTemplateResult<['a']>]>]

  type InputValues = { a: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableConfig`
*/
{
  const promptTemplateResultNestedDeep = promptTemplate`${{
    name: 'b' as const,
  }}`

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [
    PromptTemplateResult<[PromptTemplateResult<[{ name: 'b' }]>]>,
  ]

  type InputValues = { b: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableConfig` with default
*/
{
  const promptTemplateResultNestedDeep = promptTemplate`${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [
    PromptTemplateResult<
      [PromptTemplateResult<[{ name: 'b'; default: string }]>]
    >,
  ]

  type InputValues = { b?: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig`
*/
{
  const promptTemplateResultNestedDeep = promptTemplate`${'a'}${{
    name: 'b' as const,
  }}`

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [
    PromptTemplateResult<[PromptTemplateResult<['a', { name: 'b' }]>]>,
  ]

  type InputValues = { a: string; b: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig` with default
*/
{
  const promptTemplateResultNestedDeep = promptTemplate`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [
    PromptTemplateResult<
      [PromptTemplateResult<['a', { name: 'b'; default: string }]>]
    >,
  ]

  type InputValues = { a: string; b?: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig`, and
  literal `InputVariableName`
*/
{
  const promptTemplateResultNestedDeep = promptTemplate`${'a'}${{
    name: 'b' as const,
  }}`

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}${'c'}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [
    PromptTemplateResult<[PromptTemplateResult<['a', { name: 'b' }]>, 'c']>,
  ]

  type InputValues = { a: string; b: string; c: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig` with default, and
  literal `InputVariableName`
*/
{
  const promptTemplateResultNestedDeep = promptTemplate`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplateResultNested = promptTemplate`${promptTemplateResultNestedDeep}${'c'}`

  const promptTemplateResult = promptTemplate`${promptTemplateResultNested}`

  type InputVariables = [
    PromptTemplateResult<
      [PromptTemplateResult<['a', { name: 'b'; default: string }]>, 'c']
    >,
  ]

  type InputValues = { a: string; b?: string; c: string }

  expectType<PromptTemplateResult<InputVariables>>(promptTemplateResult)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplateResult.format)

  expectType<InputValues>(getInputValues(promptTemplateResult.format))
}
