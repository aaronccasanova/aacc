/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from 'zod'

import type {
  PromptTemplateBase,
  PromptTemplateInputVariable,
  PromptTemplateInputVariableName,
} from '../types'
import { PromptTemplate } from '../prompt-template'

describe('promptTemplate', () => {
  it('handles empty string', () => {
    const promptTemplate = PromptTemplate.create``

    const prompt = promptTemplate.format()

    expect(prompt).toBe('')

    testInputVariables(promptTemplate, {
      inputVariables: [],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles basic string', () => {
    const promptTemplate = PromptTemplate.create`0`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('0')

    testInputVariables(promptTemplate, {
      inputVariables: [],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'}`

    const prompt = promptTemplate.format({
      a: 'a',
    })

    expect(prompt).toBe('a')

    testInputVariables(promptTemplate, {
      inputVariables: ['a'],
      inputVariableNames: ['a'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`${{ name: 'b' as const }}`

    const prompt = promptTemplate.format({
      b: 'b',
    })

    expect(prompt).toBe('b')

    testInputVariables(promptTemplate, {
      inputVariables: [{ name: 'b' }],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplate = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const prompt = promptTemplate.format({ b: 'b' })

    expect(prompt).toBe('b')

    const promptWithDefault = promptTemplate.format({})

    expect(promptWithDefault).toBe('default')

    testInputVariables(promptTemplate, {
      inputVariables: [{ name: 'b' as const, default: 'default' }],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    testInputVariables(promptTemplate, {
      inputVariables: ['a', { name: 'b' }],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    const promptWithDefault = promptTemplate.format({
      a: 'a',
    })

    expect(promptWithDefault).toBe('a default')

    testInputVariables(promptTemplate, {
      inputVariables: ['a', { name: 'b' as const, default: 'default' }],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }} ${'c'}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    testInputVariables(promptTemplate, {
      inputVariables: ['a', { name: 'b' }, 'c'],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }} ${'c'}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    const promptWithDefault = promptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toBe('a default c')

    testInputVariables(promptTemplate, {
      inputVariables: ['a', { name: 'b' as const, default: 'default' }, 'c'],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a', 'c'],
    })
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${'b'} ${{
      name: 'b' as const,
      default: 'default',
    }}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b b')

    testInputVariables(promptTemplate, {
      inputVariables: ['a', 'b', { name: 'b' as const, default: 'default' }],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })

  it('handles invalid input variable `InputVariableName`', () => {
    const invalidInputVariableName = 0

    const getPromptTemplate = () =>
      PromptTemplate.create`${
        // @ts-expect-error
        invalidInputVariableName
      }`

    expect(getPromptTemplate).toThrow()
  })

  it('handles invalid input variable `InputVariableConfig`', () => {
    const invalidInputVariableConfig = {}

    const getPromptTemplate = () =>
      PromptTemplate.create`${
        // @ts-expect-error
        invalidInputVariableConfig
      }`

    expect(getPromptTemplate).toThrow()
  })

  it('handles invalid input variable `PromptTemplate` instance', () => {
    const invalidInputVariablePromptTemplate = PromptTemplate

    const getPromptTemplate = () =>
      PromptTemplate.create`${
        // @ts-expect-error
        invalidInputVariablePromptTemplate
      }`

    expect(getPromptTemplate).toThrow()
  })

  it('handles missing input values from `InputVariableName`', () => {
    const promptTemplate = PromptTemplate.create`${'a'}`

    const getPrompt = () =>
      // @ts-expect-error
      promptTemplate.format()

    expect(getPrompt).toThrow()
  })

  it('handles missing input values from `InputVariableConfig`', () => {
    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }}`

    const getPrompt = () =>
      // @ts-expect-error
      promptTemplate.format({
        a: 'a',
      })

    expect(getPrompt).toThrow()
  })

  it('handles missing input values from `PromptTemplate` instance', () => {
    const nestedPromptTemplate = PromptTemplate.create`${'c'}`

    const promptTemplate = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }} ${nestedPromptTemplate}`

    const getPrompt = () =>
      // @ts-expect-error
      promptTemplate.format({
        a: 'a',
        b: 'b',
      })

    expect(getPrompt).toThrow()
  })
})

describe('promptTemplate nested', () => {
  it('handles empty string', () => {
    const promptTemplateNested = PromptTemplate.create``

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles basic string', () => {
    const promptTemplateNested = PromptTemplate.create`0`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('0')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
    })

    expect(prompt).toBe('a')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b' as const,
    }}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      b: 'b',
    })

    expect(prompt).toBe('b')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({ b: 'b' })

    expect(prompt).toBe('b')

    const promptWithDefault = promptTemplate.format({})

    expect(promptWithDefault).toBe('default')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    const promptWithDefault = promptTemplate.format({
      a: 'a',
    })

    expect(promptWithDefault).toBe('a default')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }} ${'c'}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplateNested = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }} ${'c'}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    const promptWithDefault = promptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toBe('a default c')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a', 'c'],
    })
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplateNested = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplate = PromptTemplate.create`${'a'} ${'b'} ${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b b')

    testInputVariables(promptTemplate, {
      inputVariables: ['a', 'b', promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })
})

describe('promptTemplate deeply nested', () => {
  it('handles empty string', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create``

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles basic string', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`0`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('0')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: [],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
    })

    expect(prompt).toBe('a')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableConfig`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{
      name: 'b' as const,
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      b: 'b',
    })

    expect(prompt).toBe('b')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['b'],
    })
  })

  it('handles `InputVariableConfig` with `default`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({ b: 'b' })

    expect(prompt).toBe('b')

    const promptWithDefault = promptTemplate.format({})

    expect(promptWithDefault).toBe('default')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: [],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })

  it('handles `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    const promptWithDefault = promptTemplate.format({
      a: 'a',
    })

    expect(promptWithDefault).toBe('a default')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
    }} ${'c'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
  })

  it('handles `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'} ${{
      name: 'b' as const,
      default: 'default',
    }} ${'c'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    const promptWithDefault = promptTemplate.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toBe('a default c')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: ['b'],
      inputVariableNamesRequired: ['a', 'c'],
    })
  })

  it('handles each `InputVariableName`', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${'a'}`

    const promptTemplateNested = PromptTemplate.create`${promptTemplatedNestedDeep} ${'b'}`

    const promptTemplate = PromptTemplate.create`${promptTemplateNested} ${'c'}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    testInputVariables(promptTemplate, {
      inputVariables: [promptTemplateNested, 'c'],
      inputVariableNames: ['a', 'b', 'c'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b', 'c'],
    })
  })

  it('handles duplicate inputVariables', () => {
    const promptTemplatedNestedDeep = PromptTemplate.create`${{
      name: 'b' as const,
      default: 'default',
    }}`

    const promptTemplateNested = PromptTemplate.create`${'b'} ${promptTemplatedNestedDeep}`

    const promptTemplate = PromptTemplate.create`${'a'} ${promptTemplateNested}`

    const prompt = promptTemplate.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b b')

    testInputVariables(promptTemplate, {
      inputVariables: ['a', promptTemplateNested],
      inputVariableNames: ['a', 'b'],
      inputVariableNamesOptional: [],
      inputVariableNamesRequired: ['a', 'b'],
    })
  })
})

