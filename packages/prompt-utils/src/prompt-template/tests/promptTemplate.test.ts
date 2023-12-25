import { z } from 'zod'

import { promptTemplate } from '../prompt-template'

describe('promptTemplate', () => {
  it('formats empty string', () => {
    const template = promptTemplate``

    const prompt = template.format()

    expect(prompt).toBe('')
  })

  it('formats basic string', () => {
    const template = promptTemplate`0`

    const prompt = template.format()

    expect(prompt).toBe('0')
  })

  it('formats `InputVariableName`', () => {
    const template = promptTemplate`${'a'}`

    const prompt = template.format({
      a: 'a',
    })

    expect(prompt).toBe('a')
  })

  it('formats `InputVariableConfig`', () => {
    const template = promptTemplate`${{ name: 'b' }}`

    const prompt = template.format({
      b: 'b',
    })

    expect(prompt).toBe('b')
  })

  it('formats `InputVariableConfig` with `default`', () => {
    const template = promptTemplate`${{ name: 'b', default: 'default' }}`

    const prompt = template.format({ b: 'b' })

    expect(prompt).toBe('b')

    const promptWithDefault = template.format({})

    expect(promptWithDefault).toBe('default')
  })

  it('formats `InputVariableName` and `InputVariableConfig`', () => {
    const template = promptTemplate`${'a'} ${{ name: 'b' }}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')
  })

  it('formats `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const template = promptTemplate`${'a'} ${{ name: 'b', default: 'default' }}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    const promptWithDefault = template.format({
      a: 'a',
    })

    expect(promptWithDefault).toBe('a default')
  })

  it('formats `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const template = promptTemplate`${'a'} ${{ name: 'b' }} ${'c'}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')
  })

  it('formats `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const template = promptTemplate`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'c'}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    const promptWithDefault = template.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toBe('a default c')
  })
})

describe('promptTemplate nested', () => {
  it('formats empty string', () => {
    const templateNested = promptTemplate``

    const template = promptTemplate`${templateNested}`

    const prompt = template.format()

    expect(prompt).toBe('')
  })

  it('formats basic string', () => {
    const templateNested = promptTemplate`0`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format()

    expect(prompt).toBe('0')
  })

  it('formats `InputVariableName`', () => {
    const templateNested = promptTemplate`${'a'}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
    })

    expect(prompt).toBe('a')
  })

  it('formats `InputVariableConfig`', () => {
    const templateNested = promptTemplate`${{ name: 'b' }}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      b: 'b',
    })

    expect(prompt).toBe('b')
  })

  it('formats `InputVariableConfig` with `default`', () => {
    const templateNested = promptTemplate`${{ name: 'b', default: 'default' }}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({ b: 'b' })

    expect(prompt).toBe('b')

    const promptWithDefault = template.format({})

    expect(promptWithDefault).toBe('default')
  })

  it('formats `InputVariableName` and `InputVariableConfig`', () => {
    const templateNested = promptTemplate`${'a'} ${{ name: 'b' }}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')
  })

  it('formats `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const templateNested = promptTemplate`${'a'} ${{
      name: 'b',
      default: 'default',
    }}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    const promptWithDefault = template.format({
      a: 'a',
    })

    expect(promptWithDefault).toBe('a default')
  })

  it('formats `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const templateNested = promptTemplate`${'a'} ${{ name: 'b' }} ${'c'}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')
  })

  it('formats `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const templateNested = promptTemplate`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'c'}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    const promptWithDefault = template.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toBe('a default c')
  })
})

describe('promptTemplate deeply nested', () => {
  it('formats empty string', () => {
    const templateNestedDeep = promptTemplate``

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format()

    expect(prompt).toBe('')
  })

  it('formats basic string', () => {
    const templateNestedDeep = promptTemplate`0`

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format()

    expect(prompt).toBe('0')
  })

  it('formats `InputVariableName`', () => {
    const templateNestedDeep = promptTemplate`${'a'}`

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
    })

    expect(prompt).toBe('a')
  })

  it('formats `InputVariableConfig`', () => {
    const templateNestedDeep = promptTemplate`${{ name: 'b' }}`

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      b: 'b',
    })

    expect(prompt).toBe('b')
  })

  it('formats `InputVariableConfig` with `default`', () => {
    const templateNestedDeep = promptTemplate`${{
      name: 'b',
      default: 'default',
    }}`

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({ b: 'b' })

    expect(prompt).toBe('b')

    const promptWithDefault = template.format({})

    expect(promptWithDefault).toBe('default')
  })

  it('formats `InputVariableName` and `InputVariableConfig`', () => {
    const templateNestedDeep = promptTemplate`${'a'} ${{ name: 'b' }}`

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')
  })

  it('formats `InputVariableName` and `InputVariableConfig` with `default`', () => {
    const templateNestedDeep = promptTemplate`${'a'} ${{
      name: 'b',
      default: 'default',
    }}`

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
    })

    expect(prompt).toBe('a b')

    const promptWithDefault = template.format({
      a: 'a',
    })

    expect(promptWithDefault).toBe('a default')
  })

  it('formats `InputVariableName`, `InputVariableConfig`, and `InputVariableName`', () => {
    const templateNestedDeep = promptTemplate`${'a'} ${{ name: 'b' }} ${'c'}`

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')
  })

  it('formats `InputVariableName`, `InputVariableConfig` with `default`, and `InputVariableName`', () => {
    const templateNestedDeep = promptTemplate`${'a'} ${{
      name: 'b',
      default: 'default',
    }} ${'c'}`

    const templateNested = promptTemplate`${templateNestedDeep}`

    const template = promptTemplate`${templateNested}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')

    const promptWithDefault = template.format({
      a: 'a',
      c: 'c',
    })

    expect(promptWithDefault).toBe('a default c')
  })

  it('formats each `InputVariableName`', () => {
    const templateNestedDeep = promptTemplate`${'a'}`

    const templateNested = promptTemplate`${templateNestedDeep} ${'b'}`

    const template = promptTemplate`${templateNested} ${'c'}`

    const prompt = template.format({
      a: 'a',
      b: 'b',
      c: 'c',
    })

    expect(prompt).toBe('a b c')
  })
})

