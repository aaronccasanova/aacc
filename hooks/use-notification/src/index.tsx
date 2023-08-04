/**
 * Notification API Docs:
 * https://developer.mozilla.org/en-US/docs/Web/API/Notification
 */
import React from 'react'

import { isSupported, useIsomorphicLayoutEffect } from './utils'

interface NotificationState {
  permission: NotificationPermission | null
  error: Error | null
}

type NotificationAction = Partial<NotificationState>

type NotificationReducer = (
  prevState: NotificationState,
  action: NotificationAction,
) => NotificationState

/** Prevents updating state on an unmounted component. */
function useSafeDispatch(
  dispatch: React.Dispatch<React.ReducerAction<NotificationReducer>>,
) {
  const mounted = React.useRef(false)

  useIsomorphicLayoutEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    (action: NotificationAction) => {
      if (mounted.current) dispatch(action)
    },
    [dispatch],
  )
}

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

export function useNotification(): UseNotificationReturnType {
  const supported = isSupported()

  const [{ permission, error }, setState] =
    React.useReducer<NotificationReducer>(
      (prevState, action) => ({ ...prevState, ...action }),
      {
        permission: supported ? Notification.permission : null,
        error: !supported
          ? new Error('This browser does not support web notifications.')
          : null,
      },
    )

  const safeSetState = useSafeDispatch(setState)

  const requestPermission = React.useCallback(async () => {
    try {
      if (!supported || permission !== 'default') return

      const notificationPermission = await Notification.requestPermission()

      // Update permission status and clear out any errors.
      safeSetState({
        permission: notificationPermission,
        error: null,
      })
    } catch {
      // Fallback to the deprecated callback API.
      Notification.requestPermission((notificationPermission) => {
        // Update permission status and clear out any errors.
        safeSetState({
          permission: notificationPermission,
          error: null,
        })
      }).catch((deprecatedCallbackError) => {
        if (deprecatedCallbackError instanceof Error) {
          safeSetState({ error: deprecatedCallbackError })
        }
      })
    }
  }, [permission, supported])

  const notify = React.useCallback(
    (title: Notification['title'], options?: NotificationOptions) => {
      if (!supported || permission !== 'granted') return null

      try {
        const notification = new Notification(title, options)

        // Clear out possible errors in state.
        safeSetState({ error: null })

        return notification
      } catch (notificationError) {
        if (notificationError instanceof Error) {
          safeSetState({ error: notificationError })
        }

        return null
      }
    },
    [permission, supported],
  )

  return {
    permission,
    error,
    requestPermission,
    notify,
  }
}
