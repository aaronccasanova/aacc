import * as path from 'node:path'

import { config } from 'dotenv'
import { z } from 'zod'

export function loadEnv() {
  config({
    path: path.join(__dirname, '../../../.env'),
  })

  const envSchema = z.object({
    OPENAI_API_KEY: z.string(),
  })

  envSchema.parse(process.env)
}
