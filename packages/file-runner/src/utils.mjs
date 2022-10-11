import * as readline from 'node:readline'

export async function getStdinFiles() {
  const files = []

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  for await (const line of rl) {
    files.push(line)
  }

  return files
}
