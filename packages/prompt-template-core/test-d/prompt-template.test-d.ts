/* eslint-disable @typescript-eslint/unbound-method */
import { expectType } from 'tsd'

import { PromptTemplate, PromptTemplateFormat } from '..'

import { getInputValues } from './utils'

/**
Test `promptTemplate` with empty string
*/
{
  const promptTemplate = PromptTemplate.create``

  type InputVariables = []

  type InputValues = void | undefined

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with basic string
*/
{
  const promptTemplate = PromptTemplate.create`0`

  type InputVariables = []

  type InputValues = void | undefined

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with literal `InputVariableName`
*/
{
  const promptTemplate = PromptTemplate.create`${'a'}`

  type InputVariables = ['a']

  type InputValues = { a: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with literal `InputVariableConfig`
*/
{
  const promptTemplate = PromptTemplate.create`${{
    name: 'b' as const,
  }}`

  type InputVariables = [{ name: 'b' }]

  type InputValues = { b: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with literal `InputVariableConfig` with default
*/
{
  const promptTemplate = PromptTemplate.create`${{
    name: 'b' as const,
    default: 'value',
  }}`

  type InputVariables = [{ name: 'b'; default: string }]

  type InputValues = { b?: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig`
*/
{
  const promptTemplate = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
  }}`

  type InputVariables = ['a', { name: 'b' }]

  type InputValues = { a: string; b: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig` with default
*/
{
  const promptTemplate = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}`

  type InputVariables = ['a', { name: 'b'; default: string }]

  type InputValues = { a: string; b?: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig`, and
  literal `InputVariableName`
*/
{
  const promptTemplate = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
  }}${'c'}`

  type InputVariables = ['a', { name: 'b' }, 'c']

  type InputValues = { a: string; b: string; c: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig` with default, and
  literal `InputVariableName`
*/
{
  const promptTemplate = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}${'c'}`

  type InputVariables = ['a', { name: 'b'; default: string }, 'c']

  type InputValues = { a: string; b?: string; c: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with empty string
*/
{
  const promptTemplateNested = PromptTemplate.create``

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[]>]

  type InputValues = void | undefined

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with basic string
*/
{
  const promptTemplateNested = PromptTemplate.create`0`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[]>]

  type InputValues = void | undefined

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with literal `InputVariableName`
*/
{
  const promptTemplateNested = PromptTemplate.create`${'a'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<['a']>]

  type InputValues = { a: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with literal `InputVariableConfig`
*/
{
  const promptTemplateNested = PromptTemplate.create`${{
    name: 'b' as const,
  }}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[{ name: 'b' }]>]

  type InputValues = { b: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with literal `InputVariableConfig` with default
*/
{
  const promptTemplateNested = PromptTemplate.create`${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[{ name: 'b'; default: string }]>]

  type InputValues = { b?: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig`
*/
{
  const promptTemplateNested = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
  }}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<['a', { name: 'b' }]>]

  type InputValues = { a: string; b: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig` with default
*/
{
  const promptTemplateNested = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<['a', { name: 'b'; default: string }]>]

  type InputValues = { a: string; b?: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig`, and
  literal `InputVariableName`
 */
{
  const promptTemplateNested = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
  }}${'c'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<['a', { name: 'b' }, 'c']>]

  type InputValues = { a: string; b: string; c: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with nested `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig` with default, and
  literal `InputVariableName`
*/
{
  const promptTemplateNested = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}${'c'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<['a', { name: 'b'; default: string }, 'c']>,
  ]

  type InputValues = { a: string; b?: string; c: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with empty string
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create``

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[PromptTemplate<[]>]>]

  type InputValues = void | undefined

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with basic string
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create`0`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[PromptTemplate<[]>]>]

  type InputValues = void | undefined

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableName`
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[PromptTemplate<['a']>]>]

  type InputValues = { a: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableConfig`
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create`${{
    name: 'b' as const,
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[PromptTemplate<[{ name: 'b' }]>]>]

  type InputValues = { b: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with literal `InputVariableConfig` with default
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create`${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<[PromptTemplate<[{ name: 'b'; default: string }]>]>,
  ]

  type InputValues = { b?: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig`
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [PromptTemplate<[PromptTemplate<['a', { name: 'b' }]>]>]

  type InputValues = { a: string; b: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with
  literal `InputVariableName` and
  literal `InputVariableConfig` with default
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<[PromptTemplate<['a', { name: 'b'; default: string }]>]>,
  ]

  type InputValues = { a: string; b?: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig`, and
  literal `InputVariableName`
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}${'c'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<[PromptTemplate<['a', { name: 'b' }]>, 'c']>,
  ]

  type InputValues = { a: string; b: string; c: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}

/**
Test `promptTemplate` with deeply nested `promptTemplate` with
  literal `InputVariableName`,
  literal `InputVariableConfig` with default, and
  literal `InputVariableName`
*/
{
  const promptTemplateNestedDeep = PromptTemplate.create`${'a'}${{
    name: 'b' as const,
    default: 'value',
  }}`

  const promptTemplateNested = PromptTemplate.create`${promptTemplateNestedDeep}${'c'}`

  const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

  type InputVariables = [
    PromptTemplate<
      [PromptTemplate<['a', { name: 'b'; default: string }]>, 'c']
    >,
  ]

  type InputValues = { a: string; b?: string; c: string }

  expectType<PromptTemplate<InputVariables>>(promptTemplate)

  expectType<PromptTemplateFormat<InputVariables>>(promptTemplate.format)

  expectType<InputValues>(getInputValues(promptTemplate.format))
}
