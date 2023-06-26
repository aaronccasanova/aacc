/**
npx glob-workers \
--glob 'examples/files/*.mjs' \
--worker 'examples/basic-cjs.js'
*/

/**
 * @type {import('../dist/types').Worker}
 */
module.exports = (options) => {
  console.log(options)
}
