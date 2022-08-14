export default function processor(options) {
  const { fileContent, tallyIterations } = options

  const result = {}

  for (let i = 0; i < tallyIterations; i++) {
    for (const char of fileContent) {
      result[char] = (result[char] ?? 0) + 1
    }
  }

  return result
}
