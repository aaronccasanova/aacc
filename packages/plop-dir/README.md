# plop-dir

Directory based file generator built on Plop. Simply point to a directory and
`plop-dir` will:

- Parse each file path and content for handlebars templates
- Extract prompt names from each template and generate a `plop` prompt config
- Upon answering the prompts, leverage the `plop` API to render each template

**Project goals:**

Spend less time configuring `plopfile`s and more time writing templates

## Installation

```sh
npm i -D plop plop-dir
```

## Usage

`plop-dir` fits into your existing `plop` workflow.

**`plopfile.mjs`**

```mjs
import * as url from 'node:url'
import * as path from 'node:path'

import { plopDir } from 'plop-dir'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/** @param {import('plop').NodePlopAPI} plop */
export default async function (plop) {
  plop.setGenerator(
    'my-generator',
    await plopDir({
      plop,
      templateDir: path.join(__dirname, './templates/my-generator'),
      outputDir: path.join(__dirname, './src'),
    }),
  )
}
```

> Note: Currently, `plopDir` is only supported in asynchronous `plopfile`s.

Example template directory:

```
plopfile.mjs
src/
templates/
|__ my-generator/
   |-- {{kebabCase extractedPrompt}}.js
   |__ tests/
      |__ {{kebabCase anotherPrompt}}.test.js
```

Example template file `{{kebabCase extractedPrompt}}.js`:

```js
export default function {{camelCase extractedPrompt}}() {
  return '{{sentenceCase anotherPrompt}}'
}
```

Run the `plop` CLI:

```sh
$ npx plop my-generator
Enter extractedPrompt: <answer>
Enter anotherPrompt: <answer>
✔  plop-dir successfully wrote files to <outputDir>
```
