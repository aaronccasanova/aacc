import {
  createCSSVar,
  createSCSSVar,
  cssVarCreator,
  scssVarCreator,
} from '../utils'

describe('createCSSVar', () => {
  it('transforms design token segments into css variable names', () => {
    const segments1 = ['foo']
    const segments2 = ['foo', 'bar']

    expect(createCSSVar(segments1)).toBe('--foo')
    expect(createCSSVar(segments2)).toBe('--foo-bar')

    expect(createCSSVar(segments1, { prefix: 'dt' })).toBe('--dt-foo')
    expect(createCSSVar(segments2, { prefix: 'dt' })).toBe('--dt-foo-bar')

    expect(createCSSVar(segments1, { delimiter: '_' })).toBe('--foo')
    expect(createCSSVar(segments2, { delimiter: '_' })).toBe('--foo_bar')

    expect(createCSSVar(segments1, { prefix: 'dt', delimiter: '_' })).toBe(
      '--dt_foo',
    )
    expect(createCSSVar(segments2, { prefix: 'dt', delimiter: '_' })).toBe(
      '--dt_foo_bar',
    )
  })
})

describe('cssVarCreator', () => {
  it('transforms design token segments into css variable names', () => {
    const segments1 = ['foo']
    const segments2 = ['foo', 'bar']

    const defaultCreate = cssVarCreator()

    expect(defaultCreate(segments1)).toBe('--foo')
    expect(defaultCreate(segments2)).toBe('--foo-bar')

    const prefixedCreate = cssVarCreator({ prefix: 'dt' })

    expect(prefixedCreate(segments1)).toBe('--dt-foo')
    expect(prefixedCreate(segments2)).toBe('--dt-foo-bar')

    const delimitedCreate = cssVarCreator({ delimiter: '_' })

    expect(delimitedCreate(segments1)).toBe('--foo')
    expect(delimitedCreate(segments2)).toBe('--foo_bar')

    const prefixedDelimitedCreate = cssVarCreator({
      prefix: 'dt',
      delimiter: '_',
    })

    expect(prefixedDelimitedCreate(segments1)).toBe('--dt_foo')
    expect(prefixedDelimitedCreate(segments2)).toBe('--dt_foo_bar')
  })
})

describe('createSCSSVar', () => {
  it('transforms design token segments into css variable names', () => {
    const segments1 = ['foo']
    const segments2 = ['foo', 'bar']

    expect(createSCSSVar(segments1)).toBe('$foo')
    expect(createSCSSVar(segments2)).toBe('$foo-bar')

    expect(createSCSSVar(segments1, { prefix: 'dt' })).toBe('$dt-foo')
    expect(createSCSSVar(segments2, { prefix: 'dt' })).toBe('$dt-foo-bar')

    expect(createSCSSVar(segments1, { delimiter: '_' })).toBe('$foo')
    expect(createSCSSVar(segments2, { delimiter: '_' })).toBe('$foo_bar')

    expect(createSCSSVar(segments1, { prefix: 'dt', delimiter: '_' })).toBe(
      '$dt_foo',
    )
    expect(createSCSSVar(segments2, { prefix: 'dt', delimiter: '_' })).toBe(
      '$dt_foo_bar',
    )
  })
})

describe('scssVarCreator', () => {
  it('transforms design token segments into css variable names', () => {
    const segments1 = ['foo']
    const segments2 = ['foo', 'bar']

    const defaultCreate = scssVarCreator()

    expect(defaultCreate(segments1)).toBe('$foo')
    expect(defaultCreate(segments2)).toBe('$foo-bar')

    const prefixedCreate = scssVarCreator({ prefix: 'dt' })

    expect(prefixedCreate(segments1)).toBe('$dt-foo')
    expect(prefixedCreate(segments2)).toBe('$dt-foo-bar')

    const delimitedCreate = scssVarCreator({ delimiter: '_' })

    expect(delimitedCreate(segments1)).toBe('$foo')
    expect(delimitedCreate(segments2)).toBe('$foo_bar')

    const prefixedDelimitedCreate = scssVarCreator({
      prefix: 'dt',
      delimiter: '_',
    })

    expect(prefixedDelimitedCreate(segments1)).toBe('$dt_foo')
    expect(prefixedDelimitedCreate(segments2)).toBe('$dt_foo_bar')
  })
})
