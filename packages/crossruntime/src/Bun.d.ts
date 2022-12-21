declare namespace Bun {
  // https://github.com/oven-sh/bun#bunwrite--optimizing-io
  function write(
    destination: string | number | FileBlob,
    input: string | FileBlob | Blob | ArrayBufferView,
  ): Promise<number>
}

declare namespace NodeJS {
  interface Process {
    isBun?: number
  }
}
