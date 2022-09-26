import React from 'react'

function isServer() {
  const isDOM =
    typeof window !== 'undefined' &&
    window.document &&
    window.document.documentElement

  return !isDOM
}

export const useIsomorphicLayoutEffect = isServer()
  ? React.useEffect
  : React.useLayoutEffect
