const fallbackMap = {
  '--gloria-primary': '#f5c6aa',
  '--gloria-primary-light': '#f7e7dc',
  '--gloria-primary-dark': '#0f2854'
}

export const getThemeColor = (varName, fallback) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback || fallbackMap[varName] || ''
  }

  const computed = getComputedStyle(document.documentElement).getPropertyValue(varName)
  if (computed && computed.trim().length > 0) {
    return computed.trim()
  }

  return fallback || fallbackMap[varName] || ''
}
