/**
npx tsx examples/langchain/basic.ts
*/
import '../env.js'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { promptTemplate } from 'prompt-utils'

import { toRunnableLambda } from '../langchain.js'

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${'animal'}.
`

const llm = new OpenAIChat({
  modelName: 'gpt-3.5-turbo-1106',
  verbose: true,
})

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(brainstormPromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  animal: 'cat',
})

console.log(completion)
