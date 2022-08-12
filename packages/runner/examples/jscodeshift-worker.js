const parse = require('@babel/parser').parse
const traverse = require('@babel/traverse').default

/**
 * @typedef {{
 *   lines: number
 *   imports: number
 * }} Result
 */

/** @type {(options: {path: string; source: string;}) => void} */
module.exports = (options) => {
  const result = {
    lines: 0,
    imports: 0,
  }

  result.lines += options.source.split('\n').length

  try {
    const ast = parse(options.source, {
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

  // IMPORTANT:
  // Do not add a return to this function.. or else..
}
