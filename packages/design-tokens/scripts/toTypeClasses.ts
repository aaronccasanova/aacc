import * as dt from 'designtokens.io'

import * as utils from './utils'

export interface ToTypeClassesOptions {
  indent?: string
  prefix?: string
  scopedClass?: string
}

export function toTypeClasses(
  designTokens: dt.DesignTokens,
  options?: ToTypeClassesOptions,
) {
  const prefix = options?.prefix ?? ''
  const scopedClass = options?.scopedClass ?? ''
  const indent = options?.indent ?? ' '.repeat(2)

  const typeClasses: string[] = []

  dt.traverse(designTokens, {
    onComposite: (composite, ctx) => {
      if (composite.$type !== 'typography') return

      const cssDeclarations = []

      for (const prop of Object.keys(composite.$value)) {
        const valuePath = [...ctx.path, prop]

        const cssProp = utils.toKebabCase(prop)
        const cssVar = `var(${dt.createCSSVar(valuePath, {
          prefix,
        })})`

        cssDeclarations.push(utils.createCSSDeclaration(cssProp, cssVar))
      }

      const compositeClass = utils.createCSSClass(`type-${ctx.name}`, {
        prefix,
      })

      const typeClass = `${scopedClass}${compositeClass}`

      typeClasses.push(
        [
          `${typeClass} {`,
          cssDeclarations.map((decl) => `${indent}${decl}`),
          '}',
        ]
          .flat()
          .join('\n'),
      )
    },
  })

  return typeClasses.join('\n\n')
}
