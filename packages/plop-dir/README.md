# plop-dir

Directory based file generator built on
[plop](https://www.npmjs.com/package/plop). Simply point to a directory and
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

`plop-dir` fits into your existing `plop` workflow

**`plopfile.mjs`**

```mjs
import * as url from 'node:url'
import * as path from 'node:path'

import { plopDir } from 'plop-dir'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/** @param {import('plop').NodePlopAPI} plop */
export default async function run(plop) {
  plop.setGenerator(
    'my-generator',
    await plopDir({
      plop,
      // Path to my-generator templates
      templateDir: path.join(__dirname, './templates/my-generator'),
      // Path to output my-generator files
      outputDir: path.join(__dirname, './src'),
      // Override or extend the inferred prompts
      prompts: [
        {
          name: 'generatorName',
          message: "What's the name of the generator?",
        },
      ],
    }),
  )
}
```

> Note: Currently, `plopDir` is only supported in asynchronous `plopfile`s

Example template directory:

> See the [plop docs](https://plopjs.com/documentation/#case-modifiers) for all
> available case modifiers

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

> See the [plop docs](https://plopjs.com/documentation/#case-modifiers) for all
> available case modifiers

```js
export default function {{camelCase extractedPrompt}}() {
  return '{{sentenceCase anotherPrompt}}'
}
```

Run the `plop` CLI:

```sh
$ npm run plop my-generator
Enter extractedPrompt: <answer>
Enter anotherPrompt: <answer>
✔  plop-dir successfully wrote files to <outputDir>
```
