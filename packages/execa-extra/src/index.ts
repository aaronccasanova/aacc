import { command, Options, ExecaChildProcess } from 'execa'

const SPACES_REGEXP = / +/g

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

function parseTemplate(
  template: string,
  index: number,
  templates: TemplateStringsArray,
  expressions: Expression[],
) {
  const templateString = template ?? templates.raw[index]
  const templateTokens = templateString.split(SPACES_REGEXP).filter(Boolean)

  if (index === expressions.length) return templateTokens

  const expression = expressions[index]

  return Array.isArray(expression)
    ? [...templateTokens, ...expression.map(String)]
    : [...templateTokens, String(expression)]
}

function parseTemplates(
  templates: TemplateStringsArray,
  expressions: Expression[],
) {
  return templates.flatMap((template, index) =>
    parseTemplate(template, index, templates, expressions),
  )
}

function isTemplateStringsArray(value: unknown): value is TemplateStringsArray {
  return Array.isArray(value)
}
