/**
npx tsx examples/basic-langchain/index.ts
*/
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'

import { promptTemplate } from '../../dist/types'
import { loadEnv } from '../env.js'
import { toRunnableLambda } from '../langchain.js'

loadEnv()

const brainstormPromptTemplate = promptTemplate`
  Brainstorm 3 superhero names for a ${'animal'}.
`

async function main() {
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
}

main().catch(console.error)
