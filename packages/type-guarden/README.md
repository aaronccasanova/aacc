# type-guarden 🌱

Collection of type guards for TypeScript.

## Installation

```sh
npm install type-guarden
```

## Usage

```ts
import { isKeyOf, isElementOf } from 'type-guarden'

const obj = {
  foo: 'bar',
  baz: 42,
}

const arr = ['foo', 'bar', 'baz']

if (isKeyOf(obj, key)) {
  // `key` is 'foo' | 'baz'
}

if (isElementOf(arr, element)) {
  // `element` is 'foo' | 'bar' | 'baz'
}
```
