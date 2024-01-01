/**
npx tsx examples/basic-openai/index.ts
*/
import '../env'
import { OpenAI } from 'openai'

import { promptTemplate } from 'prompt-utils'

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${'animal'}.
`

const brainstormPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
})

console.log(brainstormPrompt)
// 'Brainstorm 3 superhero names for a cat.'

const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo-1106',
  messages: [
    {
      role: 'user',
      content: brainstormPrompt,
    },
  ],
})

console.log(completion.choices[0]?.message.content)
