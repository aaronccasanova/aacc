import { command as execaCommand, Options, ExecaChildProcess } from 'execa'

type Expressions = (string | number)[]

function runSh(
  templates: TemplateStringsArray,
  expressions: Expressions,
  options?: Options,
): ExecaChildProcess<string> {
  const command = templates.reduce(
    (acc, template, i) => `${acc}${template}${expressions[i] ?? ''}`,
    '',
  )

  return execaCommand(command, options)
}

type ConfiguredSh = (
  templates: TemplateStringsArray,
  ...expressions: Expressions
) => ReturnType<typeof runSh>

type ShReturn<T> = T extends TemplateStringsArray
  ? ReturnType<typeof runSh>
  : ConfiguredSh

export function sh<T extends Options | TemplateStringsArray>(
  templatesOrOptions: T,
  ...expressions: Expressions
): ShReturn<T> {
  if (isTemplateStringsArray(templatesOrOptions)) {
    return runSh(templatesOrOptions, expressions) as ShReturn<T>
  }

  return createSh(templatesOrOptions) as ShReturn<T>
}

export function createSh(options: Options): ConfiguredSh {
  return function configuredSh(templates, ...expressions) {
    return runSh(templates, expressions, options)
  }
}

function isTemplateStringsArray(value: unknown): value is TemplateStringsArray {
  return Array.isArray(value)
}
