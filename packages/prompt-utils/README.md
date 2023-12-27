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

const prompt = brainstormPromptTemplate.format({
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

const prompt = brainstormPromptTemplate.format({
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

const catPrompt = brainstormPromptTemplate.format({})
//=> 'Brainstorm 3 superhero names for a cat.'

const dogPrompt = brainstormPromptTemplate.format({
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

By default, `promptTemplateResult.format()` will `dedent` the formatted prompt.
You can disable this behavior by passing `dedent: false` in the `Options`
object.

```ts
import { promptTemplate } from 'prompt-utils'

const brainstormPromptTemplate = promptTemplate({ dedent: false })`
  Brainstorm 3 superhero names for a ${'animal'}.
`

const brainstormPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
})
//=> '
//      Brainstorm 3 superhero names for a cat.
//   '
```

## API

### `promptTemplate`

A tagged template literal function that returns a
[`PromptTemplateResult`](#prompttemplateresult) or a new `promptTemplate` bound
to the provided [`PromptTemplateOptions`](#prompttemplateoptions) overrides.

```ts
const promptTemplateResult = promptTemplate`
  My prompt template with ${'inputVariableName'}.
`

const prompt = promptTemplateResult.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue.'
```

or

```ts
const newPromptTemplate = promptTemplate({ dedent: false })

const newPromptTemplateResult = newPromptTemplate`
  My prompt template with ${'inputVariableName'}.
`
//=> '
//      My prompt template with inputVariableValue.
//   '
```

> Note: The above is conventionally inlined:

```ts
const promptTemplateResult = promptTemplate({ dedent: false })`
  My prompt template with ${'inputVariableName'}.
`
```

### `PromptTemplateResult`

A `PromptTemplateResult` is returned from a [`promptTemplate`](#prompttemplate)
call. It contains a [`format`](#prompttemplateresultformat) method and the
`promptTemplate`'s tagged template literal arguments (i.e. `templateStrings` and
`inputVariables`) for advanced use cases.

```ts
const promptTemplateResult = promptTemplate`
  Default prompt template with ${'inputVariableName'} and ${{
  name: 'inputVariableConfig',
  default: 'inputVariableConfigDefault',
}}.
`

promptTemplateResult.templateStrings
//=> ['My prompt template with ', ' and ', '.']

promptTemplateResult.inputVariables
//=> ['inputVariableName', { name: 'inputVariableConfig', default: 'inputVariableConfigDefault' }]

const prompt = promptTemplateResult.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue and inputVariableConfigDefault.'
```

### `PromptTemplateResult.format`

The `PromptTemplateResult.format` method is returned from a
[`promptTemplate`](#prompttemplate) call and used to create the final prompt. It
accepts an `inputValues` object where each key corresponds to the
[`InputVariableName`](#inputvariablename),
[`InputVariableConfig.name`](#inputvariableconfig), and any nested
`promptTemplate` input variable names in the `promptTemplate`.

```ts
const nestedPromptTemplateResult = promptTemplate`
  Nested prompt template with ${'nestedInputVariableName'}.
`

const promptTemplateResult = promptTemplate`
  - Prompt template with ${'inputVariableName'}
  - Prompt template with ${{
    name: 'inputVariableConfig',
    default: 'inputVariableConfigDefault',
  }}
  - ${nestedPromptTemplateResult}
`

const inputValues = {
  inputVariableName: 'inputVariableValue',
  // inputVariableConfig: 'inputVariableConfigValue', // Optional
  nestedInputVariableName: 'nestedInputVariableValue',
}

const prompt = promptTemplateResult.format(inputValues)
//=> '- Prompt template with inputVariableValue
//    - Prompt template with inputVariableConfigDefault
//    - Nested prompt template with nestedInputVariableValue.'
```

### `PromptTemplateOptions`

A `PromptTemplateOptions` object is passed to a
[`promptTemplate`](#prompttemplate) call to override the default behavior of the
returned [`PromptTemplateResult`](#prompttemplateresult).

```ts
const promptTemplateOptions = {
  dedent: false,
}

const promptTemplateResult = promptTemplate(promptTemplateOptions)`
  My prompt template with ${'inputVariableName'}
`
```

> Note: Expect `PromptTemplateOptions` to be expanded in the future.

### `InputVariableName`

An `InputVariableName` is a string used to identify input variables in a
[`promptTemplate`](#prompttemplate) and establish a corresponding property in
the [`PromptTemplateResult.format`](#prompttemplateresultformat) `inputValues`.

```ts
const promptTemplateResult = promptTemplate`
  My prompt template with ${'inputVariableName'}
`

const prompt = promptTemplateResult.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue.'
```

### `InputVariableConfig`

An `InputVariableConfig` is an object used to identify input variables in a
[`promptTemplate`](#prompttemplate) and establish a corresponding property in
the [`PromptTemplateResult.format`](#prompttemplateresultformat) `inputValues`.
It also allows for additional configuration of the input variable.

```ts
const promptTemplateResult = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableName',
    default: 'inputVariableDefault',
    onFormat: (inputValue) => inputValue.toUpperCase(),
    schema: z.string().nonempty(),
  }}
`

const prompt = promptTemplateResult.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with INPUTVARIABLEVALUE.'
```

### `InputVariableConfig.name`

An `InputVariableConfig.name` is a string used to identify input variables in a
[`promptTemplate`](#prompttemplate) and establish a corresponding property in
the [`PromptTemplateResult.format`](#prompttemplateresultformat) input values.

```ts
const promptTemplateResult = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableName',
  }}
`

const prompt = promptTemplateResult.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue.'
```

### `InputVariableConfig.default`

An `InputVariableConfig.default` is a default value for an input variable in a
[`promptTemplate`](#prompttemplate) and allows the corresponding property in the
[`PromptTemplateResult.format`](#prompttemplateresultformat) `inputValues` to be
omitted.

```ts
const promptTemplateResult = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableName',
    default: 'inputVariableDefault',
  }}
`

const prompt = promptTemplateResult.format({})
//=> 'My prompt template with inputVariableDefault.'
```

### `InputVariableConfig.onFormat`

The `InputVariableConfig.onFormat` function is a callback used to provide custom
formatting for `inputValues` and is called when the
[`PromptTemplateResult.format`](#prompttemplateresultformat) method is called.

```ts
const promptTemplateResult = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableName',
    onFormat: (inputValue) => inputValue.toUpperCase(),
  }}
`

const prompt = promptTemplateResult.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with INPUTVARIABLEVALUE.'
```

### `InputVariableConfig.schema`

The `InputVariableConfig.schema` property accepts a Zod-like schema and is used
to validate [`PromptTemplateResult.format`](#prompttemplateresultformat)
`inputValues`.

```ts
const promptTemplateResult = promptTemplate`
  My prompt template with ${{
    name: 'inputVariableName',
    schema: z.string().nonempty(),
  }}
`

const prompt = promptTemplateResult.format({
  inputVariableName: 'inputVariableValue',
})
//=> 'My prompt template with inputVariableValue.'
```
