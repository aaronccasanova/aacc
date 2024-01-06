# prompt-utils

A collection of LLM prompt utilities, primarily centered around the
`promptTemplate` module. Key features include:

- **Type Safety:** Ensures `promptTemplate` input variables are defined and
  formatted correctly at compile time.
- **Modular Design:** Supports nested `promptTemplate`s to promote organization
  and reusability.
- **Intuitive Authoring:** Simplifies prompt creation by solely defining input
  variables in `promptTemplate`s.
- **Community Prompts:** Designed with the vision of creating and sharing
  `promptTemplate`s with the community (as NPM packages for example).

## Installation

```sh
npm i prompt-utils
```

## Usage

### [`promptTemplate`](#prompttemplate) with [`InputVariableName`](#inputvariablename)

```ts
import { promptTemplate } from 'prompt-utils'

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${'animal'}.
`

const brainstormPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 superhero names for a cat.'
```

### [`promptTemplate`](#prompttemplate) with [`InputVariableConfig.onFormat`](#inputvariableconfigonformat)

```ts
import { promptTemplate } from 'prompt-utils'

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${{
    name: 'animal',
    onFormat: (inputValue) => inputValue.toUpperCase(),
  }}.
`

const brainstormPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 superhero names for a CAT.'
```

### [`promptTemplate`](#prompttemplate) with [`InputVariableConfig.schema`](#inputvariableconfigschema)

```ts
import { promptTemplate } from 'prompt-utils'
import { z } from 'zod'

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${{
    name: 'animal',
    schema: z.string().nonempty(),
  }}.
`

const brainstormPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 superhero names for a cat.'
```

### [`promptTemplate`](#prompttemplate) with [`InputVariableConfig.default`](#inputvariableconfigdefault)

```ts
import { promptTemplate } from 'prompt-utils'

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${{
    name: 'animal',
    default: 'cat',
  }}.
`

const catBrainstormPrompt = brainstormPromptTemplate.format({})
//=> 'Brainstorm 3 superhero names for a cat.'

const dogBrainstormPrompt = brainstormPromptTemplate.format({
  animal: 'dog',
})
//=> 'Brainstorm 3 superhero names for a dog.'
```

### [`promptTemplate`](#prompttemplate) with nested [`promptTemplate`](#prompttemplate)

```ts
import { promptTemplate } from 'prompt-utils'

const outputFormatPromptTemplate = promptTemplate`
  Format the output as ${{
    name: 'format',
    default: 'bullet points',
  }}.
`

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${'animal'}.
  ${outputFormatPromptTemplate}
`

const bulletPointsPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 superhero names for a cat.
//    Format the output as bullet points.'

const numberedListPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
  format: 'a numbered list',
})
//=> 'Brainstorm 3 superhero names for a cat.
//    Format the output as a numbered list.'
```

### [`promptTemplate`](#prompttemplate) with [`PromptTemplateOptions`](#prompttemplateoptions)

```ts
import { promptTemplate } from 'prompt-utils'

const userPromptTemplate = promptTemplate({ prefix: 'user: ' })`
  Brainstorm 3 superhero names for a ${'animal'}.
`

const userPrompt = userPromptTemplate.format({
  animal: 'cat',
})
//=> 'user: Brainstorm 3 superhero names for a cat.'
```

> Note: By default, [`format`](#formatinputvalues) will `dedent` the formatted
> prompt. You can disable this behavior by setting the `dedent` option to
> `false`.

## API

### `promptTemplate`

A tagged template literal function that returns a
[`PromptTemplate`](#prompttemplate-class) instance or a new `promptTemplate`
bound to the provided [`PromptTemplateOptions`](#prompttemplateoptions)
overrides.

```ts
const myPromptTemplate = promptTemplate`
  My prompt template with ${'inputVariableName'}.
`

const myPrompt = myPromptTemplate.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue.'
```

or

```ts
const userPromptTemplate = promptTemplate({ prefix: 'user: ' })

const myUserPromptTemplate = userPromptTemplate`
  My prompt template with ${'inputVariableName'}.
`

const myUserPrompt = myUserPromptTemplate.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'user: My prompt template with inputVariableValue.'
```

> Note: The above is conventionally inlined:

```ts
const userPromptTemplate = promptTemplate({ prefix: 'user: ' })`
  My prompt template with ${'inputVariableName'}.
`

const userPrompt = userPromptTemplate.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'user: My prompt template with inputVariableValue.'
```

### `PromptTemplate` Class

A `PromptTemplate` instance is returned from a
[`promptTemplate`](#prompttemplate) call. It contains a
[`format`](#formatinputvalues) method for creating the final prompt and
additional properties/methods for advanced use cases.

```ts
const myPromptTemplate = promptTemplate`
  My prompt template with ${'inputVariableName'} and default ${{
  name: 'inputVariableConfigName',
  default: 'inputVariableConfigDefault',
}}.
`

