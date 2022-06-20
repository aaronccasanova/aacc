import {
  createCSSVar,
  createSCSSVar,
  cssVarCreator,
  scssVarCreator,
} from '../utils'

describe('createCSSVar', () => {
  it('transforms a design token path into css variable names', () => {
    const path1 = ['foo']
    const path2 = ['foo', 'bar']

    expect(createCSSVar(path1)).toBe('--foo')
    expect(createCSSVar(path2)).toBe('--foo-bar')

    expect(createCSSVar(path1, { prefix: 'dt' })).toBe('--dt-foo')
    expect(createCSSVar(path2, { prefix: 'dt' })).toBe('--dt-foo-bar')

    expect(createCSSVar(path1, { delimiter: '_' })).toBe('--foo')
    expect(createCSSVar(path2, { delimiter: '_' })).toBe('--foo_bar')

    expect(createCSSVar(path1, { prefix: 'dt', delimiter: '_' })).toBe(
      '--dt_foo',
    )
    expect(createCSSVar(path2, { prefix: 'dt', delimiter: '_' })).toBe(
      '--dt_foo_bar',
    )
  })
})

describe('cssVarCreator', () => {
  it('transforms a design token path into css variable names', () => {
    const path1 = ['foo']
    const path2 = ['foo', 'bar']

    const defaultCreate = cssVarCreator()

    expect(defaultCreate(path1)).toBe('--foo')
    expect(defaultCreate(path2)).toBe('--foo-bar')

    const prefixedCreate = cssVarCreator({ prefix: 'dt' })

    expect(prefixedCreate(path1)).toBe('--dt-foo')
    expect(prefixedCreate(path2)).toBe('--dt-foo-bar')

    const delimitedCreate = cssVarCreator({ delimiter: '_' })

    expect(delimitedCreate(path1)).toBe('--foo')
    expect(delimitedCreate(path2)).toBe('--foo_bar')

    const prefixedDelimitedCreate = cssVarCreator({
      prefix: 'dt',
      delimiter: '_',
    })

    expect(prefixedDelimitedCreate(path1)).toBe('--dt_foo')
    expect(prefixedDelimitedCreate(path2)).toBe('--dt_foo_bar')
  })
})

describe('createSCSSVar', () => {
  it('transforms a design token path into css variable names', () => {
    const path1 = ['foo']
    const path2 = ['foo', 'bar']

    expect(createSCSSVar(path1)).toBe('$foo')
    expect(createSCSSVar(path2)).toBe('$foo-bar')

    expect(createSCSSVar(path1, { prefix: 'dt' })).toBe('$dt-foo')
    expect(createSCSSVar(path2, { prefix: 'dt' })).toBe('$dt-foo-bar')

    expect(createSCSSVar(path1, { delimiter: '_' })).toBe('$foo')
    expect(createSCSSVar(path2, { delimiter: '_' })).toBe('$foo_bar')

    expect(createSCSSVar(path1, { prefix: 'dt', delimiter: '_' })).toBe(
      '$dt_foo',
    )
    expect(createSCSSVar(path2, { prefix: 'dt', delimiter: '_' })).toBe(
      '$dt_foo_bar',
    )
  })
})

describe('scssVarCreator', () => {
  it('transforms a design token path into css variable names', () => {
    const path1 = ['foo']
    const path2 = ['foo', 'bar']

    const defaultCreate = scssVarCreator()

    expect(defaultCreate(path1)).toBe('$foo')
    expect(defaultCreate(path2)).toBe('$foo-bar')

    const prefixedCreate = scssVarCreator({ prefix: 'dt' })

    expect(prefixedCreate(path1)).toBe('$dt-foo')
    expect(prefixedCreate(path2)).toBe('$dt-foo-bar')

    const delimitedCreate = scssVarCreator({ delimiter: '_' })

    expect(delimitedCreate(path1)).toBe('$foo')
    expect(delimitedCreate(path2)).toBe('$foo_bar')

    const prefixedDelimitedCreate = scssVarCreator({
      prefix: 'dt',
      delimiter: '_',
    })

    expect(prefixedDelimitedCreate(path1)).toBe('$dt_foo')
    expect(prefixedDelimitedCreate(path2)).toBe('$dt_foo_bar')
  })
})
