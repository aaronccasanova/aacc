import React from 'react'

export function isServer() {
  const isDOM =
    typeof window !== 'undefined' &&
    window.document &&
    window.document.documentElement

  return !isDOM
}

/** Checks if Web Notification API supported. */
export function isSupported() {
  return !isServer() && 'Notification' in window
}

export const useIsomorphicLayoutEffect = isServer()
  ? React.useEffect
  : React.useLayoutEffect
