# grouped-css-properties

Grouped CSS Properties is a library of all known CSS properties categorized into
groups.

> Note: These groupings will priorities usages in design systems, static
> analysis, and other similar tooling.

## Installation

```sh
npm i grouped-css-properties
```

## Usage

### `groupCSSProperties`

A collection of all known CSS properties categorized into groups.

```js
import { groupedCSSProperties } from 'grouped-css-properties'

console.log(groupedCSSProperties) // { colors: [...], layout: [...], ... }
```

Alternatively, you can import individual CSS property groups.

```js
import { colors, layout } from 'grouped-css-properties'

console.log(colors) // colors: [...]
console.log(layout) // layout: [...]
```
