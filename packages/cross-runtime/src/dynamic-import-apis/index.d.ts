export type BunWrite = typeof import('./bun/write.js').write

export type DenoReadFile = typeof import('./deno/readFile.js').readFile

export type DenoReadTextFile =
  typeof import('./deno/readTextFile.js').readTextFile

export type DenoWriteFile = typeof import('./deno/writeFile.js').writeFile

export type DenoWriteTextFile =
  typeof import('./deno/writeTextFile.js').writeTextFile

export type NodeReadFile = typeof import('./node/readFile.js').readFile

export type NodeWriteFile = typeof import('./node/writeFile.js').writeFile
