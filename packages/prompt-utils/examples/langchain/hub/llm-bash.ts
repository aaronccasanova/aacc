/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/llm_bash
npx tsx examples/langchain/hub/llm-bash.ts
*/
import '../../env.js'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { promptTemplate } from 'prompt-utils'

import { toRunnableLambda } from '../../langchain.js'

const llmBashPromptTemplate = promptTemplate`
  If someone asks you to perform a task, your job is to come up with a series of bash commands that will perform the task. There is no need to put "#!/bin/bash" in your answer. Make sure to reason step by step, using this format:

  Question: "copy the files in the directory named 'target' into a new directory at the same level as target called 'myNewDirectory'"

  I need to take the following actions:
  - List all files in the directory
  - Create a new directory
  - Copy the files from the first directory into the second directory

  \`\`\`bash
  ls
  mkdir myNewDirectory
  cp -r target/* myNewDirectory
  \`\`\`

  That is the format. Begin!

  Question: ${'question'}
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(llmBashPromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  question:
    'Find all package.json files in the current directory and all subdirectories and print their location of they contain "prompt-utils".',
})

console.log(completion)
// 'find . -name "package.json" -exec grep -l "prompt-utils" {} \;'
