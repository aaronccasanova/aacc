/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/sql_query/relevant_tables
npx tsx examples/langchain/hub/sql-query/relevant-tables.ts
*/
import '../../../env.js'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { promptTemplate } from 'prompt-utils'

import { toRunnableLambda } from '../../../langchain.js'

const sqlQueryRelevantTablesPromptTemplate = promptTemplate`
  Given the below question and list of potential tables, output a comma separated list of the table names that may be necessary to answer the question.

  Question: ${'question'}

  Table Names: ${'tableNames'}

  Relevant Table Names:
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(sqlQueryRelevantTablesPromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  question: 'How many posts did user 1 like?',
  tableNames: 'users, posts, comments, likes, follows',
})

console.log(completion)
// 'likes, users'
