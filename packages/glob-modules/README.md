# glob-modules

Glob modules resolver for file convention based systems.

## Installation

```sh
npm install glob-modules
```

## Usage

**Example directory structure:**

```
src/
|-- main.js
|__ commands/
    |-- foo.js
    |-- bar.js
    |__ baz.txt
```

```js
// src/commands/foo.js
export default 'foo'

// src/commands/bar.js
export default 'bar'
export const baz = 'baz'

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
