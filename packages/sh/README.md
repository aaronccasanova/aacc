# @aacc/sh

[Execa](https://www.npmjs.com/package/execa) wrapper exposing a tagged templates
API for executing shell commands

## Installation

```sh
npm install @aacc/sh
```

## Usage

### Basic

```js
import { sh } from '@aacc/sh'

const { stdout } = await sh`echo 'Hello world'`

console.log(stdout)
```

### With options

```js
import { sh } from '@aacc/sh'

await sh({ stdio: 'inherit' })`echo 'Hello world'`
```

> See the
> [execaCommand](https://github.com/sindresorhus/execa#execacommandcommand-options)
> documentation for details on the available options

### With shell syntax

```js
import { sh } from '@aacc/sh'

await sh({ stdio: 'inherit', shell: true })`echo 'Hello world' | wc -w`
```

> See the
> [execaCommand](https://github.com/sindresorhus/execa#execacommandcommand-options)
> documentation for details on the available options

### Create `sh` API with pre-configured options

```js
import { createSh } from '@aacc/sh'

const sh = createSh({ stdio: 'inherit', shell: true })

await sh`echo 'Hello world' | wc -w`
```

> See the
> [execaCommand](https://github.com/sindresorhus/execa#execacommandcommand-options)
> documentation for details on the available options
