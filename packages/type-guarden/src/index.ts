// Many APIs extracted from https://github.com/sindresorhus/is/blob/main/source/index.ts

// https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABDAzgaQKYE8DywA8AKohgB5QZgAmKicARgFYbQB8AFA4wFyKEA0iANbYA-LwCGYLAEpeIrMloK4wPogDeAKESIAThigg9SHExZQAdAAc9cKPazWMlgBYSUOAO5gACnec9KCxLCAkAG3DOJkEFRA9EfzhA4MxZLQBfLS0IBBQoOiZEAF5NRGA4OF4AcnoJPWrBACZeKD0QDEQM+NpcsHycvIKFXnAhMDgfEsRq6uyuAG0FAF1smDV2VDS8aMZY7BkZTR1hbBOAenPEAD1RbN0+-MQANwiO6cWVi6vdG7usoA
export function isKeyOf<T extends object>(
  obj: T,
  key?: unknown,
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key as PropertyKey)
}

// https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABDAzgUQDYFMC2WxQDywAPACqJYAeU+AJiogE5YCGdCGAnoq2FwG0AugD4AFAChEvJkwBciMgBoplbHgIB+BXy4qAlAqzr8UZIzICwIHACMsTIYgDeqllBBMkrWQDoYkBggdFgoYsa4pvoSAL4SEhAIKGY+TIgAvIgCAOTAcHDZSogATE6sjIlgyRLYZhEaUArgANZgcADuYADc8ZXJiHC2AFYKzlkA0shIUFwADlhwwDJMVjb2jkIKyUwBAOaIAD6ItvnYfIgxGS6qeXAK2bY+harFClBMIFgqcRKDQwL1UxCeIwJZiVCYSIEYhiVJFQEEfT6a7SBFQVQAegxiAAepp4tI+mYAG6sIJYK5-AEmAjA6RY6TSPGxIA
export function isElementOf<T extends readonly unknown[]>(
  arr: T,
  element?: unknown,
): element is T[number] {
  return arr.includes(element)
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

export function isBoolean(value: unknown): value is boolean {
  return value === true || value === false
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined'
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

// https://www.npmjs.com/package/is-obj
export function isObject(value: unknown): value is object {
  const typeofResult = typeof value

  return (
    !isNull(value) && (typeofResult === 'object' || typeofResult === 'function')
  )
}

// https://www.npmjs.com/package/is-plain-obj
export function isPlainObject<Value>(
  value: unknown,
): value is Record<PropertyKey, Value> {
  if (!isObject(value)) return false

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const prototype = Object.getPrototypeOf(value)

  return (
    (isNull(prototype) ||
      prototype === Object.prototype ||
      isNull(Object.getPrototypeOf(prototype))) &&
    !(Symbol.toStringTag in value) &&
    !(Symbol.iterator in value)
  )
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    isObject(value) &&
    // @ts-expect-error
    isFunction(value.then) &&
    // @ts-expect-error
    isFunction(value.catch)
  )
}

const typeofPrimitiveResults = [
  'bigint',
  'boolean',
  'null',
  'number',
  'string',
  'symbol',
  'undefined',
]

type Primitive = bigint | boolean | null | number | string | symbol | undefined

export function isPrimitive(value: unknown): value is Primitive {
  return isNull(value) || typeofPrimitiveResults.includes(typeof value)
}
type Falsy = false | 0 | 0n | '' | null | undefined

export function isTruthy<T>(value: T | Falsy): value is T {
  return Boolean(value)
}

export function isFalsy<T>(value: T | Falsy): value is Falsy {
  return !value
}
