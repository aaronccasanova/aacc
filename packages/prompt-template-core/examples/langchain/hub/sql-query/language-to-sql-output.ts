/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/sql_query/language_to_sql_output
npx tsx examples/langchain/hub/sql-query/language-to-sql-output.ts
*/
import '../../../env.js'
import { promptTemplate } from '@prompt-template/core'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'

import { toRunnableLambda } from '../../../langchain.js'

const sqlQueryLanguageToSQLOutputPromptTemplate = promptTemplate`
  Given an input question, first create a syntactically correct ${'dialect'} query to run, then look at the results of the query, and finally return the answer.
  Unless the user's question specifies a specific number of examples to obtain, always limit your query to at most ${'topK'} result(s) using the LIMIT clause.
  You can order the results by a relevant column to return the most interesting examples in the database.

  Use the following format:

  Question: "Question here"
  SQLQuery: "SQL Query to run"
  SQLResult: "Result of the SQLQuery"
  Answer: "Final answer here"

  Only use the following tables:
  ${'tableInfo'}

  Question: ${'question'}
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(sqlQueryLanguageToSQLOutputPromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  dialect: 'sqlite',
  topK: '1',
  tableInfo: 'users, posts, comments, likes, follows',
  question: 'How many posts did user 1 like?',
})

console.log(completion)
/*
SQLQuery:
SELECT COUNT(*)
FROM likes
WHERE user_id = 1;

SQLResult:
3

Answer: User 1 liked 3 posts.
*/
