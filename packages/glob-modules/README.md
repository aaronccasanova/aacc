# glob-modules

Glob modules resolver for file convention based systems.

## Installation

```sh
npm install glob-modules
```

## Usage

The examples below assume the following directory structure:

```
src/
|-- main.js
|__ commands/
    |-- foo.js
    |-- bar.js
    |__ baz.txt
```

Where the modules are defined as follows:

```js
// src/commands/foo.js
export default 'foo'

// src/commands/bar.js
export default 'bar'
export const baz = 'baz'
```

### Example: Basic

```js
// src/main.js
import { globModules } from 'glob-modules'

const { commands } = await globModules('./commands/*.js', {
  importMeta: import.meta,
})
/*
commands === {
  foo: {
    default: 'foo',
  },
  bar: {
    default: 'bar',
    baz: 'baz',
  },
}
*/
```

### Example: TypeScript

```ts
// src/main.js
import { globModules } from 'glob-modules'

const { commands } = await globModules<{
  foo: string
  bar: { default: string; baz: string }
}>('./commands/*.js', { importMeta: import.meta })
```

### Example: Zod

```ts
import { globModules } from 'glob-modules'
import { z } from 'zod'

const { commands } = await globModules('./commands/*.js', {
  importMeta: import.meta,
  schema: z.object({
    foo: z.object({
      default: z.string(),
    }),
    bar: z.object({
      default: z.string(),
      baz: z.string(),
    }),
  }),
})
```
