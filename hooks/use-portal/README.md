# use-portal

React hook wrapping the React Portals API.

## Usage

```bash
npm install use-portal
```

```tsx
import { usePortal } from 'use-portal'
```

## usePortal Options

```tsx
interface UsePortalOptions {
  /**
   * Element the Portal is attached to.
   *
   * Defaults to `document.body`.
   */
  target?: HTMLElement
  /**
   * Element that wraps the child content of the Portal component.
   *
   * Defaults to `div`.
   */
  container?: HTMLElement
  /**
   * Defines where the Portal is inserted into the `target` element.
   *
   * Defaults to 'append'.
   */
  insertionOrder?: 'append' | 'prepend'
}
```

## usePortal ReturnType

```tsx
export interface UsePortalReturnType {
  /**
   * Portal component that renders child content into
   * the `target` DOM element.
   */
  Portal: (props: PortalProps) => React.ReactPortal | null
  /**
   * Element the Portal is attached to.
   *
   * Defaults to `document.body`.
   */
  target: HTMLElement | null
  /**
   * Element that wraps the child content of the Portal component.
   *
   * Defaults to `div`.
   */
  container: HTMLElement | null
}
```

### Example: Simple Portal

[Demo](https://gt1o1.csb.app/) •
[Code Sandbox](https://codesandbox.io/s/simple-portal-gt1o1)

```tsx
import { usePortal } from 'use-portal'

function App() {
  const { Portal } = usePortal()

  const [clicks, setClicks] = React.useState(0)

  function handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    setClicks((prevClicks) => prevClicks + 1)
  }

  return (
    <div onClick={handleClick}>
      <h1>Parent {clicks}</h1>
      <Portal>
        <Child />
      </Portal>
    </div>
  )
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div>
      <h2>Child</h2>
      <button>Click</button>
    </div>
  )
}
```
