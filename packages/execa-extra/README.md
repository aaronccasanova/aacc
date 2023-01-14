# execa-extra

[Execa](https://www.npmjs.com/package/execa) wrapper exposing tagged templates
APIs

## Installation

```sh
npm install execa-extra
```

## Usage

### `$` API

```js
import { $ } from 'execa-extra'

const { stdout } = await $`echo 'Hello world'`

console.log(stdout)
```

### `$.sync` API

```js
import { $ } from 'execa-extra'

const { stdout } = $.sync`echo 'Hello world'`

console.log(stdout)
```

### With options

```js
import { $ } from 'execa-extra'

await $({ stdio: 'inherit' })`echo 'Hello world'`
```

> See the [execa](https://github.com/sindresorhus/execa#options) documentation
> for details on the available options

### With shell syntax

```js
import { $ } from 'execa-extra'

await $({ stdio: 'inherit', shell: true })`echo 'Hello world' | wc -w`
```

> See the [execa](https://github.com/sindresorhus/execa#options) documentation
> for details on the available options

### With pre-configured options

```js
import { $ } from 'execa-extra'

const my$ = $({ stdio: 'inherit', shell: true })

await my$`echo 'Hello world' | wc -w`
```

> See the [execa](https://github.com/sindresorhus/execa#options) documentation
> for details on the available options
