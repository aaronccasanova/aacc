declare namespace Deno {
  function readTextFile(path: string | URL): Promise<string>

  interface ReadFileOptions {
    signal?: AbortSignal
  }
  function readFile(
    path: string | URL,
    options?: ReadFileOptions,
  ): Promise<Uint8Array>

  interface WriteFileOptions {
    append?: boolean
    create?: boolean
    mode?: number
    signal?: AbortSignal
  }

  function writeFile(
    path: string | URL,
    data: Uint8Array,
    options?: WriteFileOptions,
  ): Promise<void>

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
