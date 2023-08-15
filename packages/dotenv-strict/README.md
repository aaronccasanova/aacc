# dotenv-strict

`dotenv-strict` ensures that your environment variables are not only loaded but
also validated. It ensures that specific variables are present, otherwise, it
will throw an error.

Extending the well-known [dotenv](https://www.npmjs.com/package/dotenv) package,
`dotenv-strict` adds a layer of strictness to your application's environment
configuration. It's useful for making sure that essential environment variables
are always set.

## Installation

Since `dotenv` is a peer dependency, you'll need to install both `dotenv` and
`dotenv-strict`:

```sh
npm i dotenv dotenv-strict
```

## Usage

Use `dotenv-strict` the same way you'd use `dotenv`, but with an additional
`strict`` property to enforce required variables:

```ts
import { config } from 'dotenv-strict'

const env = config({ strict: ['FOO', 'BAR'] as const })

const foo = env.parsed.FOO // string
const bar = env.parsed.BAR // string
const baz = env.parsed.BAZ // string | undefined
```

Missing any of the `strict` variables will throw an error, providing you with
confidence that your environment is correctly configured.

For more detailed usage and customization, refer to the
[`dotenv` documentation](https://github.com/motdotla/dotenv#options).
