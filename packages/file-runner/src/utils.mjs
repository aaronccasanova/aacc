/**
 * Parameter: async iterable of chunks (strings)
 * Result: async iterable of lines (incl. newlines)
 */
export async function* chunksToLines(chunksAsync, withNewlines = false) {
  let previous = ''

  for await (const chunk of chunksAsync) {
    previous += chunk

    let eolIndex

    while ((eolIndex = previous.indexOf('\n')) >= 0) {
      // line includes the EOL
      const line = previous.slice(0, withNewlines ? eolIndex + 1 : eolIndex)

      yield line

      previous = previous.slice(eolIndex + 1)
    }
  }

  if (previous.length > 0) {
    yield previous
  }
}
