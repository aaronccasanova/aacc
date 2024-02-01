/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/conversation
npx tsx examples/langchain/hub/conversation.ts
*/
import '../../env.js'
import { promptTemplate } from '@prompt-template/core'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import dedent from 'dedent'

import { toRunnableLambda } from '../../langchain.js'

const conversationPromptTemplate = promptTemplate`
  The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

  Current conversation:
  ${'history'}
  Human: ${'input'}
  AI:
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(conversationPromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  history: dedent`
    Human: What are 3 superhero names for a cat?
    AI: Whisker Warrior, Shadow Pounce, and Feline Flash.
    Human: What about a dog?
    AI: Bark Knight, Canine Crusader, and Mighty Mutt.
  `,
  input: 'How about a catdog?',
})

console.log(completion)
// 'Meow Mix Man, The Purrfect Pooch, and Crossbreed Crusader.'
