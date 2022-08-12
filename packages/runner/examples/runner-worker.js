const parse = require('@babel/parser').parse
const traverse = require('@babel/traverse').default

/**
 * @typedef {{
 *   lines: number
 *   imports: number
 * }} Result
 */

// /** @type {import('../dist/types/worker').Processor<Result>} */
/** @type {import('../dist/types/worker').Processor<void>} */
module.exports = (options) => {
  const result = {
    lines: 0,
    imports: 0,
  }

  result.lines += options.fileContent.split('\n').length

  try {
    const ast = parse(options.fileContent, {
      sourceType: 'module',
      plugins: [
        ['decorators', { decoratorsBeforeExport: true }],
        'jsx',
        'typescript',
      ],
    })

    traverse(ast, {
      ImportDeclaration(path) {
        // console.log('path:', path.node.specifiers)
        result.imports += path.node.specifiers.length
      },
    })
  } catch (error) {
    // console.error(`Skipping ${options.filePath}`)
  }

  // return result
}
