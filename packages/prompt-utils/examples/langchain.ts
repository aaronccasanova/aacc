import { RunnableLambda } from 'langchain/schema/runnable'

import {
  PromptTemplate,
  PromptTemplateFormatInputValues,
  PromptTemplateInputVariable,
} from '..'

export function toRunnableLambda<T extends PromptTemplateInputVariable[]>(
  promptTemplate: PromptTemplate<T>,
) {
  return RunnableLambda.from<PromptTemplateFormatInputValues<T>, string>(
    (inputValues) => promptTemplate.format(inputValues),
  )
}
