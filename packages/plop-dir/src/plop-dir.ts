import * as path from 'node:path'
import * as fs from 'node:fs'

// @ts-expect-error
import type { NodePlopAPI, PlopGeneratorConfig } from 'plop'

interface PlopDirOptions {
  plop: NodePlopAPI
  templateDir: string
  outputDir: string
  description?: string
  // TODO: Add support for overriding inferred prompts
}

export const plopDirActionType = 'plop-dir'

export async function plopDir(
  options: PlopDirOptions,
): Promise<PlopGeneratorConfig> {
  const { plop, templateDir, outputDir, description = '' } = options

  const templateFiles = await getTemplateFiles(templateDir)

  const templateFilesPromptNames = dedupe(
    (await Promise.all(templateFiles.map(getTemplateFilePromptNames))).flat(),
  )

  plop.setActionType(plopDirActionType, async (answers) => {
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
  })

  return {
    description,
    prompts: templateFilesPromptNames.map((promptName) => ({
      type: 'input',
      name: promptName,
      message: `Enter ${promptName}`,
    })),
    actions: [{ type: plopDirActionType }],
  }
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