describe('promptTemplate `InputVariableConfig`', () => {
  it('handles `InputVariableConfig` with `schema` basic', () => {
    const promptTemplate = PromptTemplate.create`${{
      name: 'a' as const,
      schema: z.string(),
    }}`

    const prompt = promptTemplate.format({
      a: 'a',
    })

    expect(prompt).toBe('a')
  })

  it('handles `InputVariableConfig` with `schema` min length', () => {
    const promptTemplate = PromptTemplate.create`${{
      name: 'a' as const,
      schema: z.string().min(2),
    }}`

    const prompt = promptTemplate.format({
      a: 'aa',
    })

    expect(prompt).toBe('aa')

    const getPrompt = () =>
      promptTemplate.format({
        a: 'a',
      })

    expect(getPrompt).toThrow()
  })

  it('handles `InputVariableConfig` with `onFormat`', () => {
    const promptTemplate = PromptTemplate.create`${{
      name: 'a' as const,
      onFormat: (inputValue) => inputValue.toUpperCase(),
    }}`

    const prompt = promptTemplate.format({
      a: 'a',
    })

    expect(prompt).toBe('A')
  })

  it('handles `InputVariableConfig` with `schema` min length and `onFormat`', () => {
    const promptTemplate = PromptTemplate.create`${{
      name: 'a' as const,
      schema: z.string().min(2),
      onFormat: (inputValue) => inputValue.toUpperCase(),
    }}`

    const prompt = promptTemplate.format({
      a: 'aa',
    })

    expect(prompt).toBe('AA')

    const getPrompt = () =>
      promptTemplate.format({
        a: 'a',
      })

    expect(getPrompt).toThrow()
  })
})

