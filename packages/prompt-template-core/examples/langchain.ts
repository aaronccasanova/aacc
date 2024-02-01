import {
  PromptTemplate,
  PromptTemplateFormatInputValues,
  PromptTemplateInputVariable,
} from '@prompt-template/core'
import { RunnableLambda } from 'langchain/schema/runnable'

export function toRunnableLambda<T extends PromptTemplateInputVariable[]>(
  promptTemplate: PromptTemplate<T>,
) {
  return RunnableLambda.from<PromptTemplateFormatInputValues<T>, string>(
    (inputValues) => promptTemplate.format(inputValues),
  )
}
