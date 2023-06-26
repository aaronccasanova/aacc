/**
npx glob-workers \
--glob 'examples/files/*.mjs' \
--worker 'examples/basic.mjs'
*/

/**
 * @type {import('../dist/types').Worker}
 */
export default (options) => {
  console.log(options)
}
