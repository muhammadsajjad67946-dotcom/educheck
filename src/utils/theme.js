export const THEME_STORAGE_KEY = 'educheck_dark_mode'

export function getInitialDarkMode() {
  try {
    const storage = typeof globalThis !== 'undefined' && 'localStorage' in globalThis ? globalThis.localStorage : null

    if (storage) {
      const savedTheme = storage.getItem(THEME_STORAGE_KEY)
      if (savedTheme !== null) {
        return savedTheme === 'true'
      }
    }
  } catch (error) {
    console.warn('Unable to read saved theme preference:', error)
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  return true
}

export function applyTheme(darkMode) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light'
  document.documentElement.classList.toggle('dark', darkMode)
}
