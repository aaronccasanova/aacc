/**
npx tsx examples/basic-openai/index.ts
*/
import { OpenAI } from 'openai'

import { promptTemplate } from '../..'
import { loadEnv } from '../env.js'

loadEnv()

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${'animal'}.
`

const brainstormPrompt = brainstormPromptTemplate.format({
  animal: 'cat',
})

console.log(brainstormPrompt)

async function main() {
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
}

main().catch(console.error)
