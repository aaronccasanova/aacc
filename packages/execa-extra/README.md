# execa-extra

[Execa](https://www.npmjs.com/package/execa) wrapper exposing tagged templates
APIs

## Installation

```sh
npm install execa-extra
```

## Usage

### Basic

```js
import { execaCommand } from 'execa-extra'

const { stdout } = await execaCommand`echo 'Hello world'`

console.log(stdout)
```

### With options

```js
import { execaCommand } from 'execa-extra'

await execaCommand({ stdio: 'inherit' })`echo 'Hello world'`
```

> See the
> [execaCommand](https://github.com/sindresorhus/execa#execacommandcommand-options)
> documentation for details on the available options

### With shell syntax

```js
import { execaCommand } from 'execa-extra'

await execaCommand({
  stdio: 'inherit',
  shell: true,
})`echo 'Hello world' | wc -w`
```

> See the
> [execaCommand](https://github.com/sindresorhus/execa#execacommandcommand-options)
> documentation for details on the available options

### Create `execaCommand` API with pre-configured options

```js
import { createExecaCommand } from 'execa-extra'

const execaCommand = createExecaCommand({ stdio: 'inherit', shell: true })

await execaCommand`echo 'Hello world' | wc -w`
```

> See the
> [execaCommand](https://github.com/sindresorhus/execa#execacommandcommand-options)
> documentation for details on the available options