myPromptTemplate.templateStrings
//=> ['My prompt template with ', ' and default ', '.']

myPromptTemplate.inputVariables
//=> ['inputVariableName', { name: 'inputVariableConfigName', default: 'inputVariableConfigDefault' }]

const myPrompt = myPromptTemplate.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue and default inputVariableConfigDefault.'
```

### `format(inputValues)`

A [`PromptTemplate`](#prompttemplate-class) instance method used to create the
final prompt. It accepts an `inputValues` object where each key corresponds to
the [`InputVariableName`](#inputvariablename),
[`InputVariableConfig.name`](#inputvariableconfig), and any nested
`PromptTemplate` instance input variable names.

```ts
const myNestedPromptTemplate = promptTemplate`
  My nested prompt template with ${'nestedInputVariableName'}.
`

const myPromptTemplate = promptTemplate`
  - My prompt template with ${'inputVariableName'}
  - My prompt template with ${{
    name: 'inputVariableConfigName',
    default: 'inputVariableConfigDefault',
  }}
  - ${myNestedPromptTemplate}
`

const inputValues = {
  inputVariableName: 'inputVariableValue',
  // inputVariableConfigName: 'inputVariableConfigValue', // Optional
  nestedInputVariableName: 'nestedInputVariableValue',
}

const myPrompt = myPromptTemplate.format(inputValues)
//=> '- My prompt template with inputVariableValue
//    - My prompt template with inputVariableConfigDefault
//    - My nested prompt template with nestedInputVariableValue.'
```

### `getInputVariableNames()`

A [`PromptTemplate`](#prompttemplate-class) instance method that recursively
extracts and deduplicates all input variable names.

```ts
const myNestedPromptTemplate = promptTemplate`
  My nested prompt template with ${'nestedInputVariableName'}.
`

const myPromptTemplate = promptTemplate`
  - My prompt template with ${'inputVariableName'}.
  - My prompt template with ${{
    name: 'inputVariableConfigName',
    default: 'inputVariableConfigDefault',
  }}.
  - ${myNestedPromptTemplate}
`

myPromptTemplate.getInputVariableNames()
//=> ['inputVariableName', 'inputVariableConfigName', 'nestedInputVariableName']
```

### `getInputVariableNamesRequired()`

A [`PromptTemplate`](#prompttemplate-class) instance method that recursively
extracts and deduplicates all required input variable names.

```ts
const myNestedPromptTemplate = promptTemplate`
  My nested prompt template with ${'nestedInputVariableName'}.
`

const myPromptTemplate = promptTemplate`
  - My prompt template with ${'inputVariableName'}.
  - My prompt template with ${{
    name: 'inputVariableConfigName',
    default: 'inputVariableConfigDefault',
  }}.
  - ${myNestedPromptTemplate}
`

myPromptTemplate.getInputVariableNamesRequired()
//=> ['inputVariableName', 'nestedInputVariableName']
```

### `getInputVariableNamesOptional()`

A [`PromptTemplate`](#prompttemplate-class) instance method that recursively
extracts and deduplicates all optional input variable names.

```ts
const myNestedPromptTemplate = promptTemplate`
  My nested prompt template with ${'nestedInputVariableName'}.
`

const myPromptTemplate = promptTemplate`
  - My prompt template with ${'inputVariableName'}.
  - My prompt template with ${{
    name: 'inputVariableConfigName',
    default: 'inputVariableConfigDefault',
  }}.
  - ${myNestedPromptTemplate}
`

myPromptTemplate.getInputVariableNamesOptional()
//=> ['inputVariableConfigName']
```

> Important: If input variable names are duplicated and one is required and the
> other is optional, the input variable name is considered required.

```ts
const myPromptTemplate = promptTemplate`
  My duplicate prompt template with ${'duplicateInputVariableName'} and ${{
  name: 'duplicateInputVariableName',
  default: 'duplicateInputVariableNameDefault',
}}.
`

myPromptTemplate.getInputVariableNamesRequired()
//=> ['duplicateInputVariableName']

myPromptTemplate.getInputVariableNamesOptional()
//=> []
```

### `PromptTemplateOptions`

A `PromptTemplateOptions` object is passed to a
[`promptTemplate`](#prompttemplate) call to override the default behavior of a
[`PromptTemplate`](#prompttemplate-class) instance.

```ts
const promptTemplateOptions = {
  prefix: 'prefix - ',
  suffix: ' - suffix',
  dedent: true, // Default
}

const myPromptTemplate = promptTemplate(promptTemplateOptions)`
  My prompt template with ${'inputVariableName'}
`

