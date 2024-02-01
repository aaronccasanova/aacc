import * as url from 'node:url'

import { config } from 'dotenv'
import { z } from 'zod'

config({
  path: url.fileURLToPath(new URL('../../../.env', import.meta.url)),
})

const envSchema = z.object({
  OPENAI_API_KEY: z.string(),
})

envSchema.parse(process.env)
