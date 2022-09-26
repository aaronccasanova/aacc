# use-listener

The **most** type safe React hook for adding and removing event listeners.

Supports the following event targets:

- `Window`
- `Document`
- `HTMLElement`
- `React.RefObject<HTMLElement>`

## Installation

```sh
npm install use-listener
```

## Usage

### With default target (`Window`)

```tsx
import { useListener } from 'use-listener'

function App() {
  useListener('click', (e) => console.log(e))

  return <div>Use listener</div>
}
```

> The `click` event and default `Window` target are used to resolve the event
> object type (`MouseEvent`).

### With explicit target (`Document`)

```tsx
import { useListener } from 'use-listener'

function App() {
  useListener('copy', (e) => console.log(e), window.document)

  return <div>Use listener</div>
}
```

> Note: The `copy` event and explicit `Document` target are used to resolve the
> event object type (`ClipboardEvent`).

### With React `ref` (`HTMLDivElement`)

```tsx
import { useListener } from 'use-listener'

function App() {
  const ref = React.useRef<HTMLDivElement>(null)

  useListener('mouseover', (e) => console.log(e), ref)

  return <div ref={ref}>Use listener</div>
}
```

> Note: The `mouseover` event and inferred `HTMLDivElement` target are used to
> resolve the event object type (`MouseEvent`)

### Dynamic React `ref` (`HTMLParagraphElement`)

```jsx
import React from 'react'
import { useListener } from 'use-listener'

function App() {
  const [element, ref] = useElementRef<HTMLParagraphElement>()
  const [on, setOn] = React.useState(false)

  useListener('mouseover', (e) => console.log(e), element)

  return (
    <div>
      {on && <p ref={ref}>Hover me</p>}
      <button onClick={() => setOn((prevOn) => !prevOn)}>
        Toggle element
      </button>
    </div>
  )
}

function useElementRef<T extends HTMLElement>() {
  const [node, setNode] = React.useState<T | null>(null)

  const ref: React.RefCallback<T> = React.useCallback((node) => {
    if (node !== null) setNode(node)
  }, [])

  return [node, ref] as const
}
```

> Note: The `mouseover` event and dynamically set `HTMLParagraphElement` target
> are used to resolve the event object type (`MouseEvent`)
