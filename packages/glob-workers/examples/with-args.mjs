/**
npx glob-workers \
--glob 'examples/files/*.mjs' \
--worker 'examples/with-args.mjs' \
-- --foo --bar baz
*/

import * as util from 'node:util'

/**
 * @type {import('../dist/types').Worker}
 */
export default (options) => {
  const cli = util.parseArgs({
    args: options.args,
    options: {
      foo: { type: 'boolean' },
      bar: { type: 'string' },
    },
  })

  console.log(cli.values)
}
