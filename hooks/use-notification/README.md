# use-notification

React hook wrapping the Web Notification API.

## Usage

```bash
npm install use-notification
```

```tsx
import { useNotification } from 'use-notification'
```

## useNotification ReturnType

```tsx
interface UseNotificationReturnType {
  /**
   * Represents the permission status for displaying web notifications on
   * the current origin.
   *
   * @example 'default' | 'denied' | 'granted'
   */
  permission: NotificationPermission | null
  /**
   * Any error thrown while initializing the Notification constructor.
   */
  error: Error | null
  /**
   * Requests permission to display web notifications.
   */
  requestPermission: () => Promise<void>
  /**
   * Triggers a web notification.
   *
   * Note: The function signature matches the web Notification constructor one
   * to one. See the MDN documentation for more information:
   * https://developer.mozilla.org/en-US/docs/Web/API/Notification
   */
  notify: (
    title: Notification['title'],
    options?: NotificationOptions,
  ) => Notification | null
}
```

## Examples

Note: The API is intentionally minimal and unopinionated to ensure the hook is
flexible enough to handle multiple use cases. The following examples demonstrate
some common configurations.

### Example: Simple Notification

[Demo](https://1pb5m.csb.app/) •
[Code Sandbox](https://codesandbox.io/s/simple-notification-1pb5m)

```tsx
import { useNotification } from 'use-notification'

function App() {
  const { permission, error, requestPermission, notify } = useNotification()

  if (error) {
    return (
      <div>
        Notification Error:
        <pre>{error.message}</pre>
      </div>
    )
  }

  return (
    <div>
      {permission === 'default' && (
        <button onClick={requestPermission}>Enable Notifications</button>
      )}
      <button onClick={() => notify('Hi')}>Notify</button>
    </div>
  )
}
```

### Example: Stacked Notifications

[Demo](https://e284g.csb.app/) •
[Code Sandbox](https://codesandbox.io/s/stacked-notification-e284g)

- Clicking `Notify` will continually add/stack notifications.
- Clicking `Close Notifications` closes notifications starting from the top of
  the stack.

```tsx
import { useNotification } from 'use-notification'

function App() {
  const { permission, error, requestPermission, notify } = useNotification()
  const notifications = React.useRef<Notification[]>([])

  function handleNotify() {
    const notification = notify('Hi')

    if (notification) {
      notifications.current.push(notification)
    }
  }

  function handleClose() {
    notifications.current.pop()?.close()
  }

  if (error) {
    return (
      <div>
        Notification Error:
        <pre>{error.message}</pre>
      </div>
    )
  }

  return (
    <div>
      {permission === 'default' && (
        <button onClick={requestPermission}>Enable Notifications</button>
      )}
      <button onClick={handleNotify}>Notify</button>
      <button onClick={handleClose}>Close Notifications</button>
    </div>
  )
}
```

### Example: Replace Notification

[Demo](https://gx5wl.csb.app/) •
[Code Sandbox](https://codesandbox.io/s/replace-notification-gx5wl)

```tsx
import { useNotification } from 'use-notification'

function App() {
  const { permission, error, requestPermission, notify } = useNotification()
  const notifcation = React.useRef<null | Notification>(null)
  const title = React.useRef('')

  function handleNotify() {
    title.current = title.current !== 'Hi' ? 'Hi' : 'Bye'

    notifcation.current = notify(title.current, {
      // Because this tag is static it will replace any existing notifications.
      tag: 'Replace Notification',
    })
  }

  function handleClose() {
    notifcation.current?.close()
  }

  if (error) {
    return (
      <div>
        Notification Error:
        <pre>{error.message}</pre>
      </div>
    )
  }

  return (
    <div>
      {permission === 'default' && (
        <button onClick={requestPermission}>Enable Notifications</button>
      )}
      <button onClick={handleNotify}>Notify</button>
      <button onClick={handleClose}>Close Notification</button>
    </div>
  )
}
```
