/**
 * Detects if the current environment is Node.js.
 * - https://github.com/sindresorhus/make-asynchronous/blob/8be62c951084a3a950bc168f6a041c3d1d962cab/index.js#L4
 * - https://deno.com/blog/dnt-oak
 */
export const isNode = () => Boolean(globalThis.process?.versions?.node)

/**
 * Detects if the current environment is Deno.
 * - https://github.com/sindresorhus/make-asynchronous/blob/8be62c951084a3a950bc168f6a041c3d1d962cab/index.js#L4
 * - https://deno.com/blog/dnt-oak
 */
export const isDeno = () => Boolean('Deno' in globalThis)
