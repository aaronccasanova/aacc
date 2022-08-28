# Cross Runtime

Collection of cross runtime APIs and utilities e.g.

- Web Platform APIs
- File System APIs
- Runtime detection APIs
- etc

> Note: This is very much a work in progress and could break at any time.

## Installation

### Node.js

```bash
npm i cross-runtime
```

```js
// node hello.js
import * as cr from 'cross-runtime'

console.log(`Hello ${cr.getRuntime()}!`)
// Hello node!
```

### Deno

```jsonc
// import-map.json
{
  "imports": {
    "cross-runtime": "https://cdn.skypack.dev/cross-runtime"
  }
}
```

```js
// deno run hello.js
import * as cr from 'cross-runtime'

console.log(`Hello ${cr.getRuntime()}!`)
// Hello deno!
```

## APIs

The following APIs are available in all supported runtimes:

## `isDeno`

Detects if the current runtime is Deno

```ts
type isDeno = () => boolean
```

```ts
import * as cr from 'cross-runtime'

cr.isDeno() && console.log('Hello deno!')
```

## `isNode`

```ts
type isNode = () => boolean
```

Detects if the current runtime is Node.js

```ts
import * as cr from 'cross-runtime'

cr.isNode() && console.log('Hello node!')
```

## `getRuntime`

Returns the current runtime

```ts
type getRuntime = () => 'node' | 'deno' | 'unknown'
```

```js
import * as cr from 'cross-runtime'

console.log(`Hello ${cr.getRuntime()}!`)

// $ node get-runtime.js
// Hello node!

// $ deno run get-runtime.js
// Hello deno!
```

## `writeFile`

Cross runtime `writeFile` API inspired by the Node.js and Deno built-ins.

```ts
type writeFile = (
  path: string | URL,
  data: string,
  options?: { encoding?: 'utf-8'; append?: boolean; create?: boolean },
) => Promise<void>
```

```js
import * as cr from 'cross-runtime'

await cr.readFile(new URL('./hello.txt', import.meta.url), 'hello!')
```

## `readFile`

Cross runtime `readFile` API inspired by the Node.js and Deno built-ins.

```ts
type readFile = (
  path: string | URL,
  options?: { encoding?: 'utf-8' },
) => Promise<string>
```

```js
import * as cr from 'cross-runtime'

console.log(await cr.readFile(new URL('./hello.txt', import.meta.url)))
```
