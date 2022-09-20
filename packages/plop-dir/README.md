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

### Example templates directory:

```
plopfile.mjs
src/
templates/
|__ my-template/
   |-- {{kebabCase templateName}}.js
   |__ tests/
      |__ {{kebabCase templateName}}.test.js
```

### `plopfile.mjs`

`plop-dir` fits into your existing `plop` workflow

```mjs
import * as url from 'node:url'
import * as path from 'node:path'

import { plopDir } from 'plop-dir'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/** @param {import('plop').NodePlopAPI} plop */
export default async function run(plop) {
  plop.setGenerator(
    'my-template',
    await plopDir({
      plop,
      // Path to my-template templates
      templateDir: path.join(__dirname, './templates/my-template'),
      // Path to output my-template files
      outputDir: path.join(__dirname, './src'),
      // Override or extend the inferred prompts
      prompts: [
        {
          name: 'templateName',
          message: "What's the name of your template?",
        },
      ],
    }),
  )
}
```

> Note: Currently, `plopDir` is only supported in asynchronous `plopfile`s

### Example template file: `my-template/tests/{{kebabCase templateName}}.js`

```js
export default function {{camelCase testName}}() {
  return '{{pascalCase templateName}}'
}
```

`testName` is extracted from the file content (e.g.
`{{camelCase testName}}`) and included as a `plop` prompt

> See the [plop docs](https://plopjs.com/documentation/#case-modifiers) for all
> available case modifiers

### Run the `plop` CLI:

```sh
$ npm run plop my-template
Whats the name of your template? <answer>
Enter testName <answer>
✔  plop-dir successfully wrote files to <outputDir>
```

### That's it!

Aside from configuring the `templateDir` and `outputDir`, you choose whether or not to add custom prompt messages or opt for a "zero-config" approach where `plop-dir` generates prompts from the template file paths and content
