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

type $SyncResult<T extends TemplatesOrOptions> = T extends TemplateStringsArray
  ? ExecaSyncReturnValue
  : (
      templates: TemplateStringsArray,
      ...expressions: Expression[]
    ) => T extends { encoding: null }
      ? ExecaSyncReturnValue<Buffer>
      : ExecaSyncReturnValue

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

$.sync = <T extends TemplatesOrOptions>(
  templatesOrOptions: T,
  ...expressions: Expression[]
): $SyncResult<T> => {
  if (isTemplateStringsArray(templatesOrOptions)) {
    const [file = '', ...args] = parseTemplates(templatesOrOptions, expressions)
    return execa.sync(file, args) as $SyncResult<T>
  }

  return ((templates, ...innerExpressions) => {
    const [file = '', ...args] = parseTemplates(templates, innerExpressions)
    return execa.sync(
      file,
      args,
      // @ts-expect-error - Execa types do allow `null` for `encoding`
      templatesOrOptions,
    )
  }) as $SyncResult<T>
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