describe('promptTemplate `PromptTemplateOptions`', () => {
  it('handles `PromptTemplateOptions` with `dedent` default', () => {
    const promptTemplate = PromptTemplate.create`
      0
        1
    `
    const prompt = promptTemplate.format()

    expect(prompt).toBe('0\n  1')
  })

  it('handles `PromptTemplateOptions` with `dedent` explicit', () => {
    const promptTemplate = PromptTemplate.create({ dedent: true })`
      0
        1
    `
    const prompt = promptTemplate.format()

    expect(prompt).toBe('0\n  1')
  })

  it('handles `PromptTemplateOptions` without `dedent`', () => {
    const promptTemplate = PromptTemplate.create({ dedent: false })`
      0
        1
    `
    const prompt = promptTemplate.format()

    expect(prompt).toBe('\n      0\n        1\n    ')
  })

  it('handles `PromptTemplateOptions` with `dedent` multiple overrides', () => {
    const promptTemplate = PromptTemplate.create({ dedent: false })({
      dedent: true,
    })`
      0
        1
    `
    const prompt = promptTemplate.format()

    expect(prompt).toBe('0\n  1')
  })

  it('handles `PromptTemplateOptions` with `prefix`', () => {
    const promptTemplate = PromptTemplate.create({ prefix: 'prefix' })`0`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('prefix0')
  })

  it('handles `PromptTemplateOptions` with `suffix`', () => {
    const promptTemplate = PromptTemplate.create({ suffix: 'suffix' })`0`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('0suffix')
  })

  it('handles `PromptTemplateOptions` with `prefix` and `suffix`', () => {
    const promptTemplate = PromptTemplate.create({
      prefix: 'prefix',
      suffix: 'suffix',
    })`0`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('prefix0suffix')
  })

  it('handles `PromptTemplateOptions` with `prefix` and `suffix` multiple overrides', () => {
    const promptTemplate = PromptTemplate.create({
      prefix: 'prefix1',
      suffix: 'suffix1',
    })({
      prefix: 'prefix2',
      suffix: 'suffix2',
    })`0`

    const prompt = promptTemplate.format()

    expect(prompt).toBe('prefix20suffix2')
  })
})

function testInputVariables(
  promptTemplate: PromptTemplateBase,
  expected: {
    inputVariables: PromptTemplateInputVariable[]
    inputVariableNames: PromptTemplateInputVariableName[]
    inputVariableNamesOptional: PromptTemplateInputVariableName[]
    inputVariableNamesRequired: PromptTemplateInputVariableName[]
  },
) {
  expect(promptTemplate.inputVariables).toEqual(expected.inputVariables)

  expect(promptTemplate.getInputVariableNames()).toEqual(
    expected.inputVariableNames,
  )

  expect(promptTemplate.getInputVariableNamesOptional()).toEqual(
    expected.inputVariableNamesOptional,
  )

  expect(promptTemplate.getInputVariableNamesRequired()).toEqual(
    expected.inputVariableNamesRequired,
  )
}
