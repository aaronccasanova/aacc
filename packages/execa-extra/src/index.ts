import { command, Options, ExecaChildProcess } from 'execa'

type Expressions = (string | number)[]

type TemplatesOrOptions = TemplateStringsArray | Options<string | null>
type Expression = string | number | Array<string | number>

type $Result<T extends TemplatesOrOptions> = T extends TemplateStringsArray
  ? ExecaChildProcess
  : (
      templates: TemplateStringsArray,
      ...expressions: Expression[]
    ) => T extends { encoding: null }
      ? ExecaChildProcess<Buffer>
      : ExecaChildProcess

type ExecaCommandResult<T> = T extends TemplateStringsArray
  ? ReturnType<typeof runExecaCommand>
  : ConfiguredExecaCommand

export function $<T extends TemplatesOrOptions>(
  templatesOrOptions: T,
  ...expressions: Expression[]
): $Result<T> {
  if (isTemplateStringsArray(templatesOrOptions)) {
    const [file = '', ...args] = parseTemplates(templatesOrOptions, expressions)
    return execa(file, args) as $Result<T>
  }

  return ((templates, ...innerExpressions) => {
    const [file = '', ...args] = parseTemplates(templates, innerExpressions)
    return execa(
      file,
      args,
      // @ts-expect-error - Execa types do allow `null` for `encoding`
      templatesOrOptions,
    )
  }) as $Result<T>
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
