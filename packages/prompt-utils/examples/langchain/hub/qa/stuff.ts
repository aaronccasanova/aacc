/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/qa/stuff
npx tsx examples/langchain/hub/qa/stuff.ts
*/
import '../../../env.js'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { promptTemplate, dedent } from 'prompt-utils'

import { toRunnableLambda } from '../../../langchain.js'

const qaStuffPromptTemplate = promptTemplate`
  Use the following context to answer the question at the end.
  If you don't know the answer, say that you don't know, don't try to make up an answer.


  ${'context'}


  Question: ${'question'}

  Helpful Answer:
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(qaStuffPromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  context: dedent`
    Census data:
    California has a land area of 155,812.8 square miles and a water area of 7,837.9
    square miles. It is the 3rd largest state by area. California is bordered by
    Oregon, Arizona, and Nevada.

    Source:
    https://data.census.gov/profile/California?g=040XX00US06
  `,
  question: 'How many square miles is California land area?',
})

console.log(completion)
// "California's land area is 155,812.8 square miles."
