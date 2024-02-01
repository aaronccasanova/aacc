/**
Derived from https://github.com/hwchase17/langchain-hub/tree/master/prompts/memory/summarize
npx tsx examples/langchain/hub/memory/summarize.ts
*/
import '../../../env.js'
import { promptTemplate } from '@prompt-template/core'
import { OpenAIChat } from 'langchain/llms/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import dedent from 'dedent'

import { toRunnableLambda } from '../../../langchain.js'

const memorySummarizePromptTemplate = promptTemplate`
  Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary.

  EXAMPLE
  Current summary:
  The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good.

  New lines of conversation:
  Human: Why do you think artificial intelligence is a force for good?
  AI: Because artificial intelligence will help humans reach their full potential.

  New summary:
  The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good because it will help humans reach their full potential.
  END OF EXAMPLE

  Current summary:
  ${'summary'}

  New lines of conversation:
  ${'newLines'}

  New summary:
`

const llm = new OpenAIChat({ modelName: 'gpt-3.5-turbo-1106' })

const outputParser = new StringOutputParser()

const chain = toRunnableLambda(memorySummarizePromptTemplate)
  .pipe(llm)
  .pipe(outputParser)

const completion = await chain.invoke({
  summary:
    'The human asks for 3 superhero names for a cat. The AI provides the superhero names Whisker Warrior, Shadow Pounce, and Feline Flash.',
  newLines: dedent`
    Human: What about a dog?
    AI: Bark Knight, Canine Crusader, and Mighty Mutt.
  `,
})

console.log(completion)
// The human asks for 3 superhero names for a cat. The AI provides the superhero names Whisker Warrior, Shadow Pounce, and Feline Flash. When asked about superhero names for a dog, the AI suggests Bark Knight, Canine Crusader, and Mighty Mutt.
