import * as path from 'node:path'
import * as fs from 'node:fs'

import type {
  NodePlopAPI,
  PlopGeneratorConfig,
  CustomActionFunction,
  // @ts-expect-error
} from 'plop'

type PlopPromptQuestion = Extract<PlopGeneratorConfig['prompts'], any[]>[number]

const plopDirActionType = 'plop-dir'

interface PlopDirActionData {
  outputDir: PlopDirOptions['outputDir']
  templateDir: PlopDirOptions['templateDir']
  templateFiles: string[]
}

export interface PlopDirOptions {
  plop: NodePlopAPI
  templateDir: string
  outputDir: string
  description?: string
  prompts?: Partial<PlopPromptQuestion>[]
}

export async function plopDir(
  options: PlopDirOptions,
): Promise<PlopGeneratorConfig> {
  const {
    plop,
    templateDir,
    outputDir,
    description = '',
    prompts = [],
  } = options

  const templateFiles = await getTemplateFiles(templateDir)

  const templateFilesPromptNames = dedupe(
    (await Promise.all(templateFiles.map(getTemplateFilePromptNames))).flat(),
  )

  plop.setActionType(plopDirActionType, handlePlopDirActionType)

  const plopDirActionData: PlopDirActionData = {
    outputDir,
    templateDir,
    templateFiles,
  }

  return {
    description,
    prompts: templateFilesPromptNames.map((promptName) => ({
      type: 'input',
      name: promptName,
      message: `Enter ${promptName}`,
      ...prompts.find((prompt) => prompt.name === promptName),
    })),
    actions: [
      {
        type: plopDirActionType,
        data: plopDirActionData,
      },
    ],
  }
}

type CustomActionFunctionArgs = Parameters<CustomActionFunction>

async function handlePlopDirActionType(...args: CustomActionFunctionArgs) {
  const [answers, config, plop] = args

  const { outputDir, templateDir, templateFiles } =
    config.data as PlopDirActionData

  await Promise.all(
    templateFiles.map(async (templateFile) => {
      const templateFileContent = await fs.promises.readFile(
        templateFile,
        'utf8',
      )

      const renderedTemplateFileContent = plop.renderString(
        templateFileContent,
        answers,
      )

      const templateFilePath = templateFile
        .replace(`${templateDir}${path.sep}`, '')
        .replace('.hbs', '')

      const outputTemplateFilePath = path.resolve(outputDir, templateFilePath)

      const renderedTemplateFileOutputPath = plop.renderString(
        outputTemplateFilePath,
        answers,
      )

      await fs.promises.mkdir(path.dirname(renderedTemplateFileOutputPath), {
        recursive: true,
      })

      await fs.promises.writeFile(
        renderedTemplateFileOutputPath,
        renderedTemplateFileContent,
      )
    }),
  )

  return `successfully wrote files to ${outputDir}`
}

const handlebarsTemplateRegExp = /{{(.+?)}}/g

/**
 * Extracts prompt names from a string with handlebars templates
 * and returns the deduplicated results.
 */
function getPromptNames(text: string) {
  return dedupe(
    Array.from(text.matchAll(handlebarsTemplateRegExp))
      .map((handlebarsTemplateMatch): string => {
        const handlebarsTemplate = handlebarsTemplateMatch[1] ?? ''
        const splitTemplate = handlebarsTemplate.split(/\s+/)
        const promptName = splitTemplate[splitTemplate.length - 1]?.trim()

        return promptName ?? ''
      })
      .filter(Boolean),
  )
}

async function getTemplateFilePromptNames(file: string) {
  const content = await fs.promises.readFile(file, 'utf8')

  const filePathPromptNames = getPromptNames(file)
  const fileContentPromptNames = getPromptNames(content)

  return dedupe([...filePathPromptNames, ...fileContentPromptNames])
}

async function getTemplateFiles(dir: string): Promise<string[]> {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })

  let files: string[] = []

  await Promise.all(
    dirents.map(async (dirent) => {
      const direntPath = path.resolve(dir, dirent.name)

      if (dirent.isDirectory()) {
        files = files.concat(await getTemplateFiles(direntPath))
      } else {
        files.push(direntPath)
      }
    }),
  )

  return files
}

function dedupe(array: string[]) {
  return Array.from(new Set(array))
}