const myPrompt = myPromptTemplate.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'prefix - My prompt template with inputVariableValue - suffix'
```

### `InputVariableName`

An `InputVariableName` is a string used to identify input variables in a
[`promptTemplate`](#prompttemplate) and establish a corresponding property in
the [`format`](#formatinputvalues) `inputValues`.

```ts
const myPromptTemplate = promptTemplate`
  My prompt template with ${'inputVariableName'}
`

const myPrompt = myPromptTemplate.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue.'
```

### `InputVariableConfig`

An `InputVariableConfig` is an object used to identify input variables in a
[`promptTemplate`](#prompttemplate) and establish a corresponding property in
the [`format`](#formatinputvalues) `inputValues`. It also allows for additional
configuration of the input variable.

```ts
const myPromptTemplate = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableConfigName',
    default: 'inputVariableConfigDefault',
    onFormat: (inputValue) => inputValue.toUpperCase(),
    schema: z.string().nonempty(),
  }}
`

const myPrompt = myPromptTemplate.format({
  inputVariableConfigName: 'inputVariableConfigValue',
})
//=> 'My prompt template with INPUTVARIABLECONFIGVALUE.'
```

### `InputVariableConfig.name`

An `InputVariableConfig.name` is a string used to identify input variables in a
[`promptTemplate`](#prompttemplate) and establish a corresponding property in
the [`format`](#formatinputvalues) input values.

```ts
const myPromptTemplate = promptTemplate`
  My prompt template with ${{ name: 'inputVariableConfigName' }}.
`

const myPrompt = myPromptTemplate.format({
  inputVariableConfigName: 'inputVariableConfigValue',
})
//=> 'My prompt template with inputVariableConfigValue.'
```

### `InputVariableConfig.default`

An `InputVariableConfig.default` is a default value for an input variable in a
[`promptTemplate`](#prompttemplate) and allows the corresponding property in the
[`format`](#formatinputvalues) `inputValues` to be omitted.

```ts
const myPromptTemplate = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableConfigName',
    default: 'inputVariableConfigDefault',
  }}
`

const myPrompt = myPromptTemplate.format({})
//=> 'My prompt template with inputVariableConfigDefault.'
```

### `InputVariableConfig.onFormat`

The `InputVariableConfig.onFormat` function is a callback used to provide custom
formatting for `inputValues` and is called when the
[`format`](#formatinputvalues) method is called.

```ts
const myPromptTemplate = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableConfigName',
    onFormat: (inputValue) => inputValue.toUpperCase(),
  }}
`

const myPrompt = myPromptTemplate.format({
  inputVariableConfigName: 'inputVariableConfigValue',
})
//=> 'My prompt template with INPUTVARIABLECONFIGVALUE.'
```

### `InputVariableConfig.schema`

The `InputVariableConfig.schema` property accepts a Zod-like schema and is used
to validate [`format`](#formatinputvalues) `inputValues`.

```ts
const myPromptTemplate = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableConfigName',
    schema: z.string().nonempty(),
  }}.
`

const myPrompt = myPromptTemplate.format({
  inputVariableConfigName: 'inputVariableConfigValue',
})
//=> 'My prompt template with inputVariableConfigValue.'
```

### Text Transforms

The following text transforms are simply a re-export of
[change-case](https://npmjs.com/package/change-case) and
[title-case](https://npmjs.com/package/title-case) with support for ESM and CJS.

- **caseCamel**
- **caseCapital**
- **caseConstant**
- **caseDot**
- **caseKebab**
- **caseNo**
- **casePascal**
- **casePascalSnake**
- **casePath**
- **caseSentence**
- **caseSnake**
- **caseTrain**
- **caseTitle**

> Note: Each transform has been renamed in reverse order to improve autocomplete
> behavior and discovery.

```ts
import { promptTemplate, caseCapital } from 'prompt-utils'

const myPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${{
    name: 'animal',
    onFormat: caseCapital,
  }}
`

const myPrompt = myPromptTemplate.format({
  inputVariableName: 'cat',
})
//=> 'Brainstorm 3 superhero names for a Cat.'
```

Additionally, the [`dedent`](https://npmjs.com/package/dedent) module is
re-exported from `prompt-utils`.

```ts
import { promptTemplate, dedent } from 'prompt-utils'

const chatPromptTemplate = promptTemplate`
  You are a friendly chatbot.

  Conversation:
  ${'history'}
  Human: ${'question'}
  AI:
`

const chatPrompt = chatPromptTemplate.format({
  history: dedent`
    Human: Brainstorm 3 superhero names for a cat.
    AI: Whisker Warrior, Shadow Pounce, and Feline Flash.
  `,
  question: 'What about a dog?',
})
//=> 'You are a friendly chatbot named Chatty.
//
//    Conversation:
//    Human: Brainstorm 3 superhero names for a cat.
//    AI: Whisker Warrior, Shadow Pounce, and Feline Flash.
//    Human: What about a dog?
//    AI:'
```
