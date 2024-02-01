/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/api/api_response
npx tsx examples/langchain/hub/api/api-response.ts
*/
import '../../../env.js'
import { promptTemplate } from '@prompt-template/core'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import dedent from 'dedent'

import { toRunnableLambda } from '../../../langchain.js'

const apiResponsePromptTemplate = promptTemplate`
  You are given the below API Documentation:
  ${'apiDocs'}

  Using this documentation, generate the full API URL to call for answering the user question.
  You should build the API URL in order to get a response that is as short as possible, while still getting the necessary information to answer the question. Pay attention to deliberately exclude any unnecessary pieces of data in the API call.

  Question:
  ${'question'}

  API URL:
  ${'apiURL'}

  Here is the response from the API:
  ${'apiResponse'}

  Summarize this response to answer the original question.

  Summary:
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(apiResponsePromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  question: 'What is the title of the post with id 5?',
  apiURL: 'https://jsonplaceholder.typicode.com/posts/5',
  apiDocs: dedent`
    ## Resources

    JSONPlaceholder comes with a set of 6 common resources:

    /posts     100 posts
    /comments  500 comments
    /albums    100 albums
    /photos    5000 photos
    /todos     200 todos
    /users     10 users

    **Note:** resources have relations. For example: posts have many comments, albums have many photos, ... see [guide](https://jsonplaceholder.typicode.com/guide) for the full list.

    ## Routes

    All HTTP methods are supported. You can use http or https for your requests.

    GET     /posts
    GET     /posts/1
    GET     /posts/1/comments
    GET     /comments?postId=1
    POST    /posts
    PUT     /posts/1
    PATCH   /posts/1
    DELETE  /posts/1
  `,
  apiResponse: dedent`
    {
      "userId": 1,
      "id": 5,
      "title": "nesciunt quas odio",
      "body": "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
    }
  `,
})

console.log(completion)
// 'The title of the post with id 5 is "nesciunt quas odio".'