describe('promptTemplate `InputVariableConfig`', () => {
  it('formats `InputVariableConfig` with `schema` basic', () => {
    const template = promptTemplate`${{ name: 'a', schema: z.string() }}`

    const prompt = template.format({
      a: 'a',
    })

    expect(prompt).toBe('a')
  })

  it('formats `InputVariableConfig` with `schema` min length', () => {
    const template = promptTemplate`${{ name: 'a', schema: z.string().min(2) }}`

    const prompt = template.format({
      a: 'aa',
    })

    expect(prompt).toBe('aa')

    const getPrompt = () =>
      template.format({
        a: 'a',
      })

    expect(getPrompt).toThrow()
  })

  it('formats `InputVariableConfig` with `onFormat`', () => {
    const template = promptTemplate`${{
      name: 'a',
      onFormat: (inputValue) => inputValue.toUpperCase(),
    }}`

    const prompt = template.format({
      a: 'a',
    })

    expect(prompt).toBe('A')
  })

  it('formats `InputVariableConfig` with `schema` min length and `onFormat`', () => {
    const template = promptTemplate`${{
      name: 'a',
      schema: z.string().min(2),
      onFormat: (inputValue) => inputValue.toUpperCase(),
    }}`

    const prompt = template.format({
      a: 'aa',
    })

    expect(prompt).toBe('AA')

    const getPrompt = () =>
      template.format({
        a: 'a',
      })

    expect(getPrompt).toThrow()
  })
})

describe('promptTemplate `PromptTemplateOptions`', () => {
  it('formats `PromptTemplateOptions` with `dedent` default', () => {
    const template = promptTemplate`
      0
        1
    `
    const prompt = template.format()

    expect(prompt).toBe('0\n  1')
  })

  it('formats `PromptTemplateOptions` with `dedent` explicit', () => {
    const template = promptTemplate({ dedent: true })`
      0
        1
    `
    const prompt = template.format()

    expect(prompt).toBe('0\n  1')
  })

  it('formats `PromptTemplateOptions` without `dedent`', () => {
    const template = promptTemplate({ dedent: false })`
      0
        1
    `
    const prompt = template.format()

    expect(prompt).toBe('\n      0\n        1\n    ')
  })

  it('formats `PromptTemplateOptions` with `dedent` multiple overrides', () => {
    const template = promptTemplate({ dedent: false })({ dedent: true })`
      0
        1
    `
    const prompt = template.format()

    expect(prompt).toBe('0\n  1')
  })
})
