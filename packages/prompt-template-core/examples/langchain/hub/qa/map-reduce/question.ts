/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/qa/map_reduce/question
npx tsx examples/langchain/hub/qa/map-reduce/question.ts
*/
import '../../../../env.js'
import { promptTemplate } from '@prompt-template/core'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import dedent from 'dedent'

import { toRunnableLambda } from '../../../../langchain.js'

const qaMapReduceQuestionPromptTemplate = promptTemplate`
  Use the following portion of a long document to see if any of the text is relevant to answer the question.
  Return any relevant text verbatim.

  ${'context'}

  Question: ${'question'}

  Relevant text, if any:
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(qaMapReduceQuestionPromptTemplate)
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
// "California has a land area of 155,812.8 square miles."
