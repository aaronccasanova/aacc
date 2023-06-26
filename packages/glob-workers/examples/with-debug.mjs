/**
npx glob-workers \
--glob 'examples/files/*.mjs' \
--worker 'examples/with-debug.mjs' \
--verbose
*/

/**
 * @type {import('../dist/types').Worker}
 */
export default (options) => {
  console.log(options)
}
