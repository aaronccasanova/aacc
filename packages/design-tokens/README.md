# @aacc/design-tokens

Design tokens for @aacc apps and packages.

## Installation

```sh
npm i @aacc/design-tokens
```

## Usage

### CSS API

#### Theme variables

Include the `theme` styles directly if you bundler supports CSS imports:

```js
import '@aacc/design-tokens/css/theme-vars.css'
```

Otherwise, include the `theme` styles in your HTML:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@aacc/design-tokens@{version}/dist/css/theme-vars.css"
/>
```

### JavaScript API

#### Theme object

```js
import { dark, dim, light } from '@aacc/design-tokens/themes'
```

```js
const { dark, dim, light } = require('@aacc/design-tokens/themes')
```

### All the things

```js
import {
  designTokens,
  themes,
  lightTheme,
  darkTheme,
  dimTheme,
  colors,
  spacing,
  // etc...
} from '@aacc/design-tokens'
```
