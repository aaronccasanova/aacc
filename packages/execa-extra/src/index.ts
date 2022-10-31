import { command, Options, ExecaChildProcess } from 'execa'

type Expressions = (string | number)[]

type ConfiguredExecaCommand = (
  templates: TemplateStringsArray,
  ...expressions: Expressions
) => ReturnType<typeof runExecaCommand>

type ExecaCommandResult<T> = T extends TemplateStringsArray
  ? ReturnType<typeof runExecaCommand>
  : ConfiguredExecaCommand

export function execaCommand<T extends Options | TemplateStringsArray>(
  templatesOrOptions: T,
  ...expressions: Expressions
): ExecaCommandResult<T> {
  if (isTemplateStringsArray(templatesOrOptions)) {
    return runExecaCommand(
      templatesOrOptions,
      expressions,
    ) as ExecaCommandResult<T>
  }

  return createExecaCommand(templatesOrOptions) as ExecaCommandResult<T>
}

export function createExecaCommand(options: Options): ConfiguredExecaCommand {
  return function configuredExecaCommand(templates, ...expressions) {
    return runExecaCommand(templates, expressions, options)
  }
}

function runExecaCommand(
  templates: TemplateStringsArray,
  expressions: Expressions,
  options?: Options,
): ExecaChildProcess<string> {
  return command(join(templates, expressions), options)
}

function join(templates: TemplateStringsArray, expressions: Expressions) {
  return templates.reduce(
    (acc, template, i) => `${acc}${template}${expressions[i] ?? ''}`,
    '',
  )
}

function isTemplateStringsArray(value: unknown): value is TemplateStringsArray {
  return Array.isArray(value)
}
