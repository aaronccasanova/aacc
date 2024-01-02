/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/qa/refine
npx tsx examples/langchain/hub/qa/refine.ts
*/
import '../../../env.js'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { promptTemplate, dedent } from 'prompt-utils'

import { toRunnableLambda } from '../../../langchain.js'

const qaRefinePromptTemplate = promptTemplate`
  The original question is as follows:
  ${'question'}

  We have provided an existing answer:
  ${'existingAnswer'}

  We have the opportunity to refine the existing answer (only if needed) with some more context below.
  ------------
  ${'context'}
  ------------
  Given the new context, refine the original answer to better answer the question. If the context isn't useful, return the original answer.
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(qaRefinePromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  question: 'How many square miles is California land area?',
  existingAnswer: "California's land area is 155,000 square miles.",
  context: dedent`
    Census data:
    California has a land area of 155,812.8 square miles and a water area of 7,837.9
    square miles. It is the 3rd largest state by area. California is bordered by
    Oregon, Arizona, and Nevada.

    Source:
    https://data.census.gov/profile/California?g=040XX00US06
  `,
})

console.log(completion)
// "California's land area is 155,812.8 square miles."
