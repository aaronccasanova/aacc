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

### `promptTemplate` with `InputVariableName`

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

### `promptTemplate` with `InputVariableConfig` and `onFormat`

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

### `promptTemplate` with `InputVariableConfig` and `schema`

```ts
import { promptTemplate } from 'prompt-utils'
import { z } from 'zod'

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${{
    name: 'animal',
    schema: z.string().nonempty(),
  }}.
`

const prompt = brainstormPromptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 superhero names for a cat.'
```

### `promptTemplate` with `InputVariableConfig` and `default`

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

### `promptTemplate` with nested `promptTemplate`

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

const bulletPointsPrompt = brainstormWithFormatPromptTemplate.format({
  animal: 'cat',
})
//=> 'Brainstorm 3 superhero names for a cat.
//    Format the output as bullet points.'

const numberedListPrompt = brainstormWithFormatPromptTemplate.format({
  animal: 'cat',
  format: 'a numbered list',
})
//=> 'Brainstorm 3 superhero names for a cat.
//    Format the output as a numbered list.'
```

### `promptTemplate` with `Options`

By default, `promptTemplateResult.format()` will `dedent` the formatted prompt.
You can disable this behavior by passing `dedent: false` in the `Options`
object.

```ts
import { promptTemplate } from 'prompt-utils'

const brainstormPromptTemplate = promptTemplate({ dedent: false })`
  Brainstorm 3 superhero names for a ${'animal'}.
`

const prompt = brainstormPromptTemplate.format({
  animal: 'cat',
})
//=> '
//      Brainstorm 3 superhero names for a cat.
//   '
```
