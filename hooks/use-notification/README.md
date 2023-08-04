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
