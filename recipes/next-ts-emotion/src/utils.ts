export function isBrowser() {
  const isDOM =
    typeof window !== 'undefined' &&
    window.document &&
    window.document.documentElement

  return !!isDOM
}

export function isServer() {
  const isDOM =
    typeof window !== 'undefined' &&
    window.document &&
    window.document.documentElement

  return !isDOM
}
