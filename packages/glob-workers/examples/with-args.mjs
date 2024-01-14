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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    args: options.args,
    options: {
      foo: { type: 'boolean' },
      bar: { type: 'string' },
    },
  })

  console.log(cli.values)
}
