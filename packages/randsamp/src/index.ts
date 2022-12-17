import * as fs from 'node:fs'
import * as path from 'node:path'

import globby from 'globby'

export interface RandsampOptions {
  /**
   * The target directory to collect and randomize samples.
   */
  targetDir: string
  /**
   * The output directory to save the randomized samples.
   */
  outputDir: string
  /**
   * The extension types of the samples to collect.
   *
   * @default ['.wav']
   */
  sampleExtensions?: string[]
  /**
   * The number of samples to hard link in the output directory.
   *
   * @default 128
   */
  sampleCount?: number
}

export async function randsamp(options: RandsampOptions) {
  const {
    targetDir,
    outputDir,
    sampleExtensions = ['.wav'],
    sampleCount = 128,
  } = options

  const absoluteTargetDir = path.resolve(process.cwd(), targetDir)
  const absoluteOutputDir = path.resolve(process.cwd(), outputDir)

  const sampleFiles = await globby(
    sampleExtensions
      .map((ext) => (ext.startsWith('.') ? ext : `.${ext}`))
      .map((ext) => `${absoluteTargetDir}/**/*${ext}`),
  )

  if (!sampleFiles.length) {
    throw new Error('No sample found.')
  }

  const randomizedSampleFiles = sampleFiles.sort(() => Math.random() - 0.5)

  const targetSampleFiles = randomizedSampleFiles.slice(0, sampleCount)

  if (!fs.existsSync(absoluteOutputDir)) {
    await fs.promises.mkdir(absoluteOutputDir)
  }

  await Promise.all(
    targetSampleFiles.map(async (targetSampleFile) => {
      const outputSampleFile = path.join(
        outputDir,
        path.basename(targetSampleFile),
      )

      await fs.promises.link(targetSampleFile, outputSampleFile)

      if (fs.existsSync(`${targetSampleFile}.asd`)) {
        await fs.promises.link(
          `${targetSampleFile}.asd`,
          `${outputSampleFile}.asd`,
        )
      }
    }),
  )
}
