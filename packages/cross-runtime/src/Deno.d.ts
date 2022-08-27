declare namespace Deno {
  function readTextFile(path: string | URL): Promise<string>

  function writeTextFile(
    path: string | URL,
    data: string,
    options: {
      encoding?: 'utf-8'
      append?: boolean
      create?: boolean
    },
  ): Promise<void>
}
