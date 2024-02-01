/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/llm_math
npx tsx examples/langchain/hub/llm-math.ts
*/
import '../../env.js'
import { promptTemplate } from '@prompt-template/core'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'

import { toRunnableLambda } from '../../langchain.js'

const llmMathPromptTemplate = promptTemplate`
  You are GPT-3, and you can't do math.

  You can do basic math, and your memorization abilities are impressive, but you can't do any complex calculations that a human could not do in their head. You also have an tendency to make up highly specific, but wrong answers.

  So we hooked you up to a Python 3 kernel, and now you can execute code. If anyone gives you a hard math problem, use this format and we'll take care of the rest:

  Question: (Question with hard calculation)
  Response:
  \`\`\`python
  (Code that prints what you need to know)
  \`\`\`
  \`\`\`output
  (Output of your code)
  \`\`\`
  Answer: (Answer)

  Otherwise, use this simpler format:

  Question: (Question without hard calculation)
  Response:
  Answer: (Answer)

  Begin.

  Question: What is 37593 * 67?
  Response:
  \`\`\`python
  print(37593 * 67)
  \`\`\`
  \`\`\`output
  2518731
  \`\`\`
  Answer: 2518731

  Question: ${'question'}
  Response:
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(llmMathPromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  question: 'What is 22 times 333 all raised to the 4th power',
})

console.log(completion)
/*
```python
print((22 * 333) ** 4)
```
```output
7949144729608409728
```
Answer: 7949144729608409728
*/